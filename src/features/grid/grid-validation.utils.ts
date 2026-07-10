import { GRID_LIMITS } from "./grid.constants";
import { GridSettings } from "./grid.types";

export const validateGridSettings = (settings: GridSettings): void => {
  switch (settings.mode) {
    case "rows-columns":
      validateRowsColumns(settings.rows, settings.columns);

      return;

    case "cell-size":
      validateCellSize(settings.cellSizeMm);

      return;

    case "fit":
      validateTargetCells(settings.targetCells);

      return;
  }
};

const validateRowsColumns = (rows: number, columns: number): void => {
  if (!Number.isInteger(rows)) {
    throw new Error("Grid rows must be a whole number.");
  }

  if (!Number.isInteger(columns)) {
    throw new Error("Grid columns must be a whole number.");
  }

  if (rows < GRID_LIMITS.MIN_ROWS || rows > GRID_LIMITS.MAX_ROWS) {
    throw new Error(
      `Grid rows must be between ${GRID_LIMITS.MIN_ROWS} and ${GRID_LIMITS.MAX_ROWS}.`,
    );
  }

  if (columns < GRID_LIMITS.MIN_COLUMNS || columns > GRID_LIMITS.MAX_COLUMNS) {
    throw new Error(
      `Grid columns must be between ${GRID_LIMITS.MIN_COLUMNS} and ${GRID_LIMITS.MAX_COLUMNS}.`,
    );
  }
};

const validateCellSize = (cellSizeMm: number): void => {
  if (!Number.isFinite(cellSizeMm)) {
    throw new Error("Grid cell size must be a finite number.");
  }

  if (cellSizeMm < GRID_LIMITS.MIN_CELL_SIZE_MM) {
    throw new Error(
      `Grid cell size must be at least ${GRID_LIMITS.MIN_CELL_SIZE_MM} mm.`,
    );
  }
};

const validateTargetCells = (targetCells: number): void => {
  if (!Number.isInteger(targetCells)) {
    throw new Error("Target cells must be a whole number.");
  }

  if (
    targetCells < GRID_LIMITS.MIN_TARGET_CELLS ||
    targetCells > GRID_LIMITS.MAX_TARGET_CELLS
  ) {
    throw new Error(
      `Target cells must be between ${GRID_LIMITS.MIN_TARGET_CELLS} and ${GRID_LIMITS.MAX_TARGET_CELLS}.`,
    );
  }
};
