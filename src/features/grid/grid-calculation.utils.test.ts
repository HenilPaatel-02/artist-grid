import { DrawingSurface } from "../drawing-surface/drawing-surface.types";

import { calculateGrid } from "./grid-calculation.utils";

const a3Portrait: DrawingSurface = {
  type: "A3",
  orientation: "portrait",
  size: {
    width: 297,
    height: 420,
    unit: "mm",
  },
};

describe("calculateGrid", () => {
  describe("rows-columns mode", () => {
    it("calculates an 8 by 10 grid", () => {
      const result = calculateGrid(a3Portrait, {
        mode: "rows-columns",
        rows: 10,
        columns: 8,
      });

      expect(result.rows).toBe(10);
      expect(result.columns).toBe(8);

      expect(result.cellWidth).toBeCloseTo(37.125);

      expect(result.cellHeight).toBe(42);
    });

    it("uses the complete drawing surface", () => {
      const result = calculateGrid(a3Portrait, {
        mode: "rows-columns",
        rows: 10,
        columns: 8,
      });

      expect(result.gridWidth).toBe(297);
      expect(result.gridHeight).toBe(420);

      expect(result.remainder.width).toBe(0);
      expect(result.remainder.height).toBe(0);
    });
  });

  describe("cell-size mode", () => {
    it("calculates square cells from an exact cell size", () => {
      const result = calculateGrid(a3Portrait, {
        mode: "cell-size",
        cellSizeMm: 50,
      });

      expect(result.columns).toBe(5);
      expect(result.rows).toBe(8);

      expect(result.cellWidth).toBe(50);
      expect(result.cellHeight).toBe(50);
    });

    it("calculates grid dimensions", () => {
      const result = calculateGrid(a3Portrait, {
        mode: "cell-size",
        cellSizeMm: 50,
      });

      expect(result.gridWidth).toBe(250);
      expect(result.gridHeight).toBe(400);
    });

    it("calculates unused surface remainder", () => {
      const result = calculateGrid(a3Portrait, {
        mode: "cell-size",
        cellSizeMm: 50,
      });

      expect(result.remainder.width).toBe(47);
      expect(result.remainder.height).toBe(20);
    });

    it("rejects a cell size larger than the surface", () => {
      expect(() =>
        calculateGrid(a3Portrait, {
          mode: "cell-size",
          cellSizeMm: 500,
        }),
      ).toThrow("Grid cell size is larger than the drawing surface.");
    });
  });

  describe("fit mode", () => {
    it("reports that fit mode is not implemented", () => {
      expect(() =>
        calculateGrid(a3Portrait, {
          mode: "fit",
          targetCells: 10,
        }),
      ).toThrow("Fit grid mode is not implemented yet.");
    });
  });
});
