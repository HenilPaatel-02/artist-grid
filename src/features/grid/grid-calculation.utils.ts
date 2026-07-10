import { DrawingSurface } from "../drawing-surface/drawing-surface.types";

import { GridCalculation, GridSettings } from "./grid.types";

import { validateGridSettings } from "./grid-validation.utils";

export const calculateGrid = (
  surface: DrawingSurface,
  settings: GridSettings,
): GridCalculation => {
  validateSurface(surface);
  validateGridSettings(settings);

  switch (settings.mode) {
    case "rows-columns":
      return calculateRowsColumnsGrid(surface, settings.rows, settings.columns);

    case "cell-size":
      return calculateCellSizeGrid(surface, settings.cellSizeMm);

    case "fit":
      throw new Error("Fit grid mode is not implemented yet.");
  }
};

const calculateRowsColumnsGrid = (
  surface: DrawingSurface,
  rows: number,
  columns: number,
): GridCalculation => {
  const surfaceWidth = surface.size.width;
  const surfaceHeight = surface.size.height;

  const cellWidth = surfaceWidth / columns;
  const cellHeight = surfaceHeight / rows;

  return {
    rows,
    columns,

    cellWidth,
    cellHeight,

    surfaceWidth,
    surfaceHeight,

    gridWidth: surfaceWidth,
    gridHeight: surfaceHeight,

    remainder: {
      width: 0,
      height: 0,
    },
  };
};

const calculateCellSizeGrid = (
  surface: DrawingSurface,
  cellSizeMm: number,
): GridCalculation => {
  const surfaceWidth = surface.size.width;
  const surfaceHeight = surface.size.height;

  const columns = Math.floor(surfaceWidth / cellSizeMm);

  const rows = Math.floor(surfaceHeight / cellSizeMm);

  if (columns < 1 || rows < 1) {
    throw new Error("Grid cell size is larger than the drawing surface.");
  }

  const gridWidth = columns * cellSizeMm;
  const gridHeight = rows * cellSizeMm;

  return {
    rows,
    columns,

    cellWidth: cellSizeMm,
    cellHeight: cellSizeMm,

    surfaceWidth,
    surfaceHeight,

    gridWidth,
    gridHeight,

    remainder: {
      width: surfaceWidth - gridWidth,
      height: surfaceHeight - gridHeight,
    },
  };
};

const validateSurface = (surface: DrawingSurface): void => {
  if (surface.size.width <= 0 || surface.size.height <= 0) {
    throw new Error("Drawing surface dimensions must be greater than zero.");
  }

  if (surface.size.unit !== "mm") {
    throw new Error("Grid calculation requires millimetre dimensions.");
  }
};
