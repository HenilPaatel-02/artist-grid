import { generateGridLines } from "./grid-lines.utils";
import { GridCalculation } from "./grid.types";

const calculation: GridCalculation = {
  rows: 2,
  columns: 3,

  cellWidth: 50,
  cellHeight: 40,

  surfaceWidth: 150,
  surfaceHeight: 80,

  gridWidth: 150,
  gridHeight: 80,

  remainder: {
    width: 0,
    height: 0,
  },
};

describe("generateGridLines", () => {
  it("creates columns plus one vertical lines", () => {
    const lines = generateGridLines(calculation);

    const verticalLines = lines.filter((line) => line.axis === "vertical");

    expect(verticalLines).toHaveLength(4);
  });

  it("creates rows plus one horizontal lines", () => {
    const lines = generateGridLines(calculation);

    const horizontalLines = lines.filter((line) => line.axis === "horizontal");

    expect(horizontalLines).toHaveLength(3);
  });

  it("creates the correct total number of lines", () => {
    const lines = generateGridLines(calculation);

    expect(lines).toHaveLength(7);
  });

  it("positions vertical lines correctly", () => {
    const lines = generateGridLines(calculation);

    const verticalLines = lines.filter((line) => line.axis === "vertical");

    expect(verticalLines.map((line) => line.start.x)).toEqual([
      0, 50, 100, 150,
    ]);
  });

  it("positions horizontal lines correctly", () => {
    const lines = generateGridLines(calculation);

    const horizontalLines = lines.filter((line) => line.axis === "horizontal");

    expect(horizontalLines.map((line) => line.start.y)).toEqual([0, 40, 80]);
  });

  it("uses grid height for vertical line endpoints", () => {
    const lines = generateGridLines(calculation);

    const verticalLine = lines.find((line) => line.axis === "vertical");

    expect(verticalLine?.end.y).toBe(80);
  });

  it("uses grid width for horizontal line endpoints", () => {
    const lines = generateGridLines(calculation);

    const horizontalLine = lines.find((line) => line.axis === "horizontal");

    expect(horizontalLine?.end.x).toBe(150);
  });
});
