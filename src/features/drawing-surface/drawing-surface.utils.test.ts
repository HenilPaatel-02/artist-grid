import { createDrawingSurface } from "./drawing-surface.utils";

describe("createDrawingSurface", () => {
  it("creates portrait A4", () => {
    const paper = createDrawingSurface("A4", "portrait");

    expect(paper.size.width).toBe(210);
    expect(paper.size.height).toBe(297);
  });

  it("creates landscape A4", () => {
    const paper = createDrawingSurface("A4", "landscape");

    expect(paper.size.width).toBe(297);
    expect(paper.size.height).toBe(210);
  });

  it("throws for custom paper", () => {
    expect(() => createDrawingSurface("CUSTOM", "portrait")).toThrow();
  });
});
