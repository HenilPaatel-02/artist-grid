export type GridStyling = {
  showGrid: boolean;

  gridColor: string;
  gridOpacity: number;
  gridStrokeWidth: number;

  showRowLabels: boolean;
  showColumnLabels: boolean;

  labelColor: string;
  labelSize: number;
};

export const DEFAULT_GRID_STYLING: GridStyling = {
  showGrid: true,

  gridColor: "#000000",
  gridOpacity: 70,
  gridStrokeWidth: 1,

  showRowLabels: true,
  showColumnLabels: true,

  labelColor: "#000000",
  labelSize: 10,
};
