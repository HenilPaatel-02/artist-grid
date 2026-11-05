import { StyleSheet, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

export function ProjectCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.thumbnail} />

      <View style={styles.content}>
        <View style={styles.title} />
        <View style={styles.grid} />
        <View style={styles.date} />
      </View>

      <View style={styles.arrow} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    gap: 14,
  },

  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: COLORS.amethyst,
  },

  content: {
    flex: 1,
    gap: 9,
  },

  title: {
    width: "75%",
    height: 14,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceElevated,
  },

  grid: {
    width: "45%",
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceElevated,
  },

  date: {
    width: "60%",
    height: 10,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceElevated,
  },

  arrow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceElevated,
  },
});
