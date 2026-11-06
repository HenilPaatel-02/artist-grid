import type { DrawingSurface } from "@/src/features/drawing-surface/drawing-surface.types";
import type { GridStyling } from "@/src/features/grid/grid-styling.types";
import type { GridCalculation } from "@/src/features/grid/grid.types";
import type { ImageEffects } from "@/src/features/image-effects/image-effects.types";
import type { SelectedImage } from "@/src/features/image-picker/image-picker.types";

export type Project = {
  id: string;

  name: string;

  createdAt: string;
  updatedAt: string;

  image: SelectedImage;

  drawingSurface: DrawingSurface;

  gridCalculation: GridCalculation;

  imageEffects: ImageEffects;

  gridStyling: GridStyling;
};
