import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

type ProjectThumbnailProps = {
  uri: string;
};

export function ProjectThumbnail({ uri }: ProjectThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (!uri || hasError) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackIcon}>▧</Text>
        <Text style={styles.fallbackText}>No Image</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.image}
      resizeMode="cover"
      onError={() => setHasError(true)}
      accessibilityLabel="Project reference image"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },

  fallback: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: COLORS.amethyst,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.violet,
  },

  fallbackIcon: {
    color: COLORS.primary,
    fontSize: 26,
  },

  fallbackText: {
    color: COLORS.textPrimary,
    fontSize: 9,
    marginTop: 3,
  },
});
