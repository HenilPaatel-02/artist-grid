import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { COLORS } from "@/src/constants/colors";
import { ImageOrientation } from "@/src/features/image-orientation/image-orientation.types";
import { getImageOrientation } from "@/src/features/image-orientation/image-orientation.utils";
import { ImagePickerSection } from "@/src/features/image-picker/components/ImagePickerSection";
import { SelectedImage } from "@/src/features/image-picker/image-picker.types";
import { useState } from "react";

export default function NewProjectScreen() {
  const [orientation, setOrientation] = useState<ImageOrientation | null>(null);

  const handleImageSelected = (image: SelectedImage) => {
    const ImageOrientation = getImageOrientation(image.width, image.height);
    setOrientation(ImageOrientation);
  };
  const handleImageClear = () => {
    setOrientation(null);
  };
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>New Project</Text>

        <Text style={styles.description}>
          Choose a reference image to start preparing your drawing.
        </Text>

        <ImagePickerSection
          onImageSelected={handleImageSelected}
          onImageCleared={handleImageClear}
        />

        {orientation ? (
          <Text style={styles.orientationText}>
            Image Orientation : {orientation}
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  orientationText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
});
