import { ImageEffects } from "./image-effects.types";

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Creates a Skia 5x4 color matrix.
 *
 * Matrix layout:
 *
 * R = r0R + r1G + r2B + r3A + r4
 * G = g0R + g1G + g2B + g3A + g4
 * B = b0R + b1G + b2B + b3A + b4
 * A = a0R + a1G + a2B + a3A + a4
 */
export const createImageEffectMatrix = (effects: ImageEffects): number[] => {
  const brightness = clamp(effects.brightness, -100, 100) / 100;

  const contrast = clamp(effects.contrast, 0, 200) / 100;

  const saturation = clamp(effects.saturation, 0, 200) / 100;

  const grayscale = clamp(effects.grayscale, 0, 100) / 100;

  const opacity = clamp(effects.opacity, 0, 100) / 100;

  /*
   * Saturation matrix.
   */
  const luminanceR = 0.2126;
  const luminanceG = 0.7152;
  const luminanceB = 0.0722;

  const saturationR = luminanceR * (1 - saturation) + saturation;

  const saturationG = luminanceG * (1 - saturation) + saturation;

  const saturationB = luminanceB * (1 - saturation) + saturation;

  const saturationMatrix = [
    saturationR,
    luminanceG * (1 - saturation),
    luminanceB * (1 - saturation),
    0,
    0,

    luminanceR * (1 - saturation),
    saturationG,
    luminanceB * (1 - saturation),
    0,
    0,

    luminanceR * (1 - saturation),
    luminanceG * (1 - saturation),
    saturationB,
    0,
    0,
  ];

  /*
   * Grayscale matrix.
   */
  const grayR = luminanceR * grayscale + (1 - grayscale);

  const grayG = luminanceG * grayscale;

  const grayB = luminanceB * grayscale;

  const grayscaleMatrix = [
    grayR,
    grayG,
    grayB,
    0,
    0,

    luminanceR * grayscale,
    luminanceG * grayscale + (1 - grayscale),
    luminanceB * grayscale,
    0,
    0,

    luminanceR * grayscale,
    luminanceG * grayscale,
    luminanceB * grayscale + (1 - grayscale),
    0,
    0,
  ];

  /*
   * Contrast.
   *
   * 1 = normal
   * 0 = flat gray
   * 2 = high contrast
   */
  const contrastOffset = 0.5 * (1 - contrast);

  const contrastMatrix = [
    contrast,
    0,
    0,
    0,
    contrastOffset,

    0,
    contrast,
    0,
    0,
    contrastOffset,

    0,
    0,
    contrast,
    0,
    contrastOffset,
  ];

  /*
   * Brightness.
   */
  const brightnessMatrix = [
    1,
    0,
    0,
    0,
    brightness,

    0,
    1,
    0,
    0,
    brightness,

    0,
    0,
    1,
    0,
    brightness,
  ];

  /*
   * Combine the matrices.
   */
  const multiply3x5 = (a: number[], b: number[]): number[] => {
    const result = new Array(15).fill(0);

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        let value = 0;

        for (let k = 0; k < 3; k++) {
          value += a[row * 5 + k] * b[k * 5 + col];
        }

        if (col === 4) {
          value += a[row * 5 + 4];
        }

        result[row * 5 + col] = value;
      }
    }

    return result;
  };

  let matrix = multiply3x5(saturationMatrix, grayscaleMatrix);

  matrix = multiply3x5(contrastMatrix, matrix);

  matrix = multiply3x5(brightnessMatrix, matrix);

  return [
    matrix[0],
    matrix[1],
    matrix[2],
    0,
    matrix[4],

    matrix[5],
    matrix[6],
    matrix[7],
    0,
    matrix[9],

    matrix[10],
    matrix[11],
    matrix[12],
    0,
    matrix[14],

    0,
    0,
    0,
    opacity,
    0,
  ];
};
