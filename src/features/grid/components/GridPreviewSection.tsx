import { useState } from "react";

import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

import { DrawingSurface } from "../../drawing-surface/drawing-surface.types";

import { SelectedImage } from "../../image-picker/image-picker.types";

import { calculateGridCanvasLayout } from "../grid-canvas-layout.utils";

import { GridCanvasStyle } from "../grid-canvas.types";

import { GridCalculation } from "../grid.types";

import { GridCanvas } from "./GridCanvas";

import { GridStyleControls } from "./GridStyleControls";

import { ImageEffects } from "@/src/features/image-effects/image-effects.types";

type GridPreviewSectionProps = {
  image: SelectedImage;
  surface: DrawingSurface;
  calculation: GridCalculation;
  imageEffects: ImageEffects;
};

export function GridPreviewSection({
  image,
  surface,
  calculation,
  imageEffects,
}: GridPreviewSectionProps) {
  const [availableWidth, setAvailableWidth] = useState(0);

  const [gridStyle, setGridStyle] = useState<GridCanvasStyle>({
    color: "#FFFFFF",
    strokeWidth: 1,
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    setAvailableWidth(width);
  };

  const canvasLayout =
    availableWidth > 0
      ? calculateGridCanvasLayout(availableWidth, surface)
      : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grid Preview</Text>

      <Text style={styles.description}>
        Preview your reference image with the calculated drawing grid.
      </Text>

      <View style={styles.canvasContainer} onLayout={handleLayout}>
        {canvasLayout ? (
          <GridCanvas
            image={image}
            calculation={calculation}
            width={canvasLayout.width}
            height={canvasLayout.height}
            gridStyle={gridStyle}
            imageEffects={imageEffects}
          />
        ) : null}
      </View>

      <View style={styles.separator} />

      <GridStyleControls value={gridStyle} onChange={setGridStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  canvasContainer: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: COLORS.surface,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 28,
  },
});
