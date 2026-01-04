import { Alert } from "react-native";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { TextLabel2 } from "@coinbase/cds-mobile/typography/TextLabel2";
import { Box, VStack } from "@coinbase/cds-mobile/layout";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";

type PhotoUploadProps = {
  tripId: string;
  onUploadComplete?: () => void;
};

export function PhotoUpload({ tripId, onUploadComplete }: PhotoUploadProps) {
  const { pickAndUpload, progress, error } = usePhotoUpload();

  const handlePickPhotos = async () => {
    const success = await pickAndUpload(tripId);

    if (success) {
      Alert.alert("Success", "Photos uploaded successfully!");
      onUploadComplete?.();
    }
  };

  const isProcessing = ["processing", "uploading", "saving"].includes(
    progress.phase
  );

  return (
    <Box padding={2}>
      <VStack gap={3}>
        <Button
          onPress={handlePickPhotos}
          disabled={isProcessing}
          variant={isProcessing ? "secondary" : "primary"}
        >
          {isProcessing ? progress.message : "Add Photos"}
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
                style={{
                  width: `${(progress.current / progress.total) * 100}%`,
                }}
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
