import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import {
  Canvas,
  Line,
  Image as SkiaImage,
  useImage,
  vec,
} from "@shopify/react-native-skia";

import { COLORS } from "@/src/constants/colors";

import { SelectedImage } from "../../image-picker/image-picker.types";

import { GridCanvasStyle } from "../grid-canvas.types";

import { scaleGridLines } from "../grid-coordinate-scaling.utils";

import { generateGridLines } from "../grid-lines.utils";

import { GridCalculation } from "../grid.types";

type GridCanvasProps = {
  image: SelectedImage;
  calculation: GridCalculation;

  width: number;
  height: number;

  gridStyle: GridCanvasStyle;
};

export function GridCanvas({
  image,
  calculation,
  width,
  height,
  gridStyle,
}: GridCanvasProps) {
  const skiaImage = useImage(image.uri);

  const gridLines = useMemo(() => {
    const physicalLines = generateGridLines(calculation);

    return scaleGridLines(physicalLines, calculation, {
      width,
      height,
    });
  }, [calculation, width, height]);

  if (!skiaImage) {
    return (
      <View
        style={[
          styles.loading,
          {
            width,
            height,
          },
        ]}
      />
    );
  }

  return (
    <Canvas
      style={{
        width,
        height,
      }}
    >
      <SkiaImage
        image={skiaImage}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="fill"
      />

      {gridLines.map((line, index) => (
        <Line
          key={`${line.axis}-${index}`}
          p1={vec(line.start.x, line.start.y)}
          p2={vec(line.end.x, line.end.y)}
          color={gridStyle.color}
          strokeWidth={gridStyle.strokeWidth}
          style="stroke"
        />
      ))}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  loading: {
    backgroundColor: COLORS.surface,
  },
});
