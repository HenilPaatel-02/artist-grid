export const IMAGE_EFFECT_LIMITS = {
  brightness: {
    min: -100,
    max: 100,
    step: 1,
  },

  contrast: {
    min: 0,
    max: 200,
    step: 1,
  },

  saturation: {
    min: 0,
    max: 200,
    step: 1,
  },

  grayscale: {
    min: 0,
    max: 100,
    step: 1,
  },

  opacity: {
    min: 0,
    max: 100,
    step: 1,
  },
} as const;
