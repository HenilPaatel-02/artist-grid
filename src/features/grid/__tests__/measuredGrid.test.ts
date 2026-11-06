import type { DrawingSurface } from "../../drawing-surface/drawing-surface.types";
import { calculateGrid } from "../grid-calculation.utils";

const A4_PORTRAIT: DrawingSurface = {
  type: "A4",
  orientation: "portrait",
  size: {
    width: 210,
    height: 297,
    unit: "mm",
  },
};

describe("Measured Grid calculations", () => {
  it("calculates an A4 grid with 25 mm square cells", () => {
    const result = calculateGrid(A4_PORTRAIT, {
      mode: "cell-size",
      cellSizeMm: 25,
    });

    expect(result.columns).toBe(8);
    expect(result.rows).toBe(11);

    expect(result.cellWidth).toBe(25);
    expect(result.cellHeight).toBe(25);

    expect(result.gridWidth).toBe(200);
    expect(result.gridHeight).toBe(275);

    expect(result.marginLeftMm).toBe(5);
    expect(result.marginRightMm).toBe(5);
    expect(result.marginTopMm).toBe(11);
    expect(result.marginBottomMm).toBe(11);
  });

  it("calculates an A4 landscape grid", () => {
    const surface: DrawingSurface = {
      ...A4_PORTRAIT,
      orientation: "landscape",
      size: {
        width: 297,
        height: 210,
        unit: "mm",
      },
    };

    const result = calculateGrid(surface, {
      mode: "cell-size",
      cellSizeMm: 25,
    });

    expect(result.columns).toBe(11);
    expect(result.rows).toBe(8);
  });

  it("rejects cells larger than the paper", () => {
    expect(() =>
      calculateGrid(A4_PORTRAIT, {
        mode: "cell-size",
        cellSizeMm: 500,
      }),
    ).toThrow();
  });
});
