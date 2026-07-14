import { DrawingSurface } from "../drawing-surface/drawing-surface.types";

import { calculateGridCanvasLayout } from "./grid-canvas-layout.utils";

const a3Portrait: DrawingSurface = {
  type: "A3",
  orientation: "portrait",
  size: {
    width: 297,
    height: 420,
    unit: "mm",
  },
};

const a3Landscape: DrawingSurface = {
  type: "A3",
  orientation: "landscape",
  size: {
    width: 420,
    height: 297,
    unit: "mm",
  },
};

describe("calculateGridCanvasLayout", () => {
  it("preserves portrait surface aspect ratio", () => {
    const result = calculateGridCanvasLayout(320, a3Portrait);

    expect(result.width).toBe(320);

    expect(result.height).toBeCloseTo(452.525, 3);
  });

  it("preserves landscape surface aspect ratio", () => {
    const result = calculateGridCanvasLayout(320, a3Landscape);

    expect(result.width).toBe(320);

    expect(result.height).toBeCloseTo(226.286, 3);
  });

  it("rejects zero available width", () => {
    expect(() => calculateGridCanvasLayout(0, a3Portrait)).toThrow(
      "Available canvas width must be greater than zero.",
    );
  });
});
