import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { VStack } from "@coinbase/cds-mobile/layout/VStack";
import { useTripUpload } from "@/hooks/useTripUpload";

interface GpxUploadProps {
  tripId: string;
  onUploadComplete?: () => void;
}

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
    <View style={styles.container}>
      <VStack gap={3}>
        <Button
          onPress={handlePickFiles}
          disabled={isProcessing}
          variant={isProcessing ? "secondary" : "primary"}
        >
          {isProcessing ? progress.message : "Add GPX Files"}
        </Button>

        {isProcessing && progress.total > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(progress.current / progress.total) * 100}%` },
                ]}
              />
            </View>
            <TextBody>
              {progress.current} of {progress.total}
            </TextBody>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <TextBody>{error}</TextBody>
          </View>
        )}

        {progress.phase === "complete" && (
          <View style={styles.successContainer}>
            <TextBody>Upload complete!</TextBody>
          </View>
        )}
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  progressContainer: {
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0052ff",
  },
  errorContainer: {
    padding: 12,
    backgroundColor: "#fee",
    borderRadius: 8,
  },
  successContainer: {
    padding: 12,
    backgroundColor: "#efe",
    borderRadius: 8,
  },
});
