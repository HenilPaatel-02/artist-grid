export type ExportContent = "image-grid" | "image-only" | "grid-only";

export type ExportBackground = "white" | "transparent";

export type ExportSize = "preview" | "large";

export type ExportSettings = {
  content: ExportContent;
  showRowLabels: boolean;
  showColumnLabels: boolean;
  background: ExportBackground;
  size: ExportSize;
};

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  content: "image-grid",
  showRowLabels: true,
  showColumnLabels: true,
  background: "white",
  size: "preview",
};
