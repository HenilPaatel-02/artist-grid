export const getGridCellLabel = (column: number, row: number): string => {
  validateGridCoordinate(column, row);

  const columnLabel = getColumnLabel(column);

  const rowLabel = row + 1;

  return `${columnLabel}${rowLabel}`;
};

export const getColumnLabel = (column: number): string => {
  if (!Number.isInteger(column) || column < 0) {
    throw new Error("Grid column index must be a non-negative whole number.");
  }

  let index = column;
  let label = "";

  do {
    const remainder = index % 26;

    label = String.fromCharCode(65 + remainder) + label;

    index = Math.floor(index / 26) - 1;
  } while (index >= 0);

  return label;
};

const validateGridCoordinate = (column: number, row: number): void => {
  if (!Number.isInteger(column) || column < 0) {
    throw new Error("Grid column index must be a non-negative whole number.");
  }

  if (!Number.isInteger(row) || row < 0) {
    throw new Error("Grid row index must be a non-negative whole number.");
  }
};
