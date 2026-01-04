import { useRef } from "react";
import { Box, VStack } from "@coinbase/cds-web/layout";
import { Button } from "@coinbase/cds-web/buttons";
import { TextBody, TextLabel2 } from "@coinbase/cds-web/typography";
import { usePhotoUpload } from "../hooks/usePhotoUpload";

type PhotoUploadProps = {
  tripId: string;
  onUploadComplete?: () => void;
};

export function PhotoUpload({ tripId, onUploadComplete }: PhotoUploadProps) {
  const { upload, progress, error } = usePhotoUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      alert("Please select image files");
      return;
    }

    await upload(tripId, imageFiles);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (progress.phase !== "error") {
      onUploadComplete?.();
    }
  };

  const isProcessing = ["processing", "uploading", "saving"].includes(
    progress.phase
  );

  return (
    <VStack gap={2}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        disabled={isProcessing}
        style={{ display: "none" }}
        id={`photo-upload-${tripId}`}
      />
      <Button
        as="label"
        htmlFor={`photo-upload-${tripId}`}
        variant={isProcessing ? "secondary" : "primary"}
        disabled={isProcessing}
        style={{ cursor: isProcessing ? "not-allowed" : "pointer" }}
      >
        {isProcessing ? progress.message : "Add Photos"}
      </Button>

      {isProcessing && progress.total > 0 && (
        <VStack gap={1} alignItems="center">
          <Box
            width="100%"
            height={4}
            background="bgTertiary"
            borderRadius={100}
            overflow="hidden"
          >
            <Box
              height="100%"
              background="bgPrimary"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
                transition: "width 0.2s",
              }}
            />
          </Box>
          <TextLabel2 color="fgMuted">
            {progress.current} of {progress.total}
          </TextLabel2>
        </VStack>
      )}

      {error && (
        <Box padding={2} background="bgNegative" borderRadius={200}>
          <TextBody color="fgNegative">{error}</TextBody>
        </Box>
      )}
    </VStack>
  );
}
