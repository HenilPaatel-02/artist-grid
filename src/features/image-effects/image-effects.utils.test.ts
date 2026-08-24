import { createImageEffectMatrix } from "./image-effects.utils";

import { DEFAULT_IMAGE_EFFECTS } from "./image-effects.types";

describe("createImageEffectMatrix", () => {
  it("returns neutral matrix for defaults", () => {
    const matrix = createImageEffectMatrix(DEFAULT_IMAGE_EFFECTS);

    expect(matrix).toHaveLength(20);

    expect(matrix[0]).toBeCloseTo(1);
    expect(matrix[6]).toBeCloseTo(1);
    expect(matrix[12]).toBeCloseTo(1);
    expect(matrix[18]).toBeCloseTo(1);
  });

  it("changes brightness", () => {
    const matrix = createImageEffectMatrix({
      ...DEFAULT_IMAGE_EFFECTS,
      brightness: 50,
    });

    expect(matrix[4]).toBeGreaterThan(0);
  });

  it("changes contrast", () => {
    const matrix = createImageEffectMatrix({
      ...DEFAULT_IMAGE_EFFECTS,
      contrast: 150,
    });

    expect(matrix[0]).toBeGreaterThan(1);
  });

  it("changes saturation", () => {
    const matrix = createImageEffectMatrix({
      ...DEFAULT_IMAGE_EFFECTS,
      saturation: 150,
    });

    expect(matrix[0]).not.toBe(1);
  });

  it("supports grayscale", () => {
    const matrix = createImageEffectMatrix({
      ...DEFAULT_IMAGE_EFFECTS,
      grayscale: 100,
    });

    expect(matrix[0]).toBeCloseTo(0.2126);

    expect(matrix[1]).toBeCloseTo(0.7152);

    expect(matrix[2]).toBeCloseTo(0.0722);
  });

  it("supports opacity", () => {
    const matrix = createImageEffectMatrix({
      ...DEFAULT_IMAGE_EFFECTS,
      opacity: 50,
    });

    expect(matrix[18]).toBeCloseTo(0.5);
  });

  it("clamps values", () => {
    const matrix = createImageEffectMatrix({
      brightness: 999,
      contrast: 999,
      saturation: 999,
      grayscale: 999,
      opacity: 999,
    });

    expect(matrix).toHaveLength(20);
    expect(matrix[18]).toBeCloseTo(1);
  });
});
