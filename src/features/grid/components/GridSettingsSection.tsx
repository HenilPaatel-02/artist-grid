import { useEffect, useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import { COLORS } from "@/src/constants/colors";

import type { DrawingSurface } from "../../drawing-surface/drawing-surface.types";
import { calculateGrid } from "../grid-calculation.utils";
import type { GridCalculation, GridSettings } from "../grid.types";

type GridSettingsSectionProps = {
  surface: DrawingSurface;
  restoredCalculation?: GridCalculation | null;
  onGridChange?: (calculation: GridCalculation | null) => void;
};

const CYAN = "#00E5FF";
const PURPLE = "#3B0A6B";
const VIOLET = "#6A2BB8";
const CARD_BACKGROUND = "#10091A";

export function GridSettingsSection({
  surface,
  restoredCalculation = null,
  onGridChange,
}: GridSettingsSectionProps) {
  const [rows, setRows] = useState(String(restoredCalculation?.rows ?? 10));
  const [columns, setColumns] = useState(
    String(restoredCalculation?.columns ?? 8),
  );
  const [calculation, setCalculation] = useState<GridCalculation | null>(
    restoredCalculation,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRows(String(restoredCalculation?.rows ?? 10));
    setColumns(String(restoredCalculation?.columns ?? 8));
    setCalculation(restoredCalculation ?? null);
    setError(null);
  }, [restoredCalculation, surface]);

  const handleCalculate = () => {
    Keyboard.dismiss();

    try {
      setError(null);

      const settings: GridSettings = {
        mode: "rows-columns",
        rows: Number(rows),
        columns: Number(columns),
      };

      const result = calculateGrid(surface, settings);

      setCalculation(result);
      onGridChange?.(result);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to calculate grid.";

      setCalculation(null);
      setError(message);
      onGridChange?.(null);
    }
  };

  const handleRowsChange = (value: string) => {
    setRows(value);
    setCalculation(null);
    setError(null);
    onGridChange?.(null);
  };

  const handleColumnsChange = (value: string) => {
    setColumns(value);
    setCalculation(null);
    setError(null);
    onGridChange?.(null);
  };
  const totalCells = calculation ? calculation.rows * calculation.columns : 0;

  return (
    <View style={styles.container}>
      {/* Section heading */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionNumber}>03</Text>

        <View style={styles.headingContent}>
          <Text style={styles.sectionTitle}>Grid Configuration</Text>
          <Text style={styles.sectionDescription}>
            Set the number of rows and columns for your drawing reference.
          </Text>
        </View>
      </View>

      {/* Grid inputs */}
      <View style={styles.inputCard}>
        <View style={styles.inputHeader}>
          <Text style={styles.cardTitle}>Grid Dimensions</Text>
          <Text style={styles.cardHint}>Rows × Columns</Text>
        </View>

        <View style={styles.inputs}>
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Rows</Text>
              <Text style={styles.inputHint}>Horizontal divisions</Text>
            </View>

            <TextInput
              value={rows}
              onChangeText={handleRowsChange}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="10"
              placeholderTextColor={COLORS.textSecondary}
              selectTextOnFocus
              maxLength={3}
              accessibilityLabel="Number of grid rows"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Columns</Text>
              <Text style={styles.inputHint}>Vertical divisions</Text>
            </View>

            <TextInput
              value={columns}
              onChangeText={handleColumnsChange}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="8"
              placeholderTextColor={COLORS.textSecondary}
              selectTextOnFocus
              maxLength={3}
              accessibilityLabel="Number of grid columns"
              returnKeyType="done"
              onSubmitEditing={handleCalculate}
            />
          </View>
        </View>

        <Text style={styles.helperText}>
          Example: 10 rows × 8 columns creates 80 drawing cells.
        </Text>

        <AppButton
          title="Calculate Grid"
          onPress={handleCalculate}
          style={styles.calculateButton}
        />
      </View>

      {/* Validation feedback */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>!</Text>
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
        </View>
      ) : null}

      {/* Calculation result */}
      {calculation ? (
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryEyebrow}>YOUR GRID IS READY</Text>
              <Text style={styles.summaryTitle}>Grid Calculation</Text>
            </View>

            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>✓ Ready</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.resultGrid}>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{calculation.rows}</Text>
              <Text style={styles.resultLabel}>ROWS</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{calculation.columns}</Text>
              <Text style={styles.resultLabel}>COLUMNS</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{totalCells}</Text>
              <Text style={styles.resultLabel}>TOTAL CELLS</Text>
            </View>
          </View>

          <View style={styles.cellSizeContainer}>
            <Text style={styles.cellSizeLabel}>CELL DIMENSIONS</Text>

            <Text style={styles.cellSizeValue}>
              {calculation.cellWidth.toFixed(2)} ×{" "}
              {calculation.cellHeight.toFixed(2)} mm
            </Text>

            <Text style={styles.cellSizeHint}>
              Width × Height per drawing cell
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  sectionNumber: {
    color: CYAN,
    fontSize: 13,
    fontWeight: "800",
    backgroundColor: PURPLE,
    overflow: "hidden",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  headingContent: {
    flex: 1,
    gap: 5,
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 21,
    fontWeight: "800",
  },

  sectionDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  inputCard: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#321A49",
    padding: 16,
    gap: 18,
  },

  inputHeader: {
    gap: 5,
  },

  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },

  cardHint: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  inputs: {
    flexDirection: "row",
    gap: 12,
  },

  inputGroup: {
    flex: 1,
    gap: 9,
  },

  labelRow: {
    gap: 4,
  },

  label: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },

  inputHint: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },

  input: {
    minHeight: 58,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: VIOLET,
    borderRadius: 13,
    backgroundColor: "#050505",
    color: COLORS.textPrimary,
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
  },

  helperText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 17,
  },

  calculateButton: {
    backgroundColor: CYAN,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#351316",
    borderWidth: 1,
    borderColor: "#7F1D1D",
  },

  errorIcon: {
    color: "#FCA5A5",
    fontSize: 17,
    fontWeight: "800",
  },

  errorText: {
    flex: 1,
    color: "#FCA5A5",
    fontSize: 12,
    lineHeight: 18,
  },

  summaryCard: {
    backgroundColor: PURPLE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: VIOLET,
    padding: 18,
    gap: 16,
  },

  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  summaryEyebrow: {
    color: "#D8C5EC",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  readyBadge: {
    backgroundColor: "#123C35",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  readyBadgeText: {
    color: "#5EEAD4",
    fontSize: 11,
    fontWeight: "700",
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#8950B9",
  },

  resultGrid: {
    flexDirection: "row",
    gap: 8,
  },

  resultItem: {
    flex: 1,
    backgroundColor: "#190D27",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    gap: 5,
  },

  resultValue: {
    color: CYAN,
    fontSize: 23,
    fontWeight: "800",
  },

  resultLabel: {
    color: "#D8C5EC",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.7,
  },

  cellSizeContainer: {
    backgroundColor: "#190D27",
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },

  cellSizeLabel: {
    color: "#D8C5EC",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  cellSizeValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  cellSizeHint: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
});
