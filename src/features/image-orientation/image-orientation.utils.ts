import { ImageOrientation } from "./image-orientation.types";

export const getImageOrientation = (
  width: number,
  height: number,
): ImageOrientation => {
  if (width <= 0 || height <= 0) {
    throw new Error("Image dimensions must be greater than zero.");
  }

  if (width === height) {
    return "square";
  }

  if (width > height) {
    return "landscape";
  }

  return "portrait";
};
