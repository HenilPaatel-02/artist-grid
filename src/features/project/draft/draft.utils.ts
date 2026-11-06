import type { ProjectDraft } from "./draft.types";

export function createProjectDraft(
  data: Omit<ProjectDraft, "version" | "savedAt">,
): ProjectDraft {
  return {
    ...data,
    version: 1,
    savedAt: new Date().toISOString(),
  };
}
