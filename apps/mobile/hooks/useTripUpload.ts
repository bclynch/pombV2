import { useState, useCallback } from "react";
import * as toGeoJSON from "@tmcw/togeojson";
import { DOMParser } from "@xmldom/xmldom";
import * as turf from "@turf/turf";
import { supabase } from "@/lib/supabase";
import type { Feature, LineString, MultiLineString } from "geojson";

interface UploadFile {
  uri: string;
  name: string;
  mimeType?: string;
}

interface UploadProgress {
  phase: "idle" | "parsing" | "uploading" | "saving" | "complete" | "error";
  current: number;
  total: number;
  message: string;
}

interface UseTripUploadResult {
  upload: (tripId: string, files: UploadFile[]) => Promise<void>;
  progress: UploadProgress;
  error: string | null;
}

export function useTripUpload(): UseTripUploadResult {
  const [progress, setProgress] = useState<UploadProgress>({
    phase: "idle",
    current: 0,
    total: 0,
    message: "",
  });
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (tripId: string, files: UploadFile[]) => {
    setError(null);
    setProgress({ phase: "parsing", current: 0, total: files.length, message: "Parsing GPX files..." });

    try {
      const allLineStrings: Feature<LineString>[] = [];

      // 1. Parse all GPX files
      for (let i = 0; i < files.length; i++) {
        setProgress({
          phase: "parsing",
          current: i + 1,
          total: files.length,
          message: `Parsing ${files[i].name}...`,
        });

        const response = await fetch(files[i].uri);
        const gpxString = await response.text();

        const gpxDoc = new DOMParser().parseFromString(gpxString, "text/xml");
        // Cast needed: @xmldom/xmldom Document type differs from browser Document type
        const geoJson = toGeoJSON.gpx(gpxDoc as unknown as Document);

        // Extract LineString features
        const lines = geoJson.features.filter(
          (f): f is Feature<LineString> => f.geometry?.type === "LineString"
        );
        allLineStrings.push(...lines);
      }

      if (allLineStrings.length === 0) {
        throw new Error("No track data found in GPX files");
      }

      // 2. Fetch existing geometry and merge
      setProgress({
        phase: "parsing",
        current: files.length,
        total: files.length,
        message: "Merging with existing tracks...",
      });

      // Fetch existing geometry for this trip
      const { data: existingTrip } = await supabase
        .from("trips")
        .select("summary_geometry")
        .eq("id", tripId)
        .single();

      // Start with new coordinates
      let allCoordinates = allLineStrings.map((f) => f.geometry.coordinates);

      // If there's existing geometry, fetch as GeoJSON and merge
      if (existingTrip?.summary_geometry) {
        try {
          const { data: geojsonResult } = await supabase
            .rpc("get_trip_geometry_geojson" as never, { trip_id: tripId } as never);

          if (geojsonResult) {
            const existingGeometry = JSON.parse(geojsonResult);
            if (existingGeometry.type === "MultiLineString") {
              // Prepend existing coordinates to keep chronological order
              allCoordinates = [...existingGeometry.coordinates, ...allCoordinates];
            } else if (existingGeometry.type === "LineString") {
              allCoordinates = [existingGeometry.coordinates, ...allCoordinates];
            }
          }
        } catch {
          // Could not parse existing geometry, will replace with new
        }
      }

      // Combine all coordinates into a single MultiLineString
      const multiLine: Feature<MultiLineString> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiLineString",
          coordinates: allCoordinates,
        },
      };

      // Simplify to reduce jitter (tolerance ~10 meters)
      const simplified = turf.simplify(multiLine, { tolerance: 0.0001, highQuality: true });

      // Calculate bounds
      const bbox = turf.bbox(simplified);
      const [minLng, minLat, maxLng, maxLat] = bbox;

      // 3. Upload raw files to R2
      setProgress({
        phase: "uploading",
        current: 0,
        total: files.length,
        message: "Uploading files to storage...",
      });

      for (let i = 0; i < files.length; i++) {
        setProgress({
          phase: "uploading",
          current: i + 1,
          total: files.length,
          message: `Uploading ${files[i].name}...`,
        });

        // Get presigned URL from edge function
        const { data: signedUrlData, error: signedUrlError } = await supabase.functions.invoke(
          "upload-gpx",
          {
            body: {
              filename: files[i].name,
              fileType: files[i].mimeType || "application/gpx+xml",
              tripId,
            },
          }
        );

        if (signedUrlError || !signedUrlData?.uploadUrl) {
          console.warn(`Failed to get signed URL for ${files[i].name}:`, signedUrlError);
          continue; // Skip this file but continue with others
        }

        // Upload file to R2
        const fileResponse = await fetch(files[i].uri);
        const fileBlob = await fileResponse.blob();

        const uploadResponse = await fetch(signedUrlData.uploadUrl, {
          method: "PUT",
          body: fileBlob,
          headers: {
            "Content-Type": files[i].mimeType || "application/gpx+xml",
          },
        });

        if (!uploadResponse.ok) {
          console.warn(`Failed to upload ${files[i].name} to R2`);
          continue;
        }

        // Record upload in database
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          await supabase.from("trip_uploads").insert({
            trip_id: tripId,
            user_id: session.session.user.id,
            filename: files[i].name,
            r2_key: signedUrlData.key,
            file_size_bytes: fileBlob.size,
          });
        }
      }

      // 4. Save merged geometry to trips table
      setProgress({
        phase: "saving",
        current: 1,
        total: 1,
        message: "Saving trip geometry...",
      });

      // Convert to WKT for PostGIS
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
