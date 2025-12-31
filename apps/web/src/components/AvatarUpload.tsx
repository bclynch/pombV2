import { useState, useRef, ChangeEvent } from "react";
import { TextTitle1 } from "@coinbase/cds-web/typography";
import { supabase } from "../lib/supabase";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  username: string | null;
  onUploadComplete?: (newAvatarUrl: string) => void;
}

async function resizeImage(file: File, maxSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = maxSize;
      canvas.height = maxSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Calculate crop dimensions for center square
      const size = Math.min(img.width, img.height);
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;

      // Draw cropped and resized image
      ctx.drawImage(img, x, y, size, size, 0, 0, maxSize, maxSize);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not create blob"));
          }
        },
        "image/jpeg",
        0.8
      );
    };
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  username,
  onUploadComplete,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      // Show optimistic preview
      const previewUrl = URL.createObjectURL(file);
      setLocalImageUrl(previewUrl);
      setUploading(true);

      // Resize image to 400x400
      const resizedBlob = await resizeImage(file, 400);

      // Get presigned upload URL from edge function
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.functions.invoke("upload-avatar", {
          body: { userId },
        });

      if (signedUrlError || !signedUrlData?.uploadUrl) {
        throw new Error(signedUrlError?.message || "Failed to get upload URL");
      }

      // Upload image to Supabase Storage
      const uploadResponse = await fetch(signedUrlData.uploadUrl, {
        method: "PUT",
        body: resizedBlob,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload image: ${errorText}`);
      }

      // Add cache-busting query param to the URL
      const avatarUrl = `${signedUrlData.publicUrl}?t=${Date.now()}`;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setUploading(false);
      onUploadComplete?.(avatarUrl);
    } catch (error) {
      setUploading(false);
      setLocalImageUrl(null);
      alert(error instanceof Error ? error.message : "Failed to upload avatar");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayUrl = localImageUrl || currentAvatarUrl;

  return (
    <div
      style={styles.container}
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={styles.hiddenInput}
      />
      {displayUrl ? (
        <img src={displayUrl} alt="Avatar" style={styles.avatar} />
      ) : (
        <div style={{ ...styles.avatar, ...styles.placeholder }}>
          <TextTitle1>{username?.charAt(0).toUpperCase() ?? "?"}</TextTitle1>
        </div>
      )}
      {uploading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner} />
        </div>
      )}
      <div style={styles.editBadge}>
        <span style={styles.editIcon}>📷</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative" as const,
    cursor: "pointer",
    width: 100,
    height: 100,
  },
  hiddenInput: {
    display: "none",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: "cover" as const,
  },
  placeholder: {
    backgroundColor: "#e0e0e0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: 24,
    height: 24,
    border: "3px solid #fff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  editBadge: {
    position: "absolute" as const,
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  editIcon: {
    fontSize: 16,
  },
} as const;
