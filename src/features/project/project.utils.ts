import type { Project } from "./project.types";

export function createProjectId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">,
): Project {
  const now = new Date().toISOString();

  return {
    ...data,
    id: createProjectId(),
    createdAt: now,
    updatedAt: now,
  };
}

export function updateProjectTimestamp(project: Project): Project {
  return {
    ...project,
    updatedAt: new Date().toISOString(),
  };
}
