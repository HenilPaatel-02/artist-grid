export const GRID_STYLING_LIMITS = {
  gridOpacity: {
    min: 0,
    max: 100,
    step: 1,
  },

  gridStrokeWidth: {
    min: 0.5,
    max: 5,
    step: 0.5,
  },

  labelSize: {
    min: 8,
    max: 24,
    step: 1,
  },
} as const;
