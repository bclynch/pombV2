import { useState } from "react";
import { Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Box } from "@coinbase/cds-mobile/layout/Box";
import { TextTitle1 } from "@coinbase/cds-mobile/typography/TextTitle1";
import { Pressable } from "@coinbase/cds-mobile/system/Pressable";
import { supabase } from "@/lib/supabase";

type AvatarUploadProps = {
  userId: string;
  currentAvatarUrl: string | null;
  username: string | null;
  onUploadComplete?: (newAvatarUrl: string) => void;
};

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  username,
  onUploadComplete,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const pickAndUploadImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload an avatar."
        );
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const selectedImage = result.assets[0];

      // Show optimistic update immediately
      setLocalImageUri(selectedImage.uri);
      setUploading(true);

      // Resize image to 400x400
      const manipulated = await ImageManipulator.manipulateAsync(
        selectedImage.uri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Get presigned upload URL from edge function
      const { data: signedUrlData, error: signedUrlError } = await supabase.functions.invoke(
        "upload-avatar",
        {
          body: { userId },
        }
      );

      if (signedUrlError || !signedUrlData?.uploadUrl) {
        throw new Error(signedUrlError?.message || "Failed to get upload URL");
      }

      // Upload image to Supabase Storage
      const imageResponse = await fetch(manipulated.uri);
      const imageBlob = await imageResponse.blob();

      const uploadResponse = await fetch(signedUrlData.uploadUrl, {
        method: "PUT",
        body: imageBlob,
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
      setLocalImageUri(null);
      console.error("Avatar upload error:", error);
      Alert.alert(
        "Upload Failed",
        "Something went wrong, please try again"
      );
    }
  };

  // Determine which image to display
  const displayUri = localImageUri || currentAvatarUrl;

  return (
    <Pressable onPress={pickAndUploadImage} disabled={uploading}>
      <Box width={100} height={100}>
        {displayUri ? (
          <Image
            source={{ uri: displayUri }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <Box
            width={100}
            height={100}
            borderRadius={1000}
            background="bgTertiary"
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
            justifyContent="center"
            alignItems="center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <ActivityIndicator size="large" color="#fff" />
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
          justifyContent="center"
          alignItems="center"
          elevation={1}
        >
          <TextTitle1 style={{ fontSize: 16 }}>📷</TextTitle1>
        </Box>
      </Box>
    </Pressable>
  );
}
