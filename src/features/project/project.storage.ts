import AsyncStorage from "@react-native-async-storage/async-storage";

import { PROJECT_STORAGE_KEY } from "./project.constants";
import type { Project } from "./project.types";

export async function getProjects(): Promise<Project[]> {
  try {
    const stored = await AsyncStorage.getItem(PROJECT_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Project[];
  } catch (error) {
    console.error("Failed to load projects:", error);
    return [];
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Failed to save projects:", error);

    throw error;
  }
}
