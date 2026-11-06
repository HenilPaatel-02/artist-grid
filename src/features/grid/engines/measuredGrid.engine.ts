import type { MeasuredGridResult } from "../grid.types";

export type CalculateMeasuredGridInput = {
  paperWidthMm: number;
  paperHeightMm: number;
  cellSizeMm: number;
};

export function calculateMeasuredGrid({
  paperWidthMm,
  paperHeightMm,
  cellSizeMm,
}: CalculateMeasuredGridInput): MeasuredGridResult {
  if (
    !Number.isFinite(paperWidthMm) ||
    !Number.isFinite(paperHeightMm) ||
    !Number.isFinite(cellSizeMm) ||
    paperWidthMm <= 0 ||
    paperHeightMm <= 0 ||
    cellSizeMm <= 0
  ) {
    throw new Error("Paper dimensions and cell size must be positive numbers.");
  }

  const columns = Math.floor(paperWidthMm / cellSizeMm);
  const rows = Math.floor(paperHeightMm / cellSizeMm);

  if (columns < 1 || rows < 1) {
    throw new Error("Cell size is too large for the selected paper.");
  }

  const gridWidthMm = columns * cellSizeMm;
  const gridHeightMm = rows * cellSizeMm;

  const horizontalMargin = (paperWidthMm - gridWidthMm) / 2;
  const verticalMargin = (paperHeightMm - gridHeightMm) / 2;

  return {
    cellSizeMm,
    rows,
    columns,
    gridWidthMm,
    gridHeightMm,
    marginLeftMm: horizontalMargin,
    marginRightMm: horizontalMargin,
    marginTopMm: verticalMargin,
    marginBottomMm: verticalMargin,
  };
}
