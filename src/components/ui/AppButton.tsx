import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { COLORS } from "@/src/constants/colors";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: "primary" | "secondary";
};

export function AppButton({
  title,
  onPress,
  disabled = false,
  style,
  variant = "primary",
}: AppButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
    >
      <Text
        style={[
          styles.title,
          isPrimary ? styles.primaryTitle : styles.secondaryTitle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    borderRadius: 16,
  },

  primary: {
    backgroundColor: COLORS.primary,
  },

  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.5,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
  },

  primaryTitle: {
    color: COLORS.black,
  },

  secondaryTitle: {
    color: COLORS.textPrimary,
  },
});
