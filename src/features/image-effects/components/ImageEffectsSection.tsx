import Slider from "@react-native-community/slider";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { IMAGE_EFFECT_LIMITS } from "../image-effects.constants";
import { DEFAULT_IMAGE_EFFECTS, ImageEffects } from "../image-effects.types";

type Props = {
  effects: ImageEffects;
  onChange: (effects: ImageEffects) => void;
};

export function ImageEffectsSection({ effects, onChange }: Props) {
  const updateEffect = (key: keyof ImageEffects, value: number) => {
    onChange({
      ...effects,
      [key]: value,
    });
  };

  const resetEffects = () => {
    onChange({
      ...DEFAULT_IMAGE_EFFECTS,
    });
  };

  const isDefault =
    effects.brightness === DEFAULT_IMAGE_EFFECTS.brightness &&
    effects.contrast === DEFAULT_IMAGE_EFFECTS.contrast &&
    effects.saturation === DEFAULT_IMAGE_EFFECTS.saturation &&
    effects.grayscale === DEFAULT_IMAGE_EFFECTS.grayscale &&
    effects.opacity === DEFAULT_IMAGE_EFFECTS.opacity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Image Effects</Text>

          <Text style={styles.subtitle}>
            Adjust the reference image without changing the grid.
          </Text>
        </View>

        <Pressable
          onPress={resetEffects}
          disabled={isDefault}
          style={[styles.resetButton, isDefault && styles.resetButtonDisabled]}
        >
          <Text
            style={[styles.resetText, isDefault && styles.resetTextDisabled]}
          >
            Reset
          </Text>
        </Pressable>
      </View>

      <EffectSlider
        label="Brightness"
        value={effects.brightness}
        min={IMAGE_EFFECT_LIMITS.brightness.min}
        max={IMAGE_EFFECT_LIMITS.brightness.max}
        step={IMAGE_EFFECT_LIMITS.brightness.step}
        onChange={(value) => updateEffect("brightness", value)}
      />

      <EffectSlider
        label="Contrast"
        value={effects.contrast}
        min={IMAGE_EFFECT_LIMITS.contrast.min}
        max={IMAGE_EFFECT_LIMITS.contrast.max}
        step={IMAGE_EFFECT_LIMITS.contrast.step}
        onChange={(value) => updateEffect("contrast", value)}
      />

      <EffectSlider
        label="Saturation"
        value={effects.saturation}
        min={IMAGE_EFFECT_LIMITS.saturation.min}
        max={IMAGE_EFFECT_LIMITS.saturation.max}
        step={IMAGE_EFFECT_LIMITS.saturation.step}
        onChange={(value) => updateEffect("saturation", value)}
      />

      <EffectSlider
        label="Grayscale"
        value={effects.grayscale}
        min={IMAGE_EFFECT_LIMITS.grayscale.min}
        max={IMAGE_EFFECT_LIMITS.grayscale.max}
        step={IMAGE_EFFECT_LIMITS.grayscale.step}
        onChange={(value) => updateEffect("grayscale", value)}
      />

      <EffectSlider
        label="Opacity"
        value={effects.opacity}
        min={IMAGE_EFFECT_LIMITS.opacity.min}
        max={IMAGE_EFFECT_LIMITS.opacity.max}
        step={IMAGE_EFFECT_LIMITS.opacity.step}
        onChange={(value) => updateEffect("opacity", value)}
      />
    </View>
  );
}

type EffectSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

function EffectSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: EffectSliderProps) {
  return (
    <View style={styles.control}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>

        <Text style={styles.value}>{Math.round(value)}</Text>
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
        <Text style={styles.rangeText}>{min}</Text>
        <Text style={styles.rangeText}>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingVertical: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
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
    minWidth: 64,
    minHeight: 40,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  resetButtonDisabled: {
    opacity: 0.45,
  },

  resetText: {
    fontSize: 13,
    fontWeight: "600",
  },

  resetTextDisabled: {
    color: "#9CA3AF",
  },

  control: {
    gap: 4,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
  },

  value: {
    minWidth: 42,
    textAlign: "right",
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

  rangeText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});
