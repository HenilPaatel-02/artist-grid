import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/src/constants/colors";

import type {
  DrawingSurface,
  PaperType,
  SurfaceOrientation,
} from "../drawing-surface.types";

import { createDrawingSurface } from "../drawing-surface.utils";

import { OrientationSelector } from "./OrientationSelector";
import { PaperSizeSelector } from "./PaperSizeSelector";

type DrawingSurfaceSectionProps = {
  initialOrientation: SurfaceOrientation;
  restoredSurface?: DrawingSurface | null;
  onSurfaceChange?: (surface: DrawingSurface | null) => void;
};

const CYAN = "#00E5FF";
const PURPLE = "#3B0A6B";
const CARD_BACKGROUND = "#10091A";
const MUTED_PURPLE = "#B9AEC8";

export function DrawingSurfaceSection({
  initialOrientation,
  restoredSurface = null,
  onSurfaceChange,
}: DrawingSurfaceSectionProps) {
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(
    restoredSurface?.type ?? null,
  );

  const [orientation, setOrientation] = useState<SurfaceOrientation>(
    restoredSurface?.orientation ?? initialOrientation,
  );

  const [surface, setSurface] = useState<DrawingSurface | null>(
    restoredSurface,
  );

  useEffect(() => {
    setSelectedPaper(restoredSurface?.type ?? null);
    setOrientation(restoredSurface?.orientation ?? initialOrientation);
    setSurface(restoredSurface ?? null);
  }, [restoredSurface, initialOrientation]);

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
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionNumber}>02</Text>

        <View style={styles.headingContent}>
          <Text style={styles.sectionTitle}>Drawing Surface</Text>
          <Text style={styles.sectionDescription}>
            Configure the physical paper you&apos;ll use for your artwork.
          </Text>
        </View>
      </View>

      <View style={styles.selectorCard}>
        <View style={styles.subsectionHeader}>
          <Text style={styles.subsectionTitle}>Paper Size</Text>
          <Text style={styles.subsectionHint}>Choose a preset</Text>
        </View>

        <PaperSizeSelector
          selectedPaper={selectedPaper}
          onSelect={handlePaperSelect}
        />
      </View>

      <View style={styles.separator} />

      <View style={styles.selectorCard}>
        <View style={styles.subsectionHeader}>
          <Text style={styles.subsectionTitle}>Paper Orientation</Text>
          <Text style={styles.subsectionHint}>Select your paper direction</Text>
        </View>

        <OrientationSelector
          orientation={orientation}
          onChange={handleOrientationChange}
        />
      </View>

      {surface ? (
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryEyebrow}>YOUR SELECTED SURFACE</Text>
              <Text style={styles.paperName}>{surface.type}</Text>
            </View>

            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>✓ Ready</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryDetails}>
            <View style={styles.summaryDetail}>
              <Text style={styles.summaryLabel}>DIMENSIONS</Text>
              <Text style={styles.dimensions}>
                {surface.size.width} × {surface.size.height}
              </Text>
              <Text style={styles.unit}>{surface.size.unit}</Text>
            </View>

            <View style={styles.summaryDetail}>
              <Text style={styles.summaryLabel}>ORIENTATION</Text>
              <Text style={styles.orientationValue}>
                {capitalize(surface.orientation)}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {selectedPaper === "CUSTOM" ? (
        <View style={styles.customNotice}>
          <Text style={styles.customIcon}>i</Text>

          <View style={styles.customContent}>
            <Text style={styles.customTitle}>
              Custom dimensions coming soon
            </Text>
            <Text style={styles.customNoticeText}>
              Custom paper dimensions aren&apos;t available in this MVP. Please
              select one of the standard paper sizes.
            </Text>
          </View>
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

  selectorCard: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#321A49",
    padding: 16,
    gap: 16,
  },

  subsectionHeader: {
    gap: 5,
  },

  subsectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },

  subsectionHint: {
    color: MUTED_PURPLE,
    fontSize: 12,
  },

  separator: {
    height: 1,
    backgroundColor: "#321A49",
  },

  summaryCard: {
    backgroundColor: PURPLE,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#6A2BB8",
    gap: 16,
  },

  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  summaryEyebrow: {
    color: "#D8C5EC",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
  },

  paperName: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  readyBadge: {
    backgroundColor: "#123C35",
    borderRadius: 20,
    paddingHorizontal: 11,
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

  summaryDetails: {
    flexDirection: "row",
    gap: 20,
  },

  summaryDetail: {
    flex: 1,
    gap: 5,
  },

  summaryLabel: {
    color: "#D8C5EC",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  dimensions: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  unit: {
    color: "#D8C5EC",
    fontSize: 11,
  },

  orientationValue: {
    color: CYAN,
    fontSize: 17,
    fontWeight: "700",
  },

  customNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: "#6A2BB8",
  },

  customIcon: {
    color: CYAN,
    fontSize: 17,
    fontWeight: "800",
  },

  customContent: {
    flex: 1,
    gap: 5,
  },

  customTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },

  customNoticeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 19,
  },
});
