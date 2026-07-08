import { convertToMillimetres } from "./unit-conversion.utils";

describe("convertToMillimetres", () => {
  it("converts cm", () => {
    expect(convertToMillimetres(10, "cm")).toBe(100);
  });

  it("converts inches", () => {
    expect(convertToMillimetres(1, "inch")).toBe(25.4);
  });

  it("converts feet", () => {
    expect(convertToMillimetres(1, "ft")).toBe(304.8);
  });
});
