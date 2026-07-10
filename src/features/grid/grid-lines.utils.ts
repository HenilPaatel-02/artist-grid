import { GridCalculation, GridLine } from "./grid.types";

export const generateGridLines = (calculation: GridCalculation): GridLine[] => {
  const verticalLines = generateVerticalLines(calculation);

  const horizontalLines = generateHorizontalLines(calculation);

  return [...verticalLines, ...horizontalLines];
};

const generateVerticalLines = (calculation: GridCalculation): GridLine[] => {
  const lines: GridLine[] = [];

  for (let column = 0; column <= calculation.columns; column += 1) {
    const x = column * calculation.cellWidth;

    lines.push({
      axis: "vertical",
      start: {
        x,
        y: 0,
      },
      end: {
        x,
        y: calculation.gridHeight,
      },
    });
  }

  return lines;
};

const generateHorizontalLines = (calculation: GridCalculation): GridLine[] => {
  const lines: GridLine[] = [];

  for (let row = 0; row <= calculation.rows; row += 1) {
    const y = row * calculation.cellHeight;

    lines.push({
      axis: "horizontal",
      start: {
        x: 0,
        y,
      },
      end: {
        x: calculation.gridWidth,
        y,
      },
    });
  }

  return lines;
};
