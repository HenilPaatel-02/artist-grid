import {
  Canvas,
  ColorMatrix,
  Line,
  Skia,
  Image as SkiaImage,
  Text as SkiaText,
  useImage,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import type { DrawingSurface } from "@/src/features/drawing-surface/drawing-surface.types";
import type { ImageEffects } from "@/src/features/image-effects/image-effects.types";
import { createImageEffectMatrix } from "@/src/features/image-effects/image-effects.utils";
import type { SelectedImage } from "@/src/features/image-picker/image-picker.types";

import type { GridCalculation } from "@/src/features/grid/grid.types";
import type { GridStyling } from "../grid-styling.types";

type GridCanvasProps = {
  image: SelectedImage;
  surface: DrawingSurface;
  calculation: GridCalculation;
  imageEffects: ImageEffects;
  gridStyling: GridStyling;
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function GridCanvas({
  image,
  surface,
  calculation,
  imageEffects,
  gridStyling,
}: GridCanvasProps) {
  const { width: screenWidth } = useWindowDimensions();

  /*
   * ==================================================
   * IMAGE
   * ==================================================
   */

  const skiaImage = useImage(image.uri);

  /*
   * ==================================================
   * IMAGE EFFECTS
   * ==================================================
   */

  const imageEffectMatrix = useMemo(
    () => createImageEffectMatrix(imageEffects),
    [imageEffects],
  );

  /*
   * ==================================================
   * SYSTEM FONT
   * ==================================================
   */

  const labelFont = useMemo(() => {
    if (!gridStyling.showRowLabels && !gridStyling.showColumnLabels) {
      return null;
    }

    const fontMgr = Skia.FontMgr.System();

    const typeface = fontMgr.matchFamilyStyle("sans-serif", {
      weight: 400,
      width: 5,
      slant: 0,
    });

    if (!typeface) {
      return null;
    }

    return Skia.Font(typeface, gridStyling.labelSize);
  }, [
    gridStyling.labelSize,
    gridStyling.showRowLabels,
    gridStyling.showColumnLabels,
  ]);

  /*
   * ==================================================
   * CANVAS SIZE
   * ==================================================
   */

  const canvasWidth = Math.max(screenWidth - 40, 280);

  const surfaceWidth = Number(surface.size.width) || 1;

  const surfaceHeight = Number(surface.size.height) || 1;

  const surfaceAspectRatio = surfaceWidth / surfaceHeight;

  const canvasHeight = canvasWidth / surfaceAspectRatio;

  /*
   * ==================================================
   * GRID
   * ==================================================
   */

  const rawColumns =
    (calculation as any).columns ?? (calculation as any).columnCount;

  const rawRows = (calculation as any).rows ?? (calculation as any).rowCount;

  const columns = Math.max(1, Math.round(Number(rawColumns) || 1));

  const rows = Math.max(1, Math.round(Number(rawRows) || 1));

  /*
   * ==================================================
   * LABEL SPACE
   * ==================================================
   */

  const largestRowLabel = String(rows);

  const rowLabelWidth = labelFont
    ? labelFont.measureText(largestRowLabel).width
    : gridStyling.labelSize;

  const labelSpace = Math.max(
    rowLabelWidth + 16,
    gridStyling.labelSize + 16,
    28,
  );
  /*
   * ==================================================
   * DRAWING RECT
   * ==================================================
   *
   * The Canvas keeps its full size.
   *
   * The actual drawing/grid area starts after
   * the label space.
   */

  const drawingRect: Rect = {
    x: gridStyling.showRowLabels ? labelSpace : 0,
    y: gridStyling.showColumnLabels ? labelSpace : 0,

    width: canvasWidth - (gridStyling.showRowLabels ? labelSpace : 0),

    height: canvasHeight - (gridStyling.showColumnLabels ? labelSpace : 0),
  };

  const cellWidth = drawingRect.width / columns;
  const cellHeight = drawingRect.height / rows;

  /*
   * ==================================================
   * IMAGE PLACEMENT
   * ==================================================
   */

  const imageRect = calculateContainRect(
    image.width,
    image.height,
    drawingRect,
  );

  /*
   * ==================================================
   * GRID
   * ==================================================
   *
   * FIX: `calculation.rows` was resolving to
   * `undefined` (the actual field on
   * `GridCalculation` uses a different name, e.g.
   * `rowCount`), so `Math.round(undefined)` was
   * `NaN`, `Array.from({ length: NaN })` produced an
   * empty array, and row labels silently never
   * rendered while column labels (whose field name
   * matched) rendered fine.
   *
   * This reads whichever field actually exists so it
   * works regardless of the real shape of
   * `GridCalculation`.
   */

  // const rawColumns =
  //   (calculation as any).columns ?? (calculation as any).columnCount;

  // const rawRows = (calculation as any).rows ?? (calculation as any).rowCount;

  // const columns = Math.max(1, Math.round(Number(rawColumns) || 1));

  // const rows = Math.max(1, Math.round(Number(rawRows) || 1));

  // const cellWidth = drawingRect.width / columns;

  // const cellHeight = drawingRect.height / rows;

  /*
   * ==================================================
   * COLORS
   * ==================================================
   */

  const gridColor = colorWithOpacity(
    gridStyling.gridColor,
    gridStyling.gridOpacity,
  );

  const labelColor = colorWithOpacity(gridStyling.labelColor, 100);

  /*
   * ==================================================
   * IMAGE LOADING
   * ==================================================
   */

  if (!skiaImage) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            width: canvasWidth,
            height: canvasHeight,
          },
        ]}
      >
        <Text style={styles.loadingText}>Loading preview...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.canvasContainer,
          {
            width: canvasWidth,
            height: canvasHeight,
          },
        ]}
      >
        <Canvas
          style={{
            width: canvasWidth,
            height: canvasHeight,
          }}
        >
          {/* ========================================
              IMAGE
              ======================================== */}

          <SkiaImage
            image={skiaImage}
            x={imageRect.x}
            y={imageRect.y}
            width={imageRect.width}
            height={imageRect.height}
            fit="contain"
          >
            <ColorMatrix matrix={imageEffectMatrix} />
          </SkiaImage>

          {/* ========================================
              GRID
              ======================================== */}

          {gridStyling.showGrid ? (
            <>
              {/* Vertical */}

              {Array.from({
                length: columns + 1,
              }).map((_, index) => {
                const x = drawingRect.x + index * cellWidth;

                return (
                  <Line
                    key={`vertical-${index}`}
                    p1={vec(x, drawingRect.y)}
                    p2={vec(x, drawingRect.y + drawingRect.height)}
                    color={gridColor}
                    strokeWidth={gridStyling.gridStrokeWidth}
                  />
                );
              })}

              {/* Horizontal */}

              {Array.from({
                length: rows + 1,
              }).map((_, index) => {
                const y = drawingRect.y + index * cellHeight;

                return (
                  <Line
                    key={`horizontal-${index}`}
                    p1={vec(drawingRect.x, y)}
                    p2={vec(drawingRect.x + drawingRect.width, y)}
                    color={gridColor}
                    strokeWidth={gridStyling.gridStrokeWidth}
                  />
                );
              })}
            </>
          ) : null}

          {/* ========================================
              COLUMN LABELS
              A B C D ...
              ======================================== */}

          {gridStyling.showColumnLabels && labelFont
            ? Array.from({
                length: columns,
              }).map((_, index) => {
                const label = getColumnLabel(index);

                const centerX =
                  drawingRect.x + index * cellWidth + cellWidth / 2;

                const textWidth = labelFont.measureText(label).width;

                return (
                  <SkiaText
                    key={`column-${index}`}
                    x={centerX - textWidth / 2}
                    y={labelSpace - 8}
                    text={label}
                    font={labelFont}
                    color={labelColor}
                  />
                );
              })
            : null}

          {/* ========================================
              ROW LABELS
              1 2 3 4 ...
              ======================================== */}

          {gridStyling.showRowLabels && labelFont
            ? Array.from({
                length: rows,
              }).map((_, index) => {
                const label = String(index + 1);

                const centerY =
                  drawingRect.y + index * cellHeight + cellHeight / 2;

                const textWidth = labelFont.measureText(label).width;

                // Center the label inside the reserved
                // left-side label area.
                const x = Math.max(2, (labelSpace - textWidth) / 2);

                return (
                  <SkiaText
                    key={`row-${index}`}
                    x={x}
                    y={centerY + gridStyling.labelSize / 3}
                    text={label}
                    font={labelFont}
                    color={labelColor}
                  />
                );
              })
            : null}
        </Canvas>
      </View>

      <Text style={styles.info}>
        {columns} × {rows} grid
      </Text>
    </View>
  );
}

/*
 * ==================================================
 * IMAGE CONTAIN
 * ==================================================
 */

function calculateContainRect(
  imageWidth: number,
  imageHeight: number,
  container: Rect,
): Rect {
  if (
    imageWidth <= 0 ||
    imageHeight <= 0 ||
    container.width <= 0 ||
    container.height <= 0
  ) {
    return container;
  }

  const imageRatio = imageWidth / imageHeight;

  const containerRatio = container.width / container.height;

  let width: number;
  let height: number;

  if (imageRatio > containerRatio) {
    width = container.width;

    height = width / imageRatio;
  } else {
    height = container.height;

    width = height * imageRatio;
  }

  return {
    width,
    height,

    x: container.x + (container.width - width) / 2,

    y: container.y + (container.height - height) / 2,
  };
}

/*
 * ==================================================
 * COLUMN LABEL
 * ==================================================
 */

function getColumnLabel(index: number): string {
  let result = "";
  let value = index + 1;

  while (value > 0) {
    const remainder = (value - 1) % 26;

    result = String.fromCharCode(65 + remainder) + result;

    value = Math.floor((value - 1) / 26);
  }

  return result;
}

/*
 * ==================================================
 * COLOR + OPACITY
 * ==================================================
 */

function colorWithOpacity(color: string, opacity: number): string {
  const normalized = color.replace("#", "");

  let hex = normalized;

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((character) => character + character)
      .join("");
  }

  if (hex.length !== 6) {
    hex = "000000";
  }

  const alpha = Math.round((Math.min(Math.max(opacity, 0), 100) / 100) * 255);

  const alphaHex = alpha.toString(16).padStart(2, "0");

  return `#${hex}${alphaHex}`;
}

/*
 * ==================================================
 * STYLES
 * ==================================================
 */

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },

  canvasContainer: {
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },

  loadingText: {
    fontSize: 14,
    color: "#6B7280",
  },

  info: {
    marginTop: 10,
    fontSize: 13,
    color: "#6B7280",
  },
});
