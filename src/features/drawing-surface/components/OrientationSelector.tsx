import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

import { SurfaceOrientation } from "../drawing-surface.types";

type OrientationSelectorProps = {
  orientation: SurfaceOrientation;
  onChange: (orientation: SurfaceOrientation) => void;
};

const ORIENTATIONS: SurfaceOrientation[] = ["portrait", "landscape"];

export function OrientationSelector({
  orientation,
  onChange,
}: OrientationSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paper Orientation</Text>

      <View style={styles.options}>
        {ORIENTATIONS.map((item) => {
          const isSelected = orientation === item;

          return (
            <Pressable
              key={item}
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => onChange(item)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${item} orientation`}
              accessibilityState={{
                selected: isSelected,
              }}
            >
              <View
                style={[
                  styles.paperPreview,
                  item === "landscape"
                    ? styles.landscapePreview
                    : styles.portraitPreview,
                  isSelected && styles.selectedPreview,
                ]}
              />

              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  options: {
    flexDirection: "row",
    gap: 12,
  },

  option: {
    flex: 1,
    minHeight: 110,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
  },

  selectedOption: {
    borderColor: COLORS.primary,
  },

  paperPreview: {
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    borderRadius: 3,
    marginBottom: 12,
  },

  portraitPreview: {
    width: 30,
    height: 42,
  },

  landscapePreview: {
    width: 42,
    height: 30,
  },

  selectedPreview: {
    borderColor: COLORS.primary,
  },

  optionText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },

  selectedOptionText: {
    color: COLORS.textPrimary,
  },
});
