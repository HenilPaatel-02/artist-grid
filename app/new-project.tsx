import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { COLORS } from "@/src/constants/colors";
import { ImagePickerSection } from "@/src/features/image-picker/components/ImagePickerSection";
import { SelectedImage } from "@/src/features/image-picker/image-picker.types";

export default function NewProjectScreen() {
  const handleImageSelected = (image: SelectedImage) => {
    console.log("Selected image:", image);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>New Project</Text>

        <Text style={styles.description}>
          Choose a reference image to start preparing your drawing.
        </Text>

        <ImagePickerSection onImageSelected={handleImageSelected} />
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
});
