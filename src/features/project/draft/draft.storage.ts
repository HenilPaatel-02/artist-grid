import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ProjectDraft } from "./draft.types";

const DRAFT_STORAGE_KEY = "@artistgrid/active-draft";

export async function saveDraft(draft: ProjectDraft): Promise<void> {
  await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export async function getDraft(): Promise<ProjectDraft | null> {
  const stored = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      parsed.version !== 1
    ) {
      return null;
    }

    return parsed as ProjectDraft;
  } catch (error) {
    console.error("Failed to parse ArtistGrid draft:", error);
    return null;
  }
}

export async function clearDraft(): Promise<void> {
  await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
}
