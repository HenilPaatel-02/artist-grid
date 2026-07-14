import { DrawingSurface } from "../drawing-surface/drawing-surface.types";

import { GridCanvasLayout } from "./grid-canvas.types";

export const calculateGridCanvasLayout = (
  availableWidth: number,
  surface: DrawingSurface,
): GridCanvasLayout => {
  if (availableWidth <= 0) {
    throw new Error("Available canvas width must be greater than zero.");
  }

  const surfaceWidth = surface.size.width;
  const surfaceHeight = surface.size.height;

  if (surfaceWidth <= 0 || surfaceHeight <= 0) {
    throw new Error("Drawing surface dimensions must be greater than zero.");
  }

  const aspectRatio = surfaceHeight / surfaceWidth;

  return {
    width: availableWidth,
    height: availableWidth * aspectRatio,
  };
};
