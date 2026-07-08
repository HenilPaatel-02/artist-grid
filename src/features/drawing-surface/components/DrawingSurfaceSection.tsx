import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

import {
  DrawingSurface,
  PaperType,
  SurfaceOrientation,
} from "../drawing-surface.types";

import { createDrawingSurface } from "../drawing-surface.utils";

import { OrientationSelector } from "./OrientationSelector";
import { PaperSizeSelector } from "./PaperSizeSelector";

type DrawingSurfaceSectionProps = {
  initialOrientation: SurfaceOrientation;
  onSurfaceChange?: (surface: DrawingSurface | null) => void;
};

export function DrawingSurfaceSection({
  initialOrientation,
  onSurfaceChange,
}: DrawingSurfaceSectionProps) {
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(null);

  const [orientation, setOrientation] =
    useState<SurfaceOrientation>(initialOrientation);

  const [surface, setSurface] = useState<DrawingSurface | null>(null);

  const handlePaperSelect = (paper: PaperType) => {
    setSelectedPaper(paper);

    if (paper === "CUSTOM") {
      setSurface(null);
      onSurfaceChange?.(null);

      return;
    }

    const nextSurface = createDrawingSurface(paper, orientation);

    setSurface(nextSurface);
    onSurfaceChange?.(nextSurface);
  };

  const handleOrientationChange = (nextOrientation: SurfaceOrientation) => {
    setOrientation(nextOrientation);

    if (!selectedPaper || selectedPaper === "CUSTOM") {
      return;
    }

    const nextSurface = createDrawingSurface(selectedPaper, nextOrientation);

    setSurface(nextSurface);
    onSurfaceChange?.(nextSurface);
  };

  return (
    <View style={styles.container}>
      <PaperSizeSelector
        selectedPaper={selectedPaper}
        onSelect={handlePaperSelect}
      />

      <View style={styles.separator} />

      <OrientationSelector
        orientation={orientation}
        onChange={handleOrientationChange}
      />

      {surface ? (
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Selected Surface</Text>

          <Text style={styles.paperName}>{surface.type}</Text>

          <Text style={styles.dimensions}>
            {surface.size.width} × {surface.size.height} {surface.size.unit}
          </Text>

          <Text style={styles.orientation}>
            {capitalize(surface.orientation)}
          </Text>
        </View>
      ) : null}

      {selectedPaper === "CUSTOM" ? (
        <View style={styles.customNotice}>
          <Text style={styles.customNoticeText}>
            Custom surface dimensions will be added in the next step.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 28,
  },

  summary: {
    marginTop: 28,
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },

  paperName: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },

  dimensions: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "600",
  },

  orientation: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },

  customNotice: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },

  customNoticeText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
