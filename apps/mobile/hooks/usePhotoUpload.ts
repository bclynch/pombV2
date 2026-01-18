import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { supabase } from "@/lib/supabase";

type PhotoMetadata = {
  latitude: number | null;
  longitude: number | null;
  capturedAt: Date | null;
};

type UploadProgress = {
  phase: "idle" | "processing" | "uploading" | "saving" | "complete" | "error";
  current: number;
  total: number;
  message: string;
};

type UsePhotoUploadResult = {
  pickAndUpload: (tripId: string) => Promise<boolean>;
  progress: UploadProgress;
  error: string | null;
};

const THUMB_SIZE = 400;
const LARGE_MAX_SIZE = 1600;

function extractExifFromAsset(asset: ImagePicker.ImagePickerAsset): PhotoMetadata {
  // Use EXIF data from ImagePicker if available
  const exif = asset.exif;
  if (!exif) {
    return { latitude: null, longitude: null, capturedAt: null };
  }

  let capturedAt: Date | null = null;
  if (exif.DateTimeOriginal) {
    // EXIF date format: "2024:01:15 14:30:00"
    const dateStr = String(exif.DateTimeOriginal).replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
    capturedAt = new Date(dateStr);
    if (isNaN(capturedAt.getTime())) capturedAt = null;
  }

  return {
    latitude: typeof exif.GPSLatitude === "number" ? exif.GPSLatitude : null,
    longitude: typeof exif.GPSLongitude === "number" ? exif.GPSLongitude : null,
    capturedAt,
  };
}

export function usePhotoUpload(): UsePhotoUploadResult {
  const [progress, setProgress] = useState<UploadProgress>({
    phase: "idle",
    current: 0,
    total: 0,
    message: "",
  });
  const [error, setError] = useState<string | null>(null);

  const pickAndUpload = async (tripId: string) => {
    setError(null);

    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "Please allow access to your photo library to upload photos."
        );
      }

      // Pick images
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 1,
        exif: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return false;
      }

      const assets = result.assets;

      setProgress({
        phase: "processing",
        current: 0,
        total: assets.length,
        message: "Processing photos...",
      });

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to upload photos");
      }
      const userId = session.session.user.id;

      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];

        // Phase 1: Process image
        setProgress({
          phase: "processing",
          current: i + 1,
          total: assets.length,
          message: `Processing photo ${i + 1}...`,
        });

        // Extract EXIF from ImagePicker asset
        const metadata = extractExifFromAsset(asset);

        // Resize to thumbnail (square crop)
        const thumbResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: THUMB_SIZE, height: THUMB_SIZE } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Resize to large (maintain aspect ratio)
        const width = asset.width || LARGE_MAX_SIZE;
        const height = asset.height || LARGE_MAX_SIZE;
        const scale = Math.min(LARGE_MAX_SIZE / width, LARGE_MAX_SIZE / height);
        const newWidth = scale < 1 ? Math.round(width * scale) : width;
        const newHeight = scale < 1 ? Math.round(height * scale) : height;

        const largeResult = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: newWidth, height: newHeight } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Phase 2: Upload to R2
        setProgress({
          phase: "uploading",
          current: i + 1,
          total: assets.length,
          message: `Uploading photo ${i + 1}...`,
        });

        // Get presigned URLs for both sizes
        const [thumbUrlData, largeUrlData] = await Promise.all([
          supabase.functions.invoke("upload-photo", {
            body: { tripId, imageType: "thumb" },
          }),
          supabase.functions.invoke("upload-photo", {
            body: { tripId, imageType: "large" },
          }),
        ]);

        if (thumbUrlData.error || !thumbUrlData.data?.uploadUrl) {
          throw new Error(
            thumbUrlData.error?.message || "Failed to get thumb upload URL"
          );
        }

        if (largeUrlData.error || !largeUrlData.data?.uploadUrl) {
          throw new Error(
            largeUrlData.error?.message || "Failed to get large upload URL"
          );
        }

        // Convert URIs to blobs and upload
        const [thumbBlob, largeBlob] = await Promise.all([
          fetch(thumbResult.uri).then((r) => r.blob()),
          fetch(largeResult.uri).then((r) => r.blob()),
        ]);

        const [thumbUpload, largeUpload] = await Promise.all([
          fetch(thumbUrlData.data.uploadUrl, {
            method: "PUT",
            body: thumbBlob,
            headers: { "Content-Type": "image/jpeg" },
          }),
          fetch(largeUrlData.data.uploadUrl, {
            method: "PUT",
            body: largeBlob,
            headers: { "Content-Type": "image/jpeg" },
          }),
        ]);

        if (!thumbUpload.ok) {
          throw new Error("Failed to upload thumbnail");
        }
        if (!largeUpload.ok) {
          throw new Error("Failed to upload large image");
        }

        // Phase 3: Save to database
        setProgress({
          phase: "saving",
          current: i + 1,
          total: assets.length,
          message: `Saving photo ${i + 1}...`,
        });

        // Format location as WKT point if available
        const locationWkt =
          metadata.latitude !== null && metadata.longitude !== null
            ? `SRID=4326;POINT(${metadata.longitude} ${metadata.latitude})`
            : null;

        const { error: insertError } = await supabase.from("photos").insert({
          trip_id: tripId,
          user_id: userId,
          r2_key_thumb: thumbUrlData.data.key,
          r2_key_large: largeUrlData.data.key,
          blurhash: null, // Blurhash requires native implementation on mobile
          location: locationWkt,
          captured_at: metadata.capturedAt?.toISOString() ?? null,
        });

        if (insertError) {
          throw new Error(`Failed to save photo: ${insertError.message}`);
        }
      }

      setProgress({
        phase: "complete",
        current: assets.length,
        total: assets.length,
        message: "Upload complete!",
      });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setProgress({
        phase: "error",
        current: 0,
        total: 0,
        message,
      });

      return false;
    }
  };

  return { pickAndUpload, progress, error };
}
