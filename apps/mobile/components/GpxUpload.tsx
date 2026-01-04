import { useState } from "react";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { TextLabel2 } from "@coinbase/cds-mobile/typography/TextLabel2";
import { Box, VStack } from "@coinbase/cds-mobile/layout";
import { useTripUpload } from "@/hooks/useTripUpload";

type GpxUploadProps = {
  tripId: string;
  onUploadComplete?: () => void;
};

export function GpxUpload({ tripId, onUploadComplete }: GpxUploadProps) {
  const { upload, progress, error } = useTripUpload();
  const [isUploading, setIsUploading] = useState(false);

  const handlePickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/gpx+xml", "text/xml", "application/xml", "*/*"],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      // Filter to only GPX files
      const gpxFiles = result.assets.filter(
        (file) =>
          file.name.toLowerCase().endsWith(".gpx") ||
          file.mimeType?.includes("gpx") ||
          file.mimeType?.includes("xml")
      );

      if (gpxFiles.length === 0) {
        Alert.alert("Invalid Files", "Please select GPX files (.gpx)");
        return;
      }

      setIsUploading(true);

      await upload(
        tripId,
        gpxFiles.map((file) => ({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType,
        }))
      );

      setIsUploading(false);

      // Upload succeeded - show success and trigger refetch
      Alert.alert("Success", "Trip updated with GPX data!");
      onUploadComplete?.();
    } catch (err) {
      setIsUploading(false);
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to pick files");
    }
  };

  const isProcessing = isUploading || ["parsing", "uploading", "saving"].includes(progress.phase);

  return (
    <Box padding={2}>
      <VStack gap={3}>
        <Button
          onPress={handlePickFiles}
          disabled={isProcessing}
          variant={isProcessing ? "secondary" : "primary"}
        >
          {isProcessing ? progress.message : "Add GPX Files"}
        </Button>

        {isProcessing && progress.total > 0 && (
          <VStack gap={2} alignItems="center">
            <Box
              width="100%"
              height={4}
              background="bgTertiary"
              borderRadius={100}
              overflow="hidden"
            >
              <Box
                height={4}
                background="bgPrimary"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </Box>
            <TextLabel2 color="fgMuted">
              {progress.current} of {progress.total}
            </TextLabel2>
          </VStack>
        )}

        {error && (
          <Box padding={3} background="bgNegative" borderRadius={200}>
            <TextBody color="fgNegative">{error}</TextBody>
          </Box>
        )}

        {progress.phase === "complete" && (
          <Box padding={3} background="bgPositive" borderRadius={200}>
            <TextBody color="fgPositive">Upload complete!</TextBody>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
