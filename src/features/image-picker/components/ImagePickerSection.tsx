import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "@/src/constants/colors";

import { useImagePicker } from "../hooks/useImagePicker";
import type { SelectedImage } from "../image-picker.types";

type ImagePickerSectionProps = {
  selectedImage?: SelectedImage | null;
  onImageSelected?: (image: SelectedImage) => void;
  onImageCleared?: () => void;
};

const CYAN = "#00E5FF";
const PURPLE = "#3B0A6B";
const CARD_BACKGROUND = "#10091A";

export function ImagePickerSection({
  selectedImage: controlledImage,
  onImageSelected,
  onImageCleared,
}: ImagePickerSectionProps) {
  const {
    selectedImage: pickerSelectedImage,
    isLoading,
    error,
    pickImage,
    clearImage,
  } = useImagePicker();

  // undefined = uncontrolled mode; null = explicitly no image
  const selectedImage =
    controlledImage !== undefined ? controlledImage : pickerSelectedImage;

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

  const imageShape = selectedImage
    ? selectedImage.width === selectedImage.height
      ? "Square"
      : selectedImage.width > selectedImage.height
        ? "Landscape"
        : "Portrait"
    : "";

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionNumber}>01</Text>

        <View style={styles.sectionHeadingContent}>
          <Text style={styles.sectionTitle}>Reference Image</Text>
          <Text style={styles.sectionDescription}>
            Choose a photo to use as your drawing reference.
          </Text>
        </View>
      </View>

      {selectedImage ? (
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View>
              <Text style={styles.cardTitle}>Your Reference</Text>
              <Text style={styles.cardSubtitle}>
                Image selected successfully
              </Text>
            </View>

            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>✓ Selected</Text>
            </View>
          </View>

          <View style={styles.imageFrame}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel="Selected drawing reference image"
            />
          </View>

          <View style={styles.imageMetadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>RESOLUTION</Text>
              <Text style={styles.metadataValue}>
                {selectedImage.width} × {selectedImage.height} px
              </Text>
            </View>

            <View style={styles.metadataDivider} />

            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>ORIENTATION</Text>
              <Text style={styles.metadataValue}>{imageShape}</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryAction,
              pressed && styles.pressed,
              isLoading && styles.disabled,
            ]}
            onPress={handlePickImage}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Choose another reference image"
          >
            {isLoading ? (
              <ActivityIndicator color="#050505" />
            ) : (
              <Text style={styles.primaryActionText}>Choose Another Image</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryAction,
              pressed && styles.pressed,
            ]}
            onPress={handleClearImage}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Remove reference image"
          >
            <Text style={styles.secondaryActionText}>Remove Image</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.uploadCard}>
          <View style={styles.uploadIcon}>
            <Text style={styles.uploadIconText}>＋</Text>
          </View>

          <Text style={styles.uploadTitle}>Select a Reference Image</Text>

          <Text style={styles.uploadDescription}>
            Start with a photo from your gallery. ArtistGrid will help you
            prepare it for accurate drawing.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryAction,
              pressed && styles.pressed,
              isLoading && styles.disabled,
            ]}
            onPress={handlePickImage}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Choose image from gallery"
          >
            {isLoading ? (
              <ActivityIndicator color="#050505" />
            ) : (
              <Text style={styles.primaryActionText}>Choose from Gallery</Text>
            )}
          </Pressable>

          <Text style={styles.uploadHint}>
            Select an image stored on your device
          </Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  sectionNumber: {
    color: CYAN,
    fontSize: 13,
    fontWeight: "800",
    backgroundColor: PURPLE,
    overflow: "hidden",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  sectionHeadingContent: {
    flex: 1,
    gap: 5,
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 21,
    fontWeight: "800",
  },

  sectionDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  uploadCard: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4A236A",
    borderStyle: "dashed",
    paddingHorizontal: 22,
    paddingVertical: 30,
    alignItems: "center",
    gap: 14,
  },

  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  uploadIconText: {
    color: CYAN,
    fontSize: 36,
    fontWeight: "400",
  },

  uploadTitle: {
    color: COLORS.textPrimary,
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
  },

  uploadDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },

  uploadHint: {
    color: COLORS.textSecondary,
    fontSize: 11,
    textAlign: "center",
  },

  previewCard: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4A236A",
    padding: 14,
    gap: 14,
  },

  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  selectedBadge: {
    backgroundColor: "#123C35",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  selectedBadgeText: {
    color: "#5EEAD4",
    fontSize: 11,
    fontWeight: "700",
  },

  imageFrame: {
    height: 260,
    width: "100%",
    borderRadius: 14,
    backgroundColor: "#050505",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageMetadata: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#190D27",
    borderRadius: 12,
    padding: 13,
  },

  metadataItem: {
    flex: 1,
    gap: 5,
  },

  metadataLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  metadataValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },

  metadataDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#4A236A",
    marginHorizontal: 12,
  },

  primaryAction: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: CYAN,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  primaryActionText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryAction: {
    minHeight: 48,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#6A2BB8",
    backgroundColor: "#190D27",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryActionText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.55,
  },

  errorContainer: {
    backgroundColor: "#351316",
    borderRadius: 10,
    padding: 12,
  },

  errorText: {
    color: "#FCA5A5",
    fontSize: 12,
    lineHeight: 18,
  },
});
