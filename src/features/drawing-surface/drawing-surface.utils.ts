import { DrawingSurface, PaperType } from "./drawing-surface.types";
import { PAPER_DIMENSIONS } from "./paper.constants";

export const createDrawingSurface = (
  paper: PaperType,
  orientation: "portrait" | "landscape",
): DrawingSurface => {
  if (paper === "CUSTOM") {
    throw new Error("Custom paper requires manual dimensions.");
  }

  const dimensions = PAPER_DIMENSIONS[paper];

  if (orientation === "portrait") {
    return {
      type: paper,
      orientation,
      size: {
        width: dimensions.width,
        height: dimensions.height,
        unit: "mm",
      },
    };
  }

  return {
    type: paper,
    orientation,
    size: {
      width: dimensions.height,
      height: dimensions.width,
      unit: "mm",
    },
  };
};
