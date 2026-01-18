import { useState } from "react";
import exifr from "exifr";
import { encode } from "blurhash";
import { supabase } from "../lib/supabase";

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
  upload: (tripId: string, files: File[]) => Promise<void>;
  progress: UploadProgress;
  error: string | null;
};

const THUMB_SIZE = 400;
const LARGE_MAX_SIZE = 1600;
const THUMB_QUALITY = 0.7;
const LARGE_QUALITY = 0.8;
const BLURHASH_SIZE = 32;

async function extractExif(file: File): Promise<PhotoMetadata> {
  try {
    const exif = await exifr.parse(file, {
      pick: ["DateTimeOriginal", "GPSLatitude", "GPSLongitude"],
      gps: true,
    });

    return {
      latitude: exif?.latitude ?? null,
      longitude: exif?.longitude ?? null,
      capturedAt: exif?.DateTimeOriginal ?? null,
    };
  } catch {
    return { latitude: null, longitude: null, capturedAt: null };
  }
}

async function resizeImage(
  file: File,
  maxSize: number,
  quality: number,
  maintainAspectRatio: boolean = true
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (maintainAspectRatio) {
        // Scale down maintaining aspect ratio
        if (width > height && width > maxSize) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width / height) * maxSize;
          height = maxSize;
        }
      } else {
        // Square crop for thumbnails
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, x, y, size, size, 0, 0, maxSize, maxSize);

        canvas.toBlob(
          (blob) =>
            blob ? resolve(blob) : reject(new Error("Could not create blob")),
          "image/jpeg",
          quality
        );
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Could not create blob")),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = URL.createObjectURL(file);
  });
}

async function generateBlurhash(imageBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = BLURHASH_SIZE;
      canvas.height = BLURHASH_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, BLURHASH_SIZE, BLURHASH_SIZE);
      const imageData = ctx.getImageData(0, 0, BLURHASH_SIZE, BLURHASH_SIZE);

      const hash = encode(imageData.data, imageData.width, imageData.height, 4, 3);
      resolve(hash);
    };
    img.onerror = () => reject(new Error("Failed to load image for blurhash"));
    img.src = URL.createObjectURL(imageBlob);
  });
}

export function usePhotoUpload(): UsePhotoUploadResult {
  const [progress, setProgress] = useState<UploadProgress>({
    phase: "idle",
    current: 0,
    total: 0,
    message: "",
  });
  const [error, setError] = useState<string | null>(null);

  const upload = async (tripId: string, files: File[]) => {
    setError(null);
    setProgress({
      phase: "processing",
      current: 0,
      total: files.length,
      message: "Processing photos...",
    });

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to upload photos");
      }
      const userId = session.session.user.id;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Phase 1: Process image
        setProgress({
          phase: "processing",
          current: i + 1,
          total: files.length,
          message: `Processing ${file.name}...`,
        });

        // Extract EXIF data
        const metadata = await extractExif(file);

        // Resize to thumbnail and large
        const [thumbBlob, largeBlob] = await Promise.all([
          resizeImage(file, THUMB_SIZE, THUMB_QUALITY, false),
          resizeImage(file, LARGE_MAX_SIZE, LARGE_QUALITY, true),
        ]);

        // Generate blurhash from thumbnail
        const blurhash = await generateBlurhash(thumbBlob);

        // Phase 2: Upload to R2
        setProgress({
          phase: "uploading",
          current: i + 1,
          total: files.length,
          message: `Uploading ${file.name}...`,
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

        // Upload both images
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
          total: files.length,
          message: `Saving ${file.name}...`,
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
          blurhash,
          location: locationWkt,
          captured_at: metadata.capturedAt?.toISOString() ?? null,
        });

        if (insertError) {
          throw new Error(`Failed to save photo: ${insertError.message}`);
        }
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
  };

  return { upload, progress, error };
}
