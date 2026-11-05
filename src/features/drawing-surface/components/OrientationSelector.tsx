import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

import type { SurfaceOrientation } from "../drawing-surface.types";

type OrientationSelectorProps = {
  orientation: SurfaceOrientation;
  onChange: (orientation: SurfaceOrientation) => void;
};

const CYAN = "#00E5FF";
const VIOLET = "#6A2BB8";
const CARD_BACKGROUND = "#10091A";

const ORIENTATIONS: SurfaceOrientation[] = ["portrait", "landscape"];

export function OrientationSelector({
  orientation,
  onChange,
}: OrientationSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.options}>
        {ORIENTATIONS.map((item) => {
          const isSelected = orientation === item;

          return (
            <Pressable
              key={item}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.selectedOption,
                pressed && styles.pressed,
              ]}
              onPress={() => onChange(item)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${item} orientation`}
              accessibilityState={{
                selected: isSelected,
              }}
            >
              <View style={styles.previewArea}>
                <View
                  style={[
                    styles.paperPreview,
                    item === "landscape"
                      ? styles.landscapePreview
                      : styles.portraitPreview,
                    isSelected && styles.selectedPreview,
                  ]}
                >
                  <View
                    style={[
                      styles.paperInnerLine,
                      isSelected && styles.selectedInnerLine,
                    ]}
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {capitalize(item)}
              </Text>

              <Text
                style={[
                  styles.optionHint,
                  isSelected && styles.selectedOptionHint,
                ]}
              >
                {item === "portrait" ? "Vertical paper" : "Horizontal paper"}
              </Text>

              {isSelected ? (
                <View style={styles.selectedBadge}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              ) : null}
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

  options: {
    flexDirection: "row",
    gap: 12,
  },

  option: {
    flex: 1,
    minHeight: 155,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: VIOLET,
    borderRadius: 17,
    backgroundColor: CARD_BACKGROUND,
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 7,
    position: "relative",
  },

  selectedOption: {
    borderColor: CYAN,
    borderWidth: 2,
    backgroundColor: "#190D27",
  },

  pressed: {
    opacity: 0.75,
  },

  previewArea: {
    height: 65,
    alignItems: "center",
    justifyContent: "center",
  },

  paperPreview: {
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050505",
  },

  portraitPreview: {
    width: 38,
    height: 55,
  },

  landscapePreview: {
    width: 58,
    height: 40,
  },

  selectedPreview: {
    borderColor: CYAN,
  },

  paperInnerLine: {
    width: "55%",
    height: "1.5%",
    backgroundColor: COLORS.textSecondary,
    opacity: 0.5,
  },

  selectedInnerLine: {
    backgroundColor: CYAN,
  },

  optionText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "700",
  },

  selectedOptionText: {
    color: COLORS.textPrimary,
  },

  optionHint: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },

  selectedOptionHint: {
    color: "#D8C5EC",
  },

  selectedBadge: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: CYAN,
    alignItems: "center",
    justifyContent: "center",
  },

  checkmark: {
    color: "#050505",
    fontSize: 12,
    fontWeight: "900",
  },
});
