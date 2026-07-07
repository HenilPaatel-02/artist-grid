import { getImageOrientation } from "./image-orientation.utils";

describe("getImageOrientation", () => {
  it("returns portrait when height is greater than width", () => {
    const result = getImageOrientation(1080, 1350);

    expect(result).toBe("portrait");
  });

  it("returns landscape when width is greater than height", () => {
    const result = getImageOrientation(1920, 1080);

    expect(result).toBe("landscape");
  });

  it("returns square when width and height are equal", () => {
    const result = getImageOrientation(1080, 1080);

    expect(result).toBe("square");
  });

  it("throws an error when width is zero", () => {
    expect(() => {
      getImageOrientation(0, 1080);
    }).toThrow("Image dimensions must be greater than zero.");
  });

  it("throws an error when height is zero", () => {
    expect(() => {
      getImageOrientation(1080, 0);
    }).toThrow("Image dimensions must be greater than zero.");
  });

  it("throws an error when width is negative", () => {
    expect(() => {
      getImageOrientation(-100, 1080);
    }).toThrow("Image dimensions must be greater than zero.");
  });

  it("throws an error when height is negative", () => {
    expect(() => {
      getImageOrientation(1080, -100);
    }).toThrow("Image dimensions must be greater than zero.");
  });
});
