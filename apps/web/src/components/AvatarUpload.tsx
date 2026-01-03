import { useState, useRef, type ChangeEvent } from "react";
import { Box } from "@coinbase/cds-web/layout";
import { TextTitle1, TextBody } from "@coinbase/cds-web/typography";
import { Pressable } from "@coinbase/cds-web/system";
import { Spinner } from "@coinbase/cds-web/loaders";
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
      console.error("Avatar upload error:", error);
      alert("Something went wrong, please try again");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayUrl = localImageUrl || currentAvatarUrl;

  return (
    <Pressable
      onClick={() => !uploading && fileInputRef.current?.click()}
      style={{ position: "relative", cursor: "pointer", width: 100, height: 100 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      {displayUrl ? (
        <Box
          as="img"
          src={displayUrl}
          alt="Avatar"
          width={100}
          height={100}
          borderRadius={1000}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <Box
          width={100}
          height={100}
          borderRadius={1000}
          background="bgTertiary"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <TextTitle1>{username?.charAt(0).toUpperCase() ?? "?"}</TextTitle1>
        </Box>
      )}
      {uploading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          borderRadius={1000}
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <Spinner size={24} />
        </Box>
      )}
      <Box
        position="absolute"
        bottom={0}
        right={0}
        width={32}
        height={32}
        borderRadius={1000}
        background="bg"
        display="flex"
        justifyContent="center"
        alignItems="center"
        elevation={1}
      >
        <TextBody>📷</TextBody>
      </Box>
    </Pressable>
  );
}
