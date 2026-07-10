import { validateGridSettings } from "./grid-validation.utils";

describe("validateGridSettings", () => {
  describe("rows-columns mode", () => {
    it("accepts valid rows and columns", () => {
      expect(() =>
        validateGridSettings({
          mode: "rows-columns",
          rows: 10,
          columns: 8,
        }),
      ).not.toThrow();
    });

    it("rejects decimal rows", () => {
      expect(() =>
        validateGridSettings({
          mode: "rows-columns",
          rows: 10.5,
          columns: 8,
        }),
      ).toThrow("Grid rows must be a whole number.");
    });

    it("rejects decimal columns", () => {
      expect(() =>
        validateGridSettings({
          mode: "rows-columns",
          rows: 10,
          columns: 8.5,
        }),
      ).toThrow("Grid columns must be a whole number.");
    });

    it("rejects zero rows", () => {
      expect(() =>
        validateGridSettings({
          mode: "rows-columns",
          rows: 0,
          columns: 8,
        }),
      ).toThrow();
    });

    it("rejects zero columns", () => {
      expect(() =>
        validateGridSettings({
          mode: "rows-columns",
          rows: 10,
          columns: 0,
        }),
      ).toThrow();
    });

    it("rejects rows above the maximum", () => {
      expect(() =>
        validateGridSettings({
          mode: "rows-columns",
          rows: 101,
          columns: 8,
        }),
      ).toThrow();
    });
  });

  describe("cell-size mode", () => {
    it("accepts a decimal cell size", () => {
      expect(() =>
        validateGridSettings({
          mode: "cell-size",
          cellSizeMm: 12.5,
        }),
      ).not.toThrow();
    });

    it("rejects zero cell size", () => {
      expect(() =>
        validateGridSettings({
          mode: "cell-size",
          cellSizeMm: 0,
        }),
      ).toThrow();
    });

    it("rejects Infinity", () => {
      expect(() =>
        validateGridSettings({
          mode: "cell-size",
          cellSizeMm: Infinity,
        }),
      ).toThrow("Grid cell size must be a finite number.");
    });

    it("rejects NaN", () => {
      expect(() =>
        validateGridSettings({
          mode: "cell-size",
          cellSizeMm: Number.NaN,
        }),
      ).toThrow("Grid cell size must be a finite number.");
    });
  });
});
