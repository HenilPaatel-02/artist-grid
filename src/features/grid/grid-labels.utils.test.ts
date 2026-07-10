import { getColumnLabel, getGridCellLabel } from "./grid-labels.utils";

describe("getColumnLabel", () => {
  it("returns A for column zero", () => {
    expect(getColumnLabel(0)).toBe("A");
  });

  it("returns B for column one", () => {
    expect(getColumnLabel(1)).toBe("B");
  });

  it("returns Z for column twenty-five", () => {
    expect(getColumnLabel(25)).toBe("Z");
  });

  it("returns AA for column twenty-six", () => {
    expect(getColumnLabel(26)).toBe("AA");
  });

  it("returns AB for column twenty-seven", () => {
    expect(getColumnLabel(27)).toBe("AB");
  });

  it("rejects a negative column", () => {
    expect(() => getColumnLabel(-1)).toThrow(
      "Grid column index must be a non-negative whole number.",
    );
  });
});

describe("getGridCellLabel", () => {
  it("returns A1 for the first cell", () => {
    expect(getGridCellLabel(0, 0)).toBe("A1");
  });

  it("returns B3 for column one row two", () => {
    expect(getGridCellLabel(1, 2)).toBe("B3");
  });

  it("returns AA10 for a large grid", () => {
    expect(getGridCellLabel(26, 9)).toBe("AA10");
  });

  it("rejects a negative row", () => {
    expect(() => getGridCellLabel(0, -1)).toThrow(
      "Grid row index must be a non-negative whole number.",
    );
  });
});
