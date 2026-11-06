import { getProjects, saveProjects } from "./project.storage";

import type { Project } from "./project.types";

export async function getAllProjects(): Promise<Project[]> {
  return getProjects();
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();

  return projects.find((project) => project.id === id) ?? null;
}

export async function createStoredProject(project: Project): Promise<void> {
  const projects = await getProjects();

  const updatedProjects = [project, ...projects];

  await saveProjects(updatedProjects);
}

export async function updateStoredProject(project: Project): Promise<void> {
  const projects = await getProjects();

  const projectExists = projects.some(
    (existingProject) => existingProject.id === project.id,
  );

  if (!projectExists) {
    throw new Error(`Project "${project.id}" does not exist.`);
  }

  const updatedProjects = projects.map((existingProject) =>
    existingProject.id === project.id ? project : existingProject,
  );

  await saveProjects(updatedProjects);
}
export async function deleteStoredProject(id: string): Promise<void> {
  const projects = await getProjects();

  const projectExists = projects.some((project) => project.id === id);

  if (!projectExists) {
    throw new Error(`Project "${id}" does not exist.`);
  }

  const updatedProjects = projects.filter((project) => project.id !== id);

  await saveProjects(updatedProjects);
}
