import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

import { PaperType } from "../drawing-surface.types";

type PaperSizeSelectorProps = {
  selectedPaper: PaperType | null;
  onSelect: (paper: PaperType) => void;
};

const PAPER_OPTIONS: PaperType[] = ["A5", "A4", "A3", "A2", "A1", "CUSTOM"];

export function PaperSizeSelector({
  selectedPaper,
  onSelect,
}: PaperSizeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paper Size</Text>

      <Text style={styles.description}>
        Select the size of your physical drawing surface.
      </Text>

      <View style={styles.options}>
        {PAPER_OPTIONS.map((paper) => {
          const isSelected = selectedPaper === paper;

          return (
            <Pressable
              key={paper}
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => onSelect(paper)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${paper} paper size`}
              accessibilityState={{
                selected: isSelected,
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {paper === "CUSTOM" ? "Custom" : paper}
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
    marginBottom: 6,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  option: {
    minWidth: 72,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
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
