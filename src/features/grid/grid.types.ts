export type GridMode = "rows-columns" | "cell-size" | "fit";

export type GridAxis = "horizontal" | "vertical";

export type GridPoint = {
  x: number;
  y: number;
};

export type GridLine = {
  axis: GridAxis;
  start: GridPoint;
  end: GridPoint;
};

export type RowsColumnsGridSettings = {
  mode: "rows-columns";
  rows: number;
  columns: number;
};

export type CellSizeGridSettings = {
  mode: "cell-size";
  cellSizeMm: number;
};

export type FitGridSettings = {
  mode: "fit";
  targetCells: number;
};

export type GridSettings =
  | RowsColumnsGridSettings
  | CellSizeGridSettings
  | FitGridSettings;

export type GridRemainder = {
  width: number;
  height: number;
};

export type GridCalculation = {
  rows: number;
  columns: number;

  cellWidth: number;
  cellHeight: number;

  surfaceWidth: number;
  surfaceHeight: number;

  gridWidth: number;
  gridHeight: number;

  remainder: GridRemainder;
};
