import {
  isDefaultGridStyling,
  normalizeGridStyling,
} from "./grid-styling.utils";

import { DEFAULT_GRID_STYLING } from "./grid-styling.types";

describe("grid styling utils", () => {
  it("uses default styling", () => {
    expect(isDefaultGridStyling(DEFAULT_GRID_STYLING)).toBe(true);
  });

  it("detects modified styling", () => {
    expect(
      isDefaultGridStyling({
        ...DEFAULT_GRID_STYLING,
        gridOpacity: 50,
      }),
    ).toBe(false);
  });

  it("clamps grid opacity", () => {
    const result = normalizeGridStyling({
      ...DEFAULT_GRID_STYLING,
      gridOpacity: 200,
    });

    expect(result.gridOpacity).toBe(100);
  });

  it("clamps stroke width", () => {
    const result = normalizeGridStyling({
      ...DEFAULT_GRID_STYLING,
      gridStrokeWidth: 20,
    });

    expect(result.gridStrokeWidth).toBe(5);
  });

  it("clamps label size", () => {
    const result = normalizeGridStyling({
      ...DEFAULT_GRID_STYLING,
      labelSize: 50,
    });

    expect(result.labelSize).toBe(24);
  });

  it("preserves visibility settings", () => {
    const result = normalizeGridStyling({
      ...DEFAULT_GRID_STYLING,
      showGrid: false,
      showRowLabels: false,
      showColumnLabels: false,
    });

    expect(result.showGrid).toBe(false);
    expect(result.showRowLabels).toBe(false);
    expect(result.showColumnLabels).toBe(false);
  });
});
