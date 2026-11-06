import { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import { COLORS } from "@/src/constants/colors";

import type {
  DrawingSurface,
  MeasurementUnit,
} from "../../drawing-surface/drawing-surface.types";
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

type ConfigurableGridMode = "rows-columns" | "cell-size";

const CELL_SIZE_PRESETS = [
  { label: "1 cm", valueMm: 10 },
  { label: "2 cm", valueMm: 20 },
  { label: "2.5 cm", valueMm: 25 },
  { label: "3 cm", valueMm: 30 },
  { label: "5 cm", valueMm: 50 },
  { label: "1 inch", valueMm: 25.4 },
];

const DISPLAY_UNITS: MeasurementUnit[] = ["mm", "cm", "inch"];

const convertFromMm = (valueMm: number, unit: MeasurementUnit): number => {
  switch (unit) {
    case "mm":
      return valueMm;
    case "cm":
      return valueMm / 10;
    case "inch":
      return valueMm / 25.4;
    case "ft":
      return valueMm / 304.8;
  }
};

const formatMeasurement = (valueMm: number, unit: MeasurementUnit): string => {
  const value = convertFromMm(valueMm, unit);

  return `${Number(value.toFixed(2))} ${unit === "inch" ? "in" : unit}`;
};

const convertToMm = (value: number, unit: MeasurementUnit): number => {
  switch (unit) {
    case "mm":
      return value;
    case "cm":
      return value * 10;
    case "inch":
      return value * 25.4;
    case "ft":
      return value * 304.8;
  }
};

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

  const [gridMode, setGridMode] = useState<ConfigurableGridMode>(
    restoredCalculation?.cellSizeMm !== undefined
      ? "cell-size"
      : "rows-columns",
  );

  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>("mm");

  const [cellSizeMm, setCellSizeMm] = useState(
    restoredCalculation?.cellSizeMm ?? 25,
  );

  const [customCellSize, setCustomCellSize] = useState("25");

  useEffect(() => {
    const restoredMode =
      restoredCalculation?.cellSizeMm !== undefined
        ? "cell-size"
        : "rows-columns";

    const restoredCellSize = restoredCalculation?.cellSizeMm ?? 25;

    setGridMode(restoredMode);
    setRows(String(restoredCalculation?.rows ?? 10));
    setColumns(String(restoredCalculation?.columns ?? 8));
    setCalculation(restoredCalculation ?? null);

    setCellSizeMm(restoredCellSize);
    setCustomCellSize(
      String(
        Number(convertFromMm(restoredCellSize, measurementUnit).toFixed(2)),
      ),
    );

    setError(null);
  }, [restoredCalculation, surface]);

  const invalidateCalculation = () => {
    setCalculation(null);
    setError(null);
    onGridChange?.(null);
  };

  const handleModeChange = (mode: ConfigurableGridMode) => {
    setGridMode(mode);
    invalidateCalculation();
  };

  const handleUnitChange = (unit: MeasurementUnit) => {
    const currentValue = convertFromMm(cellSizeMm, unit);

    setMeasurementUnit(unit);
    setCustomCellSize(String(Number(currentValue.toFixed(2))));

    invalidateCalculation();
  };

  const handlePresetChange = (valueMm: number) => {
    setCellSizeMm(valueMm);

    setCustomCellSize(
      String(Number(convertFromMm(valueMm, measurementUnit).toFixed(2))),
    );

    invalidateCalculation();
  };

  const handleCustomCellSizeChange = (value: string) => {
    setCustomCellSize(value);

    const numericValue = Number(value);

    if (!value.trim() || !Number.isFinite(numericValue) || numericValue <= 0) {
      invalidateCalculation();
      return;
    }

    const nextCellSizeMm = convertToMm(numericValue, measurementUnit);

    setCellSizeMm(nextCellSizeMm);
    invalidateCalculation();
  };

  const handleCalculate = () => {
    Keyboard.dismiss();

    try {
      setError(null);

      if (
        gridMode === "cell-size" &&
        (!customCellSize.trim() ||
          !Number.isFinite(Number(customCellSize)) ||
          Number(customCellSize) <= 0)
      ) {
        throw new Error("Please enter a valid cell size.");
      }

      const settings: GridSettings =
        gridMode === "rows-columns"
          ? {
              mode: "rows-columns",
              rows: Number(rows),
              columns: Number(columns),
            }
          : {
              mode: "cell-size",
              cellSizeMm,
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

      {/* GRID MODE SELECTOR */}
      <View style={styles.inputCard}>
        <Text style={styles.cardTitle}>Grid Mode</Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
          {(
            [
              ["rows-columns", "Rows & Columns"],
              ["cell-size", "Cell Size"],
            ] as const
          ).map(([value, label]) => {
            const selected = gridMode === value;

            return (
              <Pressable
                key={value}
                onPress={() => handleModeChange(value)}
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor: selected ? PURPLE : CARD_BACKGROUND,
                  borderWidth: 1,
                  borderColor: selected ? CYAN : "#352443",
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text
                  style={{
                    color: selected ? CYAN : "#F4F0FA",
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Grid inputs */}
      {gridMode === "rows-columns" ? (
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
      ) : (
        <View style={styles.inputCard}>
          <Text style={styles.cardTitle}>Cell Size</Text>
          <Text style={styles.helperText}>
            Choose the physical size of each square drawing cell.
          </Text>

          {/* Presets */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 16,
            }}
          >
            {CELL_SIZE_PRESETS.map((preset) => {
              const selected = Math.abs(cellSizeMm - preset.valueMm) < 0.001;

              return (
                <Pressable
                  key={preset.label}
                  onPress={() => handlePresetChange(preset.valueMm)}
                  style={{
                    width: "31%",
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor: selected ? PURPLE : "#1A1026",
                    borderWidth: 1,
                    borderColor: selected ? CYAN : "#352443",
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={{
                      color: selected ? CYAN : "#F4F0FA",
                      fontWeight: "600",
                    }}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Custom size */}
          <Text style={[styles.label, { marginTop: 20 }]}>
            Custom Cell Size
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 8,
            }}
          >
            <TextInput
              value={customCellSize}
              onChangeText={handleCustomCellSizeChange}
              keyboardType="decimal-pad"
              placeholder="Enter cell size"
              placeholderTextColor={COLORS.textSecondary}
              style={[styles.input, { flex: 1 }]}
              selectTextOnFocus
              accessibilityLabel="Custom square cell size"
              returnKeyType="done"
              onSubmitEditing={handleCalculate}
            />

            <Text style={{ color: CYAN, fontWeight: "600" }}>
              {measurementUnit === "inch" ? "in" : measurementUnit}
            </Text>
          </View>

          {/* Unit */}
          <Text style={[styles.label, { marginTop: 20 }]}>
            Measurement Unit
          </Text>

          <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
            {DISPLAY_UNITS.map((unit) => {
              const selected = measurementUnit === unit;

              return (
                <Pressable
                  key={unit}
                  onPress={() => handleUnitChange(unit)}
                  style={{
                    flex: 1,
                    padding: 12,
                    alignItems: "center",
                    borderRadius: 10,
                    backgroundColor: selected ? PURPLE : "#1A1026",
                    borderWidth: 1,
                    borderColor: selected ? CYAN : "#352443",
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={{
                      color: selected ? CYAN : "#F4F0FA",
                      fontWeight: "600",
                    }}
                  >
                    {unit === "inch" ? "Inches" : unit}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <AppButton
            title="Calculate Grid"
            onPress={handleCalculate}
            style={styles.calculateButton}
          />
        </View>
      )}
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
              {formatMeasurement(calculation.cellWidth, measurementUnit)}
              {" × "}
              {formatMeasurement(calculation.cellHeight, measurementUnit)}
            </Text>

            <Text style={styles.cellSizeHint}>
              Width × Height per drawing cell
            </Text>
          </View>

          {calculation.cellSizeMm !== undefined ? (
            <View style={styles.cellSizeContainer}>
              <Text style={styles.cellSizeLabel}>PAPER MARGINS</Text>

              <Text style={styles.cellSizeValue}>
                Left:{" "}
                {formatMeasurement(
                  calculation.marginLeftMm ?? 0,
                  measurementUnit,
                )}
                {"  "}Right:{" "}
                {formatMeasurement(
                  calculation.marginRightMm ?? 0,
                  measurementUnit,
                )}
              </Text>

              <Text style={styles.cellSizeValue}>
                Top:{" "}
                {formatMeasurement(
                  calculation.marginTopMm ?? 0,
                  measurementUnit,
                )}
                {"  "}Bottom:{" "}
                {formatMeasurement(
                  calculation.marginBottomMm ?? 0,
                  measurementUnit,
                )}
              </Text>

              <Text style={styles.cellSizeHint}>
                Grid is centered on your selected paper.
              </Text>
            </View>
          ) : null}
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
