import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import { COLORS } from "@/src/constants/colors";

import { useImagePicker } from "../hooks/useImagePicker";
import { SelectedImage } from "../image-picker.types";

type ImagePickerSectionProps = {
  onImageSelected?: (image: SelectedImage) => void;
  onImageCleared?: () => void;
};

export function ImagePickerSection({
  onImageSelected,
  onImageCleared,
}: ImagePickerSectionProps) {
  const { selectedImage, isLoading, error, pickImage, clearImage } =
    useImagePicker();

  const handlePickImage = async () => {
    const image = await pickImage();

    if (image) {
      onImageSelected?.(image);
    }
  };

  const handleClearImage = () => {
    clearImage();
    onImageCleared?.();
  };
  return (
    <View style={styles.container}>
      {selectedImage ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.imageInfo}>
            {selectedImage.width} × {selectedImage.height}
          </Text>

          <AppButton title="Choose Another Image" onPress={handlePickImage} />

          <AppButton
            title="Remove Image"
            onPress={handleClearImage}
            style={styles.secondaryButton}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Select a Reference Image</Text>

          <Text style={styles.emptyDescription}>
            Choose a photo from your gallery to prepare it for drawing.
          </Text>

          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <AppButton title="Choose from Gallery" onPress={handlePickImage} />
          )}
        </View>
      )}

      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  emptyContainer: {
    alignItems: "center",
  },

  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  emptyDescription: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },

  previewContainer: {
    width: "100%",
  },

  image: {
    width: "100%",
    height: 360,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 12,
  },

  imageInfo: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  secondaryButton: {
    marginTop: 12,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
});
