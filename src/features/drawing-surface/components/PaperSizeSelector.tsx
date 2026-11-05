import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

import type { PaperType } from "../drawing-surface.types";

type PaperSizeSelectorProps = {
  selectedPaper: PaperType | null;
  onSelect: (paper: PaperType) => void;
};

const CYAN = "#00E5FF";
const PURPLE = "#3B0A6B";
const VIOLET = "#6A2BB8";
const CARD_BACKGROUND = "#10091A";

const PAPER_OPTIONS: PaperType[] = ["A5", "A4", "A3", "A2", "A1", "CUSTOM"];

export function PaperSizeSelector({
  selectedPaper,
  onSelect,
}: PaperSizeSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.options}>
        {PAPER_OPTIONS.map((paper) => {
          const isCustom = paper === "CUSTOM";
          const isSelected = selectedPaper === paper;

          return (
            <Pressable
              key={paper}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                isCustom && styles.disabledOption,
              ]}
              onPress={() => {
                if (!isCustom) {
                  onSelect(paper);
                }
              }}
              disabled={isCustom}
              accessibilityRole="button"
              accessibilityLabel={
                isCustom
                  ? "Custom paper dimensions coming soon"
                  : `Select ${paper} paper size`
              }
              accessibilityState={{
                selected: isSelected,
                disabled: isCustom,
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                  isCustom && styles.disabledOptionText,
                ]}
              >
                {isCustom ? "Custom" : paper}
              </Text>

              {isCustom ? <Text style={styles.comingSoon}>SOON</Text> : null}

              {isSelected && !isCustom ? (
                <View style={styles.selectedIndicator}>
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  option: {
    flexGrow: 1,
    flexBasis: "27%",
    minWidth: 70,
    minHeight: 76,
    paddingHorizontal: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: VIOLET,
    backgroundColor: CARD_BACKGROUND,
    position: "relative",
  },

  selectedOption: {
    borderColor: CYAN,
    borderWidth: 2,
    backgroundColor: CYAN,
  },

  disabledOption: {
    backgroundColor: PURPLE,
    borderColor: VIOLET,
    opacity: 0.65,
  },

  optionText: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },

  selectedOptionText: {
    color: "#050505",
  },

  disabledOptionText: {
    color: "#D8C5EC",
    fontSize: 15,
  },

  selectedIndicator: {
    position: "absolute",
    top: 5,
    right: 7,
  },

  checkmark: {
    color: "#050505",
    fontSize: 11,
    fontWeight: "900",
  },

  comingSoon: {
    color: "#E9D5FF",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginTop: 3,
  },
});
