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

import { COLORS } from "@/src/constants/colors";

import { DrawingSurface } from "../../drawing-surface/drawing-surface.types";

import { SelectedImage } from "../../image-picker/image-picker.types";

import { calculateGridCanvasLayout } from "../grid-canvas-layout.utils";

import { GridCanvasStyle } from "../grid-canvas.types";

import { GridCalculation } from "../grid.types";

import { GridCanvas } from "./GridCanvas";

import { GridStyleControls } from "./GridStyleControls";

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

export function GridPreviewSection({
  image,
  surface,
  calculation,
  imageEffects,
  gridStyling,
}: GridPreviewSectionProps) {
  const [availableWidth, setAvailableWidth] = useState(0);

  const [gridStyle, setGridStyle] = useState<GridCanvasStyle>({
    color: "#FFFFFF",
    strokeWidth: 1,
  });

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

      <GridStyleControls value={gridStyle} onChange={setGridStyle} />

      <View style={{ marginTop: 16, gap: 12 }}>
        <Text style={styles.title}>Export Settings</Text>

        <Text style={styles.description}>Content</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(
            [
              ["image-grid", "Image + Grid"],
              ["image-only", "Image Only"],
              ["grid-only", "Grid Only"],
            ] as [ExportContent, string][]
          ).map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => updateExportSettings({ content: value })}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor:
                  exportSettings.content === value ? "#2563EB" : "#E2E8F0",
              }}
            >
              <Text
                style={{
                  color:
                    exportSettings.content === value ? "#FFFFFF" : "#0F172A",
                }}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.description}>Labels</Text>
        {(
          [
            ["showRowLabels", "Show row labels"],
            ["showColumnLabels", "Show column labels"],
          ] as ["showRowLabels" | "showColumnLabels", string][]
        ).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() =>
              updateExportSettings({ [key]: !exportSettings[key] })
            }
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <Text style={{ fontSize: 18 }}>
              {exportSettings[key] ? "☑" : "☐"}
            </Text>
            <Text>{label}</Text>
          </Pressable>
        ))}

        <Text style={styles.description}>Background</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(
            [
              ["white", "White"],
              ["transparent", "Transparent"],
            ] as [ExportBackground, string][]
          ).map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => updateExportSettings({ background: value })}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor:
                  exportSettings.background === value ? "#2563EB" : "#E2E8F0",
              }}
            >
              <Text
                style={{
                  color:
                    exportSettings.background === value ? "#FFFFFF" : "#0F172A",
                }}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.description}>Export Size</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(
            [
              ["preview", "Preview"],
              ["large", "Large (2×)"],
            ] as [ExportSize, string][]
          ).map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => updateExportSettings({ size: value })}
              style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor:
                  exportSettings.size === value ? "#2563EB" : "#E2E8F0",
              }}
            >
              <Text
                style={{
                  color: exportSettings.size === value ? "#FFFFFF" : "#0F172A",
                }}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        onPress={handleExportPreview}
        disabled={!captureCanvas || isExporting}
        accessibilityRole="button"
        style={{
          marginTop: 16,
          paddingVertical: 13,
          paddingHorizontal: 16,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor:
            !captureCanvas || isExporting ? "#94A3B8" : "#2563EB",
        }}
      >
        {isExporting ? <ActivityIndicator color="#FFFFFF" /> : null}

        <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
          {isExporting ? "Exporting..." : "Export Preview"}
        </Text>
      </Pressable>

      {exportedImageUri ? (
        <View style={{ marginTop: 12, gap: 10 }}>
          <Pressable
            onPress={handleSaveToGallery}
            disabled={isSavingToGallery || isSharing}
            accessibilityRole="button"
            style={{
              paddingVertical: 13,
              paddingHorizontal: 16,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                isSavingToGallery || isSharing ? "#94A3B8" : "#15803D",
              opacity: isSavingToGallery || isSharing ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
              {isSavingToGallery ? "Saving..." : "Save to Gallery"}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSharePreview}
            disabled={isSharing || isSavingToGallery}
            accessibilityRole="button"
            style={{
              paddingVertical: 13,
              paddingHorizontal: 16,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                isSharing || isSavingToGallery ? "#94A3B8" : "#475569",
              opacity: isSharing || isSavingToGallery ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
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
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  canvasContainer: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: COLORS.surface,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 28,
  },
});
