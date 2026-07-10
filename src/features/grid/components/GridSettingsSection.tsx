import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

import { DrawingSurface } from "../../drawing-surface/drawing-surface.types";

import { calculateGrid } from "../grid-calculation.utils";

import { AppButton } from "@/src/components/ui/AppButton";
import { GridCalculation, GridSettings } from "../grid.types";

type GridSettingsSectionProps = {
  surface: DrawingSurface;
  onGridChange?: (calculation: GridCalculation | null) => void;
};

export function GridSettingsSection({
  surface,
  onGridChange,
}: GridSettingsSectionProps) {
  const [rows, setRows] = useState("10");
  const [columns, setColumns] = useState("8");

  const [calculation, setCalculation] = useState<GridCalculation | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grid Settings</Text>

      <Text style={styles.description}>
        Choose how many rows and columns you want on your drawing surface.
      </Text>

      <View style={styles.inputs}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rows</Text>

          <TextInput
            value={rows}
            onChangeText={setRows}
            keyboardType="number-pad"
            style={styles.input}
            placeholder="10"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Columns</Text>

          <TextInput
            value={columns}
            onChangeText={setColumns}
            keyboardType="number-pad"
            style={styles.input}
            placeholder="8"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      <AppButton title="Calculate Grid" onPress={handleCalculate} />

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      {calculation ? (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Grid Calculation</Text>

          <Text style={styles.summaryText}>
            {calculation.columns} columns × {calculation.rows} rows
          </Text>

          <Text style={styles.summaryText}>
            Cell: {calculation.cellWidth.toFixed(2)} ×{" "}
            {calculation.cellHeight.toFixed(2)} mm
          </Text>

          <Text style={styles.summaryText}>
            Total cells: {calculation.rows * calculation.columns}
          </Text>
        </View>
      ) : null}
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

  inputs: {
    flexDirection: "row",
    gap: 12,
  },

  inputGroup: {
    flex: 1,
  },

  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },

  input: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
    fontSize: 16,
  },

  error: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 12,
  },

  summary: {
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  summaryTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },

  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
});
