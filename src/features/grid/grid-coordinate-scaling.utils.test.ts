import {
  scaleGridCoordinate,
  scaleGridLines,
} from "./grid-coordinate-scaling.utils";

import { GridCalculation, GridLine } from "./grid.types";

describe("scaleGridCoordinate", () => {
  it("scales a physical coordinate to canvas pixels", () => {
    const result = scaleGridCoordinate(50, 200, 400);

    expect(result).toBe(100);
  });

  it("keeps zero at zero", () => {
    const result = scaleGridCoordinate(0, 200, 400);

    expect(result).toBe(0);
  });

  it("maps the physical end to the canvas end", () => {
    const result = scaleGridCoordinate(200, 200, 400);

    expect(result).toBe(400);
  });

  it("rejects zero physical size", () => {
    expect(() => scaleGridCoordinate(50, 0, 400)).toThrow(
      "Physical size must be greater than zero.",
    );
  });

  it("rejects zero canvas size", () => {
    expect(() => scaleGridCoordinate(50, 200, 0)).toThrow(
      "Canvas size must be greater than zero.",
    );
  });
});

describe("scaleGridLines", () => {
  const calculation: GridCalculation = {
    rows: 2,
    columns: 2,

    cellWidth: 50,
    cellHeight: 50,

    surfaceWidth: 100,
    surfaceHeight: 100,

    gridWidth: 100,
    gridHeight: 100,

    remainder: {
      width: 0,
      height: 0,
    },
  };

  const lines: GridLine[] = [
    {
      axis: "vertical",
      start: {
        x: 50,
        y: 0,
      },
      end: {
        x: 50,
        y: 100,
      },
    },
  ];

  it("scales grid line coordinates", () => {
    const result = scaleGridLines(lines, calculation, {
      width: 300,
      height: 400,
    });

    expect(result[0].start.x).toBe(150);
    expect(result[0].start.y).toBe(0);

    expect(result[0].end.x).toBe(150);
    expect(result[0].end.y).toBe(400);
  });

  it("does not mutate original grid lines", () => {
    scaleGridLines(lines, calculation, {
      width: 300,
      height: 400,
    });

    expect(lines[0].start.x).toBe(50);
    expect(lines[0].end.y).toBe(100);
  });
});
