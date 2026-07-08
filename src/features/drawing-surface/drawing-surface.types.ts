export type MeasurementUnit = "mm" | "cm" | "inch" | "ft";

export type PaperType = "A5" | "A4" | "A3" | "A2" | "A1" | "CUSTOM";

export type SurfaceOrientation = "portrait" | "landscape";

export type PaperSize = {
  width: number;
  height: number;
  unit: MeasurementUnit;
};

export type DrawingSurface = {
  type: PaperType;
  orientation: SurfaceOrientation;
  size: PaperSize;
};
