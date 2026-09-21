import Slider from "@react-native-community/slider";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { GRID_STYLING_LIMITS } from "../grid-styling.constants";

import { DEFAULT_GRID_STYLING, GridStyling } from "../grid-styling.types";

type Props = {
  styling: GridStyling;
  onChange: (styling: GridStyling) => void;
};

export function GridStylingSection({ styling, onChange }: Props) {
  const update = <K extends keyof GridStyling>(
    key: K,
    value: GridStyling[K],
  ) => {
    onChange({
      ...styling,
      [key]: value,
    });
  };

  const reset = () => {
    onChange({
      ...DEFAULT_GRID_STYLING,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Grid Style</Text>

          <Text style={styles.subtitle}>
            Customize how the drawing grid appears.
          </Text>
        </View>

        <Pressable onPress={reset} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>

      <SwitchRow
        label="Show Grid"
        value={styling.showGrid}
        onChange={(value) => update("showGrid", value)}
      />

      <SwitchRow
        label="Row Labels"
        value={styling.showRowLabels}
        onChange={(value) => update("showRowLabels", value)}
      />

      <SwitchRow
        label="Column Labels"
        value={styling.showColumnLabels}
        onChange={(value) => update("showColumnLabels", value)}
      />

      <SliderControl
        label="Grid Opacity"
        value={styling.gridOpacity}
        min={GRID_STYLING_LIMITS.gridOpacity.min}
        max={GRID_STYLING_LIMITS.gridOpacity.max}
        step={GRID_STYLING_LIMITS.gridOpacity.step}
        suffix="%"
        onChange={(value) => update("gridOpacity", value)}
      />

      <SliderControl
        label="Stroke Width"
        value={styling.gridStrokeWidth}
        min={GRID_STYLING_LIMITS.gridStrokeWidth.min}
        max={GRID_STYLING_LIMITS.gridStrokeWidth.max}
        step={GRID_STYLING_LIMITS.gridStrokeWidth.step}
        suffix=" px"
        onChange={(value) => update("gridStrokeWidth", value)}
      />

      <SliderControl
        label="Label Size"
        value={styling.labelSize}
        min={GRID_STYLING_LIMITS.labelSize.min}
        max={GRID_STYLING_LIMITS.labelSize.max}
        step={GRID_STYLING_LIMITS.labelSize.step}
        suffix=" px"
        onChange={(value) => update("labelSize", value)}
      />

      <ColorOption
        label="Grid Color"
        color={styling.gridColor}
        onChange={(color) => update("gridColor", color)}
      />

      <ColorOption
        label="Label Color"
        color={styling.labelColor}
        onChange={(color) => update("labelColor", color)}
      />
    </View>
  );
}

type SwitchRowProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function SwitchRow({ label, value, onChange }: SwitchRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

type SliderControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
};

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange,
}: SliderControlProps) {
  return (
    <View style={styles.control}>
      <View style={styles.valueRow}>
        <Text style={styles.label}>{label}</Text>

        <Text style={styles.value}>
          {Number.isInteger(value) ? value : value.toFixed(1)}
          {suffix}
        </Text>
      </View>

      <Slider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor="#222222"
        maximumTrackTintColor="#D1D5DB"
        thumbTintColor="#222222"
      />

      <View style={styles.rangeRow}>
        <Text style={styles.range}>{min}</Text>

        <Text style={styles.range}>{max}</Text>
      </View>
    </View>
  );
}

type ColorOptionProps = {
  label: string;
  color: string;
  onChange: (color: string) => void;
};

function ColorOption({ label, color, onChange }: ColorOptionProps) {
  const colors = ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#00AA00"];

  return (
    <View style={styles.control}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.colorRow}>
        {colors.map((item) => (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            style={[
              styles.colorButton,
              {
                backgroundColor: item,
              },
              color === item && styles.colorButtonSelected,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    paddingVertical: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  resetButton: {
    paddingHorizontal: 14,
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    justifyContent: "center",
  },

  resetText: {
    fontSize: 13,
    fontWeight: "600",
  },

  row: {
    minHeight: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  control: {
    gap: 4,
  },

  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
  },

  slider: {
    width: "100%",
    height: 40,
  },

  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  range: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  colorRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
  },

  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  colorButtonSelected: {
    borderWidth: 3,
    borderColor: "#444444",
  },
});
