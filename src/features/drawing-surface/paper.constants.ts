import { PaperType } from "./drawing-surface.types";

export const PAPER_DIMENSIONS: Record<
  Exclude<PaperType, "CUSTOM">,
  {
    width: number;
    height: number;
  }
> = {
  A5: {
    width: 148,
    height: 210,
  },

  A4: {
    width: 210,
    height: 297,
  },

  A3: {
    width: 297,
    height: 420,
  },

  A2: {
    width: 420,
    height: 594,
  },

  A1: {
    width: 594,
    height: 841,
  },
};
