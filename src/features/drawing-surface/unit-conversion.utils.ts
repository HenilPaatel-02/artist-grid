import { MeasurementUnit } from "./drawing-surface.types";

export const convertToMillimetres = (
  value: number,
  unit: MeasurementUnit,
): number => {
  switch (unit) {
    case "mm":
      return value;

    case "cm":
      return value * 10;

    case "inch":
      return value * 25.4;

    case "ft":
      return value * 304.8;
  }
};
