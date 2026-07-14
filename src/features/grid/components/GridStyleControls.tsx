import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

import { GridCanvasStyle } from "../grid-canvas.types";

type GridStyleControlsProps = {
  value: GridCanvasStyle;

  onChange: (value: GridCanvasStyle) => void;
};

const GRID_COLORS = [
  "#FFFFFF",
  "#000000",
  "#EF4444",
  "#22C55E",
  "#3B82F6",
  "#FACC15",
] as const;

const STROKE_WIDTHS = [0.5, 1, 1.5, 2, 3] as const;

export function GridStyleControls({ value, onChange }: GridStyleControlsProps) {
  const handleColorChange = (color: string) => {
    onChange({
      ...value,
      color,
    });
  };

  const handleStrokeChange = (strokeWidth: number) => {
    onChange({
      ...value,
      strokeWidth,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grid Style</Text>

      <Text style={styles.label}>Grid Color</Text>

      <View style={styles.colorOptions}>
        {GRID_COLORS.map((color) => {
          const isSelected = value.color === color;

          return (
            <Pressable
              key={color}
              style={[
                styles.colorButton,
                {
                  backgroundColor: color,
                },
                isSelected && styles.selectedColor,
              ]}
              onPress={() => handleColorChange(color)}
              accessibilityRole="button"
              accessibilityLabel={`Select grid color ${color}`}
              accessibilityState={{
                selected: isSelected,
              }}
            />
          );
        })}
      </View>

      <Text style={styles.label}>Stroke Width</Text>

      <View style={styles.strokeOptions}>
        {STROKE_WIDTHS.map((strokeWidth) => {
          const isSelected = value.strokeWidth === strokeWidth;

          return (
            <Pressable
              key={strokeWidth}
              style={[styles.strokeButton, isSelected && styles.selectedStroke]}
              onPress={() => handleStrokeChange(strokeWidth)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${strokeWidth} pixel grid stroke`}
              accessibilityState={{
                selected: isSelected,
              }}
            >
              <Text
                style={[
                  styles.strokeText,
                  isSelected && styles.selectedStrokeText,
                ]}
              >
                {strokeWidth}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
    marginBottom: 20,
  },

  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },

  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },

  colorButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: COLORS.border,
  },

  selectedColor: {
    borderWidth: 4,
    borderColor: COLORS.primary,
  },

  strokeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  strokeButton: {
    minWidth: 52,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  selectedStroke: {
    borderColor: COLORS.primary,
  },

  strokeText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  selectedStrokeText: {
    color: COLORS.textPrimary,
  },
});
