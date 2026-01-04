import { useState, useCallback } from "react";
import * as toGeoJSON from "@tmcw/togeojson";
import * as turf from "@turf/turf";
import { supabase } from "../lib/supabase";
import type { Feature, LineString, MultiLineString, Position } from "geojson";

type UploadProgress = {
  phase: "idle" | "parsing" | "uploading" | "saving" | "complete" | "error";
  current: number;
  total: number;
  message: string;
};

type ParsedFile = {
  file: File;
  lines: Feature<LineString>[];
  coordinates: Position[][];
};

type UseTripUploadResult = {
  upload: (tripId: string, files: File[]) => Promise<void>;
  progress: UploadProgress;
  error: string | null;
};

function getSegmentName(filename: string): string {
  // Remove file extension
  return filename.replace(/\.[^/.]+$/, "");
}

function coordinatesToWkt(coordinates: Position[][]): string {
  const wktCoords = coordinates
    .map((line) => `(${line.map((c) => `${c[0]} ${c[1]}`).join(", ")})`)
    .join(", ");
  return `SRID=4326;MULTILINESTRING(${wktCoords})`;
}

export function useTripUpload(): UseTripUploadResult {
  const [progress, setProgress] = useState<UploadProgress>({
    phase: "idle",
    current: 0,
    total: 0,
    message: "",
  });
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (tripId: string, files: File[]) => {
    setError(null);
    setProgress({ phase: "parsing", current: 0, total: files.length, message: "Parsing GPX files..." });

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to upload files");
      }
      const userId = session.session.user.id;

      // 1. Parse all GPX files and store per-file data
      const parsedFiles: ParsedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        setProgress({
          phase: "parsing",
          current: i + 1,
          total: files.length,
          message: `Parsing ${files[i].name}...`,
        });

        const gpxString = await files[i].text();
        const gpxDoc = new DOMParser().parseFromString(gpxString, "text/xml");
        const geoJson = toGeoJSON.gpx(gpxDoc);

        // Extract LineString features
        const lines = geoJson.features.filter(
          (f): f is Feature<LineString> => f.geometry?.type === "LineString"
        );

        if (lines.length > 0) {
          parsedFiles.push({
            file: files[i],
            lines,
            coordinates: lines.map((f) => f.geometry.coordinates),
          });
        }
      }

      if (parsedFiles.length === 0) {
        throw new Error("No track data found in GPX files");
      }

      // 2. Get current segment count for sort_order
      const { count: segmentCount } = await supabase
        .from("trip_segments")
        .select("*", { count: "exact", head: true })
        .eq("trip_id", tripId);

      let currentSortOrder = (segmentCount ?? 0) + 1;

      // 3. Collect all coordinates for trip summary geometry
      setProgress({
        phase: "parsing",
        current: files.length,
        total: files.length,
        message: "Merging with existing tracks...",
      });

      const { data: existingTrip } = await supabase
        .from("trips")
        .select("summary_geometry")
        .eq("id", tripId)
        .single();

      let allCoordinates: Position[][] = parsedFiles.flatMap((pf) => pf.coordinates);

      if (existingTrip?.summary_geometry) {
        try {
          const { data: geojsonResult } = await supabase
            .rpc("get_trip_geometry_geojson" as never, { trip_id: tripId } as never);

          if (geojsonResult) {
            const existingGeometry = JSON.parse(geojsonResult as string);
            if (existingGeometry.type === "MultiLineString") {
              allCoordinates = [...existingGeometry.coordinates, ...allCoordinates];
            } else if (existingGeometry.type === "LineString") {
              allCoordinates = [existingGeometry.coordinates, ...allCoordinates];
            }
          }
        } catch {
          // Could not parse existing geometry, will replace with new
        }
      }

      const multiLine: Feature<MultiLineString> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiLineString",
          coordinates: allCoordinates,
        },
      };

      const simplified = turf.simplify(multiLine, { tolerance: 0.0001, highQuality: true });
      const bbox = turf.bbox(simplified);
      const [minLng, minLat, maxLng, maxLat] = bbox;

      // 4. Upload files, create segments, and link uploads
      setProgress({
        phase: "uploading",
        current: 0,
        total: parsedFiles.length,
        message: "Uploading files to storage...",
      });

      for (let i = 0; i < parsedFiles.length; i++) {
        const { file, coordinates } = parsedFiles[i];

        setProgress({
          phase: "uploading",
          current: i + 1,
          total: parsedFiles.length,
          message: `Uploading ${file.name}...`,
        });

        // Create segment for this file
        const segmentWkt = coordinatesToWkt(coordinates);
        const { data: segmentData, error: segmentError } = await supabase
          .from("trip_segments")
          .insert({
            trip_id: tripId,
            user_id: userId,
            name: getSegmentName(file.name),
            geometry: segmentWkt,
            sort_order: currentSortOrder++,
          })
          .select("id")
          .single();

        if (segmentError) {
          console.warn(`Failed to create segment for ${file.name}:`, segmentError);
          continue;
        }

        const segmentId = segmentData.id;

        // Upload file to R2
        const { data: signedUrlData, error: signedUrlError } = await supabase.functions.invoke(
          "upload-gpx",
          {
            body: {
              filename: file.name,
              fileType: file.type || "application/gpx+xml",
              tripId,
            },
          }
        );

        if (signedUrlError || !signedUrlData?.uploadUrl) {
          console.warn(`Failed to get signed URL for ${file.name}:`, signedUrlError);
          continue;
        }

        const uploadResponse = await fetch(signedUrlData.uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type || "application/gpx+xml",
          },
        });

        if (!uploadResponse.ok) {
          console.warn(`Failed to upload ${file.name} to R2`);
          continue;
        }

        // Create trip_upload record linked to segment
        await supabase.from("trip_uploads").insert({
          trip_id: tripId,
          user_id: userId,
          segment_id: segmentId,
          filename: file.name,
          r2_key: signedUrlData.key,
          file_size_bytes: file.size,
        });
      }

      // 4. Save merged geometry to trips table
      setProgress({
        phase: "saving",
        current: 1,
        total: 1,
        message: "Saving trip geometry...",
      });

      const wktCoords = simplified.geometry.coordinates
        .map((line) => `(${line.map((c) => `${c[0]} ${c[1]}`).join(", ")})`)
        .join(", ");
      const wkt = `SRID=4326;MULTILINESTRING(${wktCoords})`;

      const { error: updateError } = await supabase
        .from("trips")
        .update({
          summary_geometry: wkt,
          bounds_min_lat: minLat,
          bounds_min_lng: minLng,
          bounds_max_lat: maxLat,
          bounds_max_lng: maxLng,
        })
        .eq("id", tripId);

      if (updateError) {
        throw new Error(`Failed to save trip geometry: ${updateError.message}`);
      }

      setProgress({
        phase: "complete",
        current: files.length,
        total: files.length,
        message: "Upload complete!",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setProgress({
        phase: "error",
        current: 0,
        total: 0,
        message,
      });
    }
  }, []);

  return { upload, progress, error };
}
