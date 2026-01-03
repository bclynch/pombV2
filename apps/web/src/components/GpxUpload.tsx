import { useRef } from "react";
import { Box, VStack } from "@coinbase/cds-web/layout";
import { Button } from "@coinbase/cds-web/buttons";
import { TextBody, TextLabel2 } from "@coinbase/cds-web/typography";
import { useTripUpload } from "../hooks/useTripUpload";

interface GpxUploadProps {
  tripId: string;
  onUploadComplete?: () => void;
}

export function GpxUpload({ tripId, onUploadComplete }: GpxUploadProps) {
  const { upload, progress, error } = useTripUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const gpxFiles = Array.from(files).filter(
      (file) => file.name.toLowerCase().endsWith(".gpx") || file.type.includes("gpx") || file.type.includes("xml")
    );

    if (gpxFiles.length === 0) {
      alert("Please select GPX files (.gpx)");
      return;
    }

    await upload(tripId, gpxFiles);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    alert("Trip updated with GPX data!");
    onUploadComplete?.();
  };

  const isProcessing = ["parsing", "uploading", "saving"].includes(progress.phase);

  return (
    <VStack gap={2}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".gpx,application/gpx+xml,text/xml"
        multiple
        onChange={handleFileChange}
        disabled={isProcessing}
        style={{ display: "none" }}
        id={`gpx-upload-${tripId}`}
      />
      <Button
        as="label"
        htmlFor={`gpx-upload-${tripId}`}
        variant={isProcessing ? "secondary" : "primary"}
        disabled={isProcessing}
        style={{ cursor: isProcessing ? "not-allowed" : "pointer" }}
      >
        {isProcessing ? progress.message : "Add GPX Files"}
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
