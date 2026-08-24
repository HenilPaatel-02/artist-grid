import { CanvasSize, ScaledGridLine } from "./grid-canvas.types";
import { GridCalculation, GridLine } from "./grid.types";

export const scaleGridCoordinate = (
  value: number,
  physicalSize: number,
  canvasSize: number,
): number => {
  if (physicalSize <= 0) {
    throw new Error("Physical size must be greater than zero.");
  }

  if (canvasSize <= 0) {
    throw new Error("Canvas size must be greater than zero.");
  }

  return value * (canvasSize / physicalSize);
};

export const scaleGridLines = (
  lines: GridLine[],
  calculation: GridCalculation,
  canvas: CanvasSize,
): ScaledGridLine[] => {
  return lines.map((line) => ({
    axis: line.axis,

    start: {
      x: scaleGridCoordinate(line.start.x, calculation.gridWidth, canvas.width),

      y: scaleGridCoordinate(
        line.start.y,
        calculation.gridHeight,
        canvas.height,
      ),
    },

    end: {
      x: scaleGridCoordinate(line.end.x, calculation.gridWidth, canvas.width),

      y: scaleGridCoordinate(line.end.y, calculation.gridHeight, canvas.height),
    },
  }));
};
