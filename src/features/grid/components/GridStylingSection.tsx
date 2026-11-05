import Slider from "@react-native-community/slider";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { GRID_STYLING_LIMITS } from "../grid-styling.constants";
import { DEFAULT_GRID_STYLING, GridStyling } from "../grid-styling.types";

const PALETTE = {
  surface: "#10091A",
  elevated: "#1A1026",
  border: "#352443",
  cyan: "#00E5FF",
  text: "#F4F0FA",
  muted: "#A99BB8",
  track: "#51445E",
} as const;

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
    onChange({ ...DEFAULT_GRID_STYLING });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionNumber}>05</Text>

        <View style={styles.headerText}>
          <Text style={styles.title}>Grid Styling</Text>

          <Text style={styles.subtitle}>
            Customize grid visibility, colors, opacity, and line thickness.
          </Text>
        </View>

        <Pressable
          onPress={reset}
          style={styles.resetButton}
          accessibilityRole="button"
          accessibilityLabel="Reset grid styling"
        >
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>

      <View style={styles.visibilityCard}>
        <Text style={styles.groupTitle}>Grid Visibility</Text>

        <SwitchRow
          label="Show Grid"
          value={styling.showGrid}
          onChange={(value) => update("showGrid", value)}
        />

        <View style={styles.rowDivider} />

        <SwitchRow
          label="Row Labels"
          value={styling.showRowLabels}
          onChange={(value) => update("showRowLabels", value)}
        />

        <View style={styles.rowDivider} />

        <SwitchRow
          label="Column Labels"
          value={styling.showColumnLabels}
          onChange={(value) => update("showColumnLabels", value)}
        />
      </View>

      <View style={styles.controlsCard}>
        <Text style={styles.groupTitle}>Grid Appearance</Text>

        <SliderControl
          label="Grid Opacity"
          value={styling.gridOpacity}
          min={GRID_STYLING_LIMITS.gridOpacity.min}
          max={GRID_STYLING_LIMITS.gridOpacity.max}
          step={GRID_STYLING_LIMITS.gridOpacity.step}
          suffix="%"
          onChange={(value) => update("gridOpacity", value)}
        />

        <View style={styles.controlDivider} />

        <SliderControl
          label="Stroke Width"
          value={styling.gridStrokeWidth}
          min={GRID_STYLING_LIMITS.gridStrokeWidth.min}
          max={GRID_STYLING_LIMITS.gridStrokeWidth.max}
          step={GRID_STYLING_LIMITS.gridStrokeWidth.step}
          suffix=" px"
          onChange={(value) => update("gridStrokeWidth", value)}
        />

        <View style={styles.controlDivider} />

        <SliderControl
          label="Label Size"
          value={styling.labelSize}
          min={GRID_STYLING_LIMITS.labelSize.min}
          max={GRID_STYLING_LIMITS.labelSize.max}
          step={GRID_STYLING_LIMITS.labelSize.step}
          suffix=" px"
          onChange={(value) => update("labelSize", value)}
        />
      </View>

      <View style={styles.controlsCard}>
        <Text style={styles.groupTitle}>Colors</Text>

        <ColorOption
          label="Grid Color"
          color={styling.gridColor}
          onChange={(color) => update("gridColor", color)}
        />

        <View style={styles.controlDivider} />

        <ColorOption
          label="Label Color"
          color={styling.labelColor}
          onChange={(color) => update("labelColor", color)}
        />
      </View>
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

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: PALETTE.track,
          true: "#087D8A",
        }}
        thumbColor={value ? PALETTE.cyan : "#D4C9DF"}
        accessibilityLabel={label}
      />
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
        minimumTrackTintColor={PALETTE.cyan}
        maximumTrackTintColor={PALETTE.track}
        thumbTintColor={PALETTE.cyan}
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
  const colors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#0000FF",
    "#00AA00",
    "#00E5FF",
    "#FACC15",
  ];

  return (
    <View style={styles.control}>
      <View style={styles.valueRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.colorValue}>{color.toUpperCase()}</Text>
      </View>

      <View style={styles.colorRow}>
        {colors.map((item) => {
          const selected = color.toLowerCase() === item.toLowerCase();

          return (
            <Pressable
              key={item}
              onPress={() => onChange(item)}
              style={[
                styles.colorButton,
                { backgroundColor: item },
                selected && styles.colorButtonSelected,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Select ${label.toLowerCase()} ${item}`}
              accessibilityState={{ selected }}
            >
              {selected && <Text style={styles.colorSelectedMark}>✓</Text>}
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
    gap: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  sectionNumber: {
    color: "#00E5FF",
    fontSize: 13,
    fontWeight: "800",
    backgroundColor: "#3B0A6B",
    overflow: "hidden",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  headerText: {
    flex: 1,
    gap: 5,
  },

  title: {
    color: PALETTE.text,
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: PALETTE.muted,
  },

  resetButton: {
    paddingHorizontal: 14,
    minHeight: 40,
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: PALETTE.elevated,
  },

  resetText: {
    color: PALETTE.cyan,
    fontSize: 13,
    fontWeight: "700",
  },

  visibilityCard: {
    backgroundColor: PALETTE.surface,
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  controlsCard: {
    backgroundColor: PALETTE.surface,
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderRadius: 14,
    padding: 14,
    gap: 16,
  },

  groupTitle: {
    color: PALETTE.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  row: {
    minHeight: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowDivider: {
    height: 1,
    backgroundColor: PALETTE.border,
  },

  control: {
    gap: 5,
  },

  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  label: {
    color: PALETTE.text,
    fontSize: 13,
    fontWeight: "600",
  },

  value: {
    color: PALETTE.cyan,
    fontSize: 13,
    fontWeight: "700",
  },

  colorValue: {
    color: PALETTE.muted,
    fontSize: 11,
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
    color: PALETTE.muted,
  },

  controlDivider: {
    height: 1,
    backgroundColor: PALETTE.border,
  },

  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingVertical: 8,
  },

  colorButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: PALETTE.border,
    alignItems: "center",
    justifyContent: "center",
  },

  colorButtonSelected: {
    borderWidth: 3,
    borderColor: PALETTE.cyan,
  },

  colorSelectedMark: {
    color: "#3B0A6B",
    fontSize: 15,
    fontWeight: "900",
  },
});
