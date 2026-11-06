import type { DrawingSurface } from "@/src/features/drawing-surface/drawing-surface.types";
import type { GridStyling } from "@/src/features/grid/grid-styling.types";
import type { GridCalculation } from "@/src/features/grid/grid.types";
import type { ImageEffects } from "@/src/features/image-effects/image-effects.types";
import type { SelectedImage } from "@/src/features/image-picker/image-picker.types";

export type ProjectDraft = {
  version: 1;
  projectId: string | null;
  projectName: string;

  image: SelectedImage | null;
  drawingSurface: DrawingSurface | null;
  gridCalculation: GridCalculation | null;
  imageEffects: ImageEffects;
  gridStyling: GridStyling;

  savedAt: string;
};
