import { DEFAULT_GRID_STYLING, GridStyling } from "./grid-styling.types";

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const normalizeGridStyling = (styling: GridStyling): GridStyling => {
  return {
    showGrid: styling.showGrid,

    gridColor: styling.gridColor || DEFAULT_GRID_STYLING.gridColor,

    gridOpacity: clamp(styling.gridOpacity, 0, 100),

    gridStrokeWidth: clamp(styling.gridStrokeWidth, 0.5, 5),

    showRowLabels: styling.showRowLabels,

    showColumnLabels: styling.showColumnLabels,

    labelColor: styling.labelColor || DEFAULT_GRID_STYLING.labelColor,

    labelSize: clamp(styling.labelSize, 8, 24),
  };
};

export const isDefaultGridStyling = (styling: GridStyling): boolean => {
  return (
    styling.showGrid === DEFAULT_GRID_STYLING.showGrid &&
    styling.gridColor === DEFAULT_GRID_STYLING.gridColor &&
    styling.gridOpacity === DEFAULT_GRID_STYLING.gridOpacity &&
    styling.gridStrokeWidth === DEFAULT_GRID_STYLING.gridStrokeWidth &&
    styling.showRowLabels === DEFAULT_GRID_STYLING.showRowLabels &&
    styling.showColumnLabels === DEFAULT_GRID_STYLING.showColumnLabels &&
    styling.labelColor === DEFAULT_GRID_STYLING.labelColor &&
    styling.labelSize === DEFAULT_GRID_STYLING.labelSize
  );
};
