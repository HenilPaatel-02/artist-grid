import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";
import { ImageEffects } from "../image-effects.types";

type Props = {
  effects: ImageEffects;
  onChange: (effects: ImageEffects) => void;
};

export function ImageEffectsSection({ effects, onChange }: Props) {
  const update = (key: keyof ImageEffects, value: number) => {
    onChange({
      ...effects,
      [key]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Effects</Text>

      <EffectControl
        label="Brightness"
        value={effects.brightness}
        min={-100}
        max={100}
        onChange={(value) => update("brightness", value)}
      />

      <EffectControl
        label="Contrast"
        value={effects.contrast}
        min={0}
        max={200}
        onChange={(value) => update("contrast", value)}
      />

      <EffectControl
        label="Saturation"
        value={effects.saturation}
        min={0}
        max={200}
        onChange={(value) => update("saturation", value)}
      />

      <EffectControl
        label="Grayscale"
        value={effects.grayscale}
        min={0}
        max={100}
        onChange={(value) => update("grayscale", value)}
      />

      <EffectControl
        label="Opacity"
        value={effects.opacity}
        min={0}
        max={100}
        onChange={(value) => update("opacity", value)}
      />
    </View>
  );
}

type EffectControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function EffectControl({
  label,
  value,
  min,
  max,
  onChange,
}: EffectControlProps) {
  const decrease = () => {
    onChange(Math.max(min, value - 5));
  };

  const increase = () => {
    onChange(Math.min(max, value + 5));
  };

  return (
    <View style={styles.control}>
      <Text style={styles.label}>
        {label}: {value}
      </Text>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={decrease}>
          <Text style={styles.btnText}>-</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={increase}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingVertical: 16,
    marginTop: 28,
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },

  control: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  buttons: {
    flexDirection: "row",
    gap: 10,
  },

  button: {
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    color: COLORS.textPrimary,
    borderColor: COLORS.border,
  },

  btnText: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
});
