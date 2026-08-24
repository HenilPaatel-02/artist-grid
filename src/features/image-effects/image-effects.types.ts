export type ImageEffects = {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  opacity: number;
};

export const DEFAULT_IMAGE_EFFECTS: ImageEffects = {
  brightness: 0,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  opacity: 100,
};
