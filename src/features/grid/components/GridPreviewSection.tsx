import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { DrawingSurface } from "../../drawing-surface/drawing-surface.types";

import { SelectedImage } from "../../image-picker/image-picker.types";

import { calculateGridCanvasLayout } from "../grid-canvas-layout.utils";

import { GridCalculation } from "../grid.types";

import { GridCanvas } from "./GridCanvas";

import { ImageEffects } from "@/src/features/image-effects/image-effects.types";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import type { GridStyling } from "../grid-styling.types";

import type {
  ExportBackground,
  ExportContent,
  ExportSettings,
  ExportSize,
} from "@/src/features/export/export.types";

import { DEFAULT_EXPORT_SETTINGS } from "@/src/features/export/export.types";

type GridPreviewSectionProps = {
  image: SelectedImage;
  surface: DrawingSurface;
  calculation: GridCalculation;
  imageEffects: ImageEffects;
  gridStyling: GridStyling;
};

const EXPORT_COLORS = {
  surface: "#10091A",
  elevated: "#1A1026",
  border: "#352443",
  cyan: "#00E5FF",
  text: "#F4F0FA",
  muted: "#A99BB8",
  disabled: "#51465C",
  success: "#22C55E",
} as const;

const PREVIEW_COLORS = {
  background: "#050505",
  surface: "#10091A",
  surfaceElevated: "#1A1026",
  border: "#352443",
  cyan: "#00E5FF",
  violet: "#3B0A6B",
  text: "#F4F0FA",
  muted: "#A99BB8",
  disabled: "#51465C",
  white: "#FFFFFF",
  success: "#22C55E",
} as const;

export function GridPreviewSection({
  image,
  surface,
  calculation,
  imageEffects,
  gridStyling,
}: GridPreviewSectionProps) {
  const [availableWidth, setAvailableWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    setAvailableWidth(width);
  };

  const canvasLayout =
    availableWidth > 0
      ? calculateGridCanvasLayout(availableWidth, surface)
      : null;

  const [captureCanvas, setCaptureCanvas] = useState<
    (() => Promise<string>) | null
  >(null);

  const [isExporting, setIsExporting] = useState(false);
  const [exportedImageUri, setExportedImageUri] = useState<string | null>(null);

  const [exportSettings, setExportSettings] = useState<ExportSettings>(
    DEFAULT_EXPORT_SETTINGS,
  );

  const updateExportSettings = (changes: Partial<ExportSettings>) => {
    setExportSettings((previous) => ({ ...previous, ...changes }));

    // Prevent accidentally saving/sharing a PNG made with older settings.
    setExportedImageUri(null);
  };

  const handleCanvasReady = useCallback(
    (capture: (() => Promise<string>) | null) => {
      setCaptureCanvas(() => capture);
    },
    [],
  );

  const handleExportPreview = async () => {
    if (!captureCanvas || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const base64 = await captureCanvas();
      const cacheDirectory = FileSystem.cacheDirectory;

      if (!cacheDirectory) {
        throw new Error("The app's cache directory is unavailable.");
      }

      const fileUri = `${cacheDirectory}artistgrid-preview-${Date.now()}.png`;

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setExportedImageUri(fileUri);

      Alert.alert(
        "Export successful",
        "Your drawing reference preview has been exported as a PNG.",
      );
    } catch (error) {
      console.error("Failed to export grid preview:", error);

      Alert.alert(
        "Export failed",
        error instanceof Error
          ? error.message
          : "Something went wrong while exporting the preview.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const [isSavingToGallery, setIsSavingToGallery] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleSaveToGallery = async () => {
    if (!exportedImageUri || isSavingToGallery) {
      return;
    }

    setIsSavingToGallery(true);

    try {
      const permission = await MediaLibrary.requestPermissionsAsync(true, [
        "photo",
      ]);

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Allow photo access to save your drawing reference to the gallery.",
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(exportedImageUri);

      Alert.alert(
        "Saved successfully",
        "Your drawing reference is now in your photo gallery.",
      );
    } catch (error) {
      console.error("Failed to save preview to gallery:", error);

      Alert.alert(
        "Save failed",
        error instanceof Error
          ? error.message
          : "Could not save the image to your gallery.",
      );
    } finally {
      setIsSavingToGallery(false);
    }
  };

  const handleSharePreview = async () => {
    if (!exportedImageUri || isSharing) {
      return;
    }

    setIsSharing(true);

    try {
      const available = await Sharing.isAvailableAsync();

      if (!available) {
        Alert.alert(
          "Sharing unavailable",
          "Sharing is not available on this device or platform.",
        );
        return;
      }

      await Sharing.shareAsync(exportedImageUri, {
        mimeType: "image/png",
        dialogTitle: "Share drawing reference",
        UTI: "public.png",
      });
    } catch (error) {
      console.error("Failed to share preview:", error);

      Alert.alert(
        "Share failed",
        error instanceof Error
          ? error.message
          : "Could not open the sharing menu.",
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grid Preview</Text>

      <Text style={styles.description}>
        Preview your reference image with the calculated drawing grid.
      </Text>

      <View style={styles.canvasContainer} onLayout={handleLayout}>
        {canvasLayout ? (
          <GridCanvas
            image={image}
            surface={surface}
            calculation={calculation}
            imageEffects={imageEffects}
            gridStyling={gridStyling}
          />
        ) : null}
      </View>

      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: "absolute",
          opacity: 0,
          zIndex: -1,
        }}
      >
        <GridCanvas
          image={image}
          surface={surface}
          calculation={calculation}
          imageEffects={imageEffects}
          gridStyling={gridStyling}
          exportSettings={exportSettings}
          onCanvasReady={handleCanvasReady}
        />
      </View>

      <View style={styles.separator} />

      <View style={styles.exportSection}>
        <View style={styles.exportHeader}>
          <View>
            <Text style={styles.title}>Export Settings</Text>
            <Text style={styles.description}>
              Customize your final drawing reference.
            </Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.settingGroup}>
          <Text style={styles.settingTitle}>Content</Text>

          <View style={styles.optionRow}>
            {(
              [
                ["image-grid", "Image + Grid"],
                ["image-only", "Image Only"],
                ["grid-only", "Grid Only"],
              ] as [ExportContent, string][]
            ).map(([value, label]) => {
              const selected = exportSettings.content === value;

              return (
                <Pressable
                  key={value}
                  onPress={() => updateExportSettings({ content: value })}
                  style={[
                    styles.optionButton,
                    selected && styles.optionButtonSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* LABELS */}
        <View style={styles.settingGroup}>
          <Text style={styles.settingTitle}>Grid Labels</Text>

          {(
            [
              ["showRowLabels", "Show row labels"],
              ["showColumnLabels", "Show column labels"],
            ] as ["showRowLabels" | "showColumnLabels", string][]
          ).map(([key, label]) => {
            const selected = exportSettings[key];

            return (
              <Pressable
                key={key}
                onPress={() =>
                  updateExportSettings({ [key]: !exportSettings[key] })
                }
                style={styles.toggleRow}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
              >
                <View
                  style={[styles.checkbox, selected && styles.checkboxSelected]}
                >
                  {selected && <Text style={styles.checkmark}>✓</Text>}
                </View>

                <Text style={styles.optionText}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* BACKGROUND */}
        <View style={styles.settingGroup}>
          <Text style={styles.settingTitle}>Export Background</Text>

          <View style={styles.optionRow}>
            {(
              [
                ["white", "White"],
                ["transparent", "Transparent"],
              ] as [ExportBackground, string][]
            ).map(([value, label]) => {
              const selected = exportSettings.background === value;

              return (
                <Pressable
                  key={value}
                  onPress={() => updateExportSettings({ background: value })}
                  style={[
                    styles.optionButton,
                    selected && styles.optionButtonSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* EXPORT SIZE */}
        <View style={styles.settingGroup}>
          <Text style={styles.settingTitle}>Export Resolution</Text>

          <View style={styles.optionRow}>
            {(
              [
                ["preview", "Preview"],
                ["large", "Large (2×)"],
              ] as [ExportSize, string][]
            ).map(([value, label]) => {
              const selected = exportSettings.size === value;

              return (
                <Pressable
                  key={value}
                  onPress={() => updateExportSettings({ size: value })}
                  style={[
                    styles.optionButton,
                    selected && styles.optionButtonSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* EXPORT ACTION */}
      <Pressable
        onPress={handleExportPreview}
        disabled={!captureCanvas || isExporting}
        accessibilityRole="button"
        accessibilityLabel="Export drawing reference as PNG"
        style={[
          styles.exportButton,
          (!captureCanvas || isExporting) && styles.disabledButton,
        ]}
      >
        {isExporting ? <ActivityIndicator color="#050505" /> : null}

        <Text style={styles.exportButtonText}>
          {isExporting ? "Exporting..." : "Export PNG"}
        </Text>
      </Pressable>

      {/* GALLERY AND SHARE */}
      {exportedImageUri ? (
        <View style={styles.outputActions}>
          <Pressable
            onPress={handleSaveToGallery}
            disabled={isSavingToGallery || isSharing}
            accessibilityRole="button"
            style={[
              styles.galleryButton,
              (isSavingToGallery || isSharing) && styles.disabledButton,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              {isSavingToGallery ? "Saving..." : "Save to Gallery"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSharePreview}
            disabled={isSharing || isSavingToGallery}
            accessibilityRole="button"
            style={[
              styles.shareButton,
              (isSharing || isSavingToGallery) && styles.disabledButton,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              {isSharing ? "Opening Share..." : "Share Preview"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  title: {
    color: PREVIEW_COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  description: {
    color: PREVIEW_COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  canvasContainer: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: PREVIEW_COLORS.background,
  },

  separator: {
    height: 1,
    backgroundColor: PREVIEW_COLORS.border,
    marginVertical: 28,
  },

  exportSection: {
    marginTop: 16,
    gap: 20,
  },

  exportHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingGroup: {
    gap: 12,
  },

  settingTitle: {
    color: EXPORT_COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },

  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  optionButton: {
    minHeight: 42,
    paddingHorizontal: 13,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: EXPORT_COLORS.border,
    backgroundColor: EXPORT_COLORS.elevated,
  },

  optionButtonSelected: {
    borderColor: EXPORT_COLORS.cyan,
    backgroundColor: "#12303A",
  },

  optionText: {
    color: EXPORT_COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: EXPORT_COLORS.cyan,
  },

  toggleRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: EXPORT_COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: EXPORT_COLORS.elevated,
  },

  checkboxSelected: {
    backgroundColor: EXPORT_COLORS.cyan,
    borderColor: EXPORT_COLORS.cyan,
  },

  checkmark: {
    color: "#050505",
    fontSize: 14,
    fontWeight: "900",
  },

  exportButton: {
    marginTop: 20,
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: EXPORT_COLORS.cyan,
  },

  exportButtonText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "800",
  },

  disabledButton: {
    backgroundColor: EXPORT_COLORS.disabled,
    opacity: 0.65,
  },

  outputActions: {
    marginTop: 12,
    gap: 10,
  },

  galleryButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#14532D",
    borderWidth: 1,
    borderColor: "#22C55E",
  },

  shareButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: EXPORT_COLORS.elevated,
    borderWidth: 1,
    borderColor: EXPORT_COLORS.border,
  },

  secondaryButtonText: {
    color: EXPORT_COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
});
