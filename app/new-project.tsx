import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { COLORS } from "@/src/constants/colors";

import { DrawingSurfaceSection } from "@/src/features/drawing-surface/components/DrawingSurfaceSection";

import {
  DrawingSurface,
  SurfaceOrientation,
} from "@/src/features/drawing-surface/drawing-surface.types";

import { ImageOrientation } from "@/src/features/image-orientation/image-orientation.types";

import { getImageOrientation } from "@/src/features/image-orientation/image-orientation.utils";

import { ImagePickerSection } from "@/src/features/image-picker/components/ImagePickerSection";

import { GridSettingsSection } from "@/src/features/grid/components/GridSettingsSection";
import { SelectedImage } from "@/src/features/image-picker/image-picker.types";

import { GridCalculation } from "@/src/features/grid/grid.types";
export default function NewProjectScreen() {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );

  const [imageOrientation, setImageOrientation] =
    useState<ImageOrientation | null>(null);

  const [drawingSurface, setDrawingSurface] = useState<DrawingSurface | null>(
    null,
  );

  const [gridCalculation, setGridCalculation] =
    useState<GridCalculation | null>(null);
  const [imageEffects, setImageEffects] = useState<ImageEffects>(
    DEFAULT_IMAGE_EFFECTS,
  );
  const handleImageSelected = (image: SelectedImage) => {
    const orientation = getImageOrientation(image.width, image.height);

    setSelectedImage(image);
    setImageOrientation(orientation);
    setDrawingSurface(null);
    setGridCalculation(null);
    setImageEffects(DEFAULT_IMAGE_EFFECTS);
  };

  const handleImageCleared = () => {
    setSelectedImage(null);
    setImageOrientation(null);
    setDrawingSurface(null);
    setGridCalculation(null);

    setImageEffects(DEFAULT_IMAGE_EFFECTS);
  };

  const handleSurfaceChange = (surface: DrawingSurface | null) => {
    setDrawingSurface(surface);
    setGridCalculation(null);
  };

  const handleGridChange = (calculation: GridCalculation | null) => {
    setGridCalculation(calculation);
  };
  const getInitialSurfaceOrientation = (): SurfaceOrientation => {
    if (imageOrientation === "landscape") {
      return "landscape";
    }

    return "portrait";
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>New Project</Text>

        <Text style={styles.description}>
          Choose a reference image and configure your physical drawing surface.
        </Text>

        <ImagePickerSection
          onImageSelected={handleImageSelected}
          onImageCleared={handleImageCleared}
        />

        {selectedImage && imageOrientation ? (
          <>
            <View style={styles.imageDetails}>
              <Text style={styles.sectionLabel}>Reference Image</Text>

              <Text style={styles.imageDimensions}>
                {selectedImage.width} × {selectedImage.height} px
              </Text>

              <Text style={styles.imageOrientation}>
                {capitalize(imageOrientation)}
              </Text>
            </View>

            <View style={styles.sectionSeparator} />

            <DrawingSurfaceSection
              key={selectedImage.uri}
              initialOrientation={getInitialSurfaceOrientation()}
              onSurfaceChange={handleSurfaceChange}
            />

            {drawingSurface ? (
              <>
                <View style={styles.sectionSeparator} />

                <GridSettingsSection
                  key={`${drawingSurface.type}-${drawingSurface.orientation}`}
                  surface={drawingSurface}
                  onGridChange={handleGridChange}
                />
              </>
            ) : null}

            {gridCalculation ? (
              <View style={styles.readyContainer}>
                <Text style={styles.readyTitle}>Grid Ready</Text>

                <Text style={styles.readyDescription}>
                  {gridCalculation.columns} × {gridCalculation.rows} grid ·{" "}
                  {gridCalculation.cellWidth.toFixed(2)} ×{" "}
                  {gridCalculation.cellHeight.toFixed(2)} mm cells
                </Text>
              </View>
            ) : null}
          </>
        ) : null}

        {drawingSurface ? (
          <View style={styles.readyContainer}>
            <Text style={styles.readyTitle}>Drawing Surface Ready</Text>

            <Text style={styles.readyDescription}>
              {drawingSurface.type} · {drawingSurface.size.width} ×{" "}
              {drawingSurface.size.height} {drawingSurface.size.unit}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
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

  imageDetails: {
    marginTop: 24,
    padding: 18,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },

  imageDimensions: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },

  imageOrientation: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },

  sectionSeparator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 32,
  },

  readyContainer: {
    marginTop: 28,
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  readyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  readyDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
