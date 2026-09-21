import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { COLORS } from "@/src/constants/colors";

import { ImagePickerSection } from "@/src/features/image-picker/components/ImagePickerSection";
import type { SelectedImage } from "@/src/features/image-picker/image-picker.types";

import type { ImageOrientation } from "@/src/features/image-orientation/image-orientation.types";
import { getImageOrientation } from "@/src/features/image-orientation/image-orientation.utils";

import { DrawingSurfaceSection } from "@/src/features/drawing-surface/components/DrawingSurfaceSection";
import type {
  DrawingSurface,
  SurfaceOrientation,
} from "@/src/features/drawing-surface/drawing-surface.types";

import { GridPreviewSection } from "@/src/features/grid/components/GridPreviewSection";
import { GridSettingsSection } from "@/src/features/grid/components/GridSettingsSection";
import type { GridCalculation } from "@/src/features/grid/grid.types";

import { ImageEffectsSection } from "@/src/features/image-effects/components/ImageEffectsSection";
import {
  DEFAULT_IMAGE_EFFECTS,
  type ImageEffects,
} from "@/src/features/image-effects/image-effects.types";

import { GridStylingSection } from "@/src/features/grid/components/GridStylingSection";
import {
  DEFAULT_GRID_STYLING,
  type GridStyling,
} from "@/src/features/grid/grid-styling.types";

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

  const [imageEffects, setImageEffects] = useState<ImageEffects>({
    ...DEFAULT_IMAGE_EFFECTS,
  });

  const [gridStyling, setGridStyling] = useState<GridStyling>({
    ...DEFAULT_GRID_STYLING,
  });

  const handleImageSelected = (image: SelectedImage) => {
    const orientation = getImageOrientation(image.width, image.height);

    setSelectedImage(image);
    setImageOrientation(orientation);

    // Reset dependent features
    setDrawingSurface(null);
    setGridCalculation(null);

    // Reset image effects for the new image
    setImageEffects({
      ...DEFAULT_IMAGE_EFFECTS,
    });

    setGridStyling({
      ...DEFAULT_GRID_STYLING,
    });
  };

  const handleImageCleared = () => {
    setSelectedImage(null);
    setImageOrientation(null);

    setDrawingSurface(null);
    setGridCalculation(null);

    setImageEffects({
      ...DEFAULT_IMAGE_EFFECTS,
    });

    setGridStyling({
      ...DEFAULT_GRID_STYLING,
    });
  };

  const handleSurfaceChange = (surface: DrawingSurface | null) => {
    setDrawingSurface(surface);

    // Surface changes invalidate grid calculation
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
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>New Project</Text>

          <Text style={styles.description}>
            Choose a reference image and configure your physical drawing
            surface.
          </Text>
        </View>

        {/* Feature 1 — Image Picker */}
        <ImagePickerSection
          onImageSelected={handleImageSelected}
          onImageCleared={handleImageCleared}
        />

        {/* Image selected */}
        {selectedImage && imageOrientation ? (
          <>
            {/* Image Information */}
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

            {/* Feature 2 + 3 — Orientation / Drawing Surface */}
            <DrawingSurfaceSection
              key={selectedImage.uri}
              initialOrientation={getInitialSurfaceOrientation()}
              onSurfaceChange={handleSurfaceChange}
            />

            {/* Drawing Surface Result */}
            {drawingSurface ? (
              <>
                <View style={styles.sectionSeparator} />

                {/* Feature 4 — Grid Calculation */}
                <GridSettingsSection
                  key={`${drawingSurface.type}-${drawingSurface.orientation}`}
                  surface={drawingSurface}
                  onGridChange={handleGridChange}
                />
              </>
            ) : null}

            {/* Grid Calculation Result */}
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

        {/* Feature 6 — Image Effects + Feature 5 — Grid Preview */}
        {selectedImage && drawingSurface && gridCalculation ? (
          <>
            <View style={styles.sectionSeparator} />

            <ImageEffectsSection
              effects={imageEffects}
              onChange={setImageEffects}
            />

            <View style={styles.sectionSeparator} />

            <GridStylingSection
              styling={gridStyling}
              onChange={setGridStyling}
            />
            {/* Feature 5 + 5.1 + 6 */}
            <GridPreviewSection
              image={selectedImage}
              surface={drawingSurface}
              calculation={gridCalculation}
              imageEffects={imageEffects}
              gridStyling={gridStyling}
            />
          </>
        ) : null}

        {/* Drawing Surface Summary */}
        {drawingSurface ? (
          <View style={styles.readyContainer}>
            <Text style={styles.readyTitle}>Drawing Surface Ready</Text>

            <Text style={styles.readyDescription}>
              {capitalize(drawingSurface.type)} · {drawingSurface.size.width} ×{" "}
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },

  imageDetails: {
    marginTop: 20,
    gap: 6,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  imageDimensions: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  imageOrientation: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  sectionSeparator: {
    height: 1,
    marginVertical: 20,
    backgroundColor: COLORS.border,
  },

  readyContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  readyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  readyDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
});
