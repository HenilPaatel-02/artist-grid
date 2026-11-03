import * as FileSystem from "expo-file-system/legacy";

const PROJECT_IMAGES_DIRECTORY = `${FileSystem.documentDirectory}artistgrid/images/`;

function isArtistGridImage(uri: string): boolean {
  return uri.startsWith(PROJECT_IMAGES_DIRECTORY);
}

async function ensureImageDirectory(): Promise<void> {
  const directoryInfo = await FileSystem.getInfoAsync(PROJECT_IMAGES_DIRECTORY);

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(PROJECT_IMAGES_DIRECTORY, {
      intermediates: true,
    });
  }
}

/**
 * Copies an image into ArtistGrid-owned storage.
 * Images already in the managed directory are reused.
 */
export async function persistProjectImage(
  projectId: string,
  sourceUri: string,
): Promise<string> {
  if (!sourceUri.trim()) {
    throw new Error("Image URI is empty.");
  }

  // Avoid copying an image again when it is already persisted.
  if (isArtistGridImage(sourceUri)) {
    const existing = await FileSystem.getInfoAsync(sourceUri);

    if (existing.exists) {
      return sourceUri;
    }

    throw new Error("The saved project image file is missing.");
  }

  if (!FileSystem.documentDirectory) {
    throw new Error("App document directory is unavailable.");
  }

  await ensureImageDirectory();

  // Preserve a simple image extension when available.
  const cleanUri = sourceUri.split(/[?#]/)[0];
  const extensionMatch = cleanUri.match(/\.([a-zA-Z0-9]+)$/);
  const extension = extensionMatch?.[1] ?? "jpg";

  // Unique names let us replace an image safely:
  // copy the new file first, then update the project record.
  const destinationUri = `${PROJECT_IMAGES_DIRECTORY}${projectId}-${Date.now()}.${extension}`;

  await FileSystem.copyAsync({
    from: sourceUri,
    to: destinationUri,
  });

  const copiedFile = await FileSystem.getInfoAsync(destinationUri);

  if (!copiedFile.exists) {
    throw new Error("Image copy could not be verified.");
  }

  return destinationUri;
}

/**
 * Deletes only files inside ArtistGrid's managed image directory.
 * Never pass an arbitrary picker URI to this function.
 */
export async function deletePersistedProjectImage(uri: string): Promise<void> {
  if (!isArtistGridImage(uri)) {
    return;
  }

  const info = await FileSystem.getInfoAsync(uri);

  if (info.exists) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}
