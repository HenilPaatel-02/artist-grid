import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { COLORS } from "@/src/constants/colors";

import { ImagePickerSection } from "@/src/features/image-picker/components/ImagePickerSection";
import type { SelectedImage } from "@/src/features/image-picker/image-picker.types";

import type { ImageOrientation } from "@/src/features/image-orientation/image-orientation.types";
import { getImageOrientation } from "@/src/features/image-orientation/image-orientation.utils";

import { DrawingSurfaceSection } from "@/src/features/drawing-surface/components/DrawingSurfaceSection";
import type {
  DrawingSurface,
  SurfaceOrientation,
} from "@/src/features/drawing-surface/drawing-surface.types";

import { GridPreviewSection } from "@/src/features/grid/components/GridPreviewSection";
import { GridSettingsSection } from "@/src/features/grid/components/GridSettingsSection";
import type { GridCalculation } from "@/src/features/grid/grid.types";

import { ImageEffectsSection } from "@/src/features/image-effects/components/ImageEffectsSection";
import {
  DEFAULT_IMAGE_EFFECTS,
  type ImageEffects,
} from "@/src/features/image-effects/image-effects.types";

import { AppButton } from "@/src/components/ui/AppButton";
import { GridStylingSection } from "@/src/features/grid/components/GridStylingSection";
import {
  DEFAULT_GRID_STYLING,
  type GridStyling,
} from "@/src/features/grid/grid-styling.types";
import { DEFAULT_PROJECT_NAME } from "@/src/features/project/project.constants";
import {
  createStoredProject,
  getProjectById,
  updateStoredProject,
} from "@/src/features/project/project.repository";
import {
  createProject,
  updateProjectTimestamp,
} from "@/src/features/project/project.utils";
import { useLocalSearchParams } from "expo-router";

import {
  deletePersistedProjectImage,
  persistProjectImage,
} from "@/src/features/project/project-image.storage";

import {
  clearDraft,
  getDraft,
  saveDraft,
} from "@/src/features/project/draft/draft.storage";

import { createProjectDraft } from "@/src/features/project/draft/draft.utils";

import type { ProjectDraft } from "@/src/features/project/draft/draft.types";
import type { Project } from "@/src/features/project/project.types";

export default function NewProjectScreen() {
  const { projectId: routeProjectId } = useLocalSearchParams<{
    projectId?: string;
  }>();

  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState(DEFAULT_PROJECT_NAME);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );

  const [imageOrientation, setImageOrientation] =
    useState<ImageOrientation | null>(null);

  const [drawingSurface, setDrawingSurface] = useState<DrawingSurface | null>(
    null,
  );

  const [gridCalculation, setGridCalculation] =
    useState<GridCalculation | null>(null);

  const [imageEffects, setImageEffects] = useState<ImageEffects>({
    ...DEFAULT_IMAGE_EFFECTS,
  });

  const [gridStyling, setGridStyling] = useState<GridStyling>({
    ...DEFAULT_GRID_STYLING,
  });

  const [isEditorReady, setIsEditorReady] = useState(false);

  const [draftStatus, setDraftStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const saveSequence = useRef(0);
  const skipNextAutosave = useRef(false);
  const isSavingRef = useRef(false);

  const restoreProject = (project: Project) => {
    setProjectId(project.id);
    setProjectName(project.name);
    setSelectedImage(project.image);

    setImageOrientation(
      getImageOrientation(project.image.width, project.image.height),
    );

    setDrawingSurface(project.drawingSurface);
    setGridCalculation(project.gridCalculation);
    setImageEffects(project.imageEffects);
    setGridStyling(project.gridStyling);
  };

  const restoreDraft = (draft: ProjectDraft) => {
    setProjectId(draft.projectId);
    setProjectName(draft.projectName);
    setSelectedImage(draft.image);

    setImageOrientation(
      draft.image
        ? getImageOrientation(draft.image.width, draft.image.height)
        : null,
    );

    setDrawingSurface(draft.drawingSurface);
    setGridCalculation(draft.gridCalculation);
    setImageEffects(draft.imageEffects);
    setGridStyling(draft.gridStyling);
  };

  // Load an existing project or offer recovery of an unfinished draft.
  useEffect(() => {
    let isMounted = true;

    const initializeEditor = async () => {
      try {
        if (routeProjectId) {
          const project = await getProjectById(routeProjectId);

          if (!isMounted) return;

          if (!project) {
            Alert.alert("Project Not Found", "This project no longer exists.");
            setIsEditorReady(true);
            return;
          }

          const draft = await getDraft();

          if (!isMounted) return;

          const hasNewerMatchingDraft =
            draft?.projectId === project.id &&
            draft.savedAt > project.updatedAt;

          if (hasNewerMatchingDraft && draft) {
            Alert.alert(
              "Recover Changes?",
              "A newer autosaved draft was found for this project.",
              [
                {
                  text: "Use Saved Project",
                  onPress: async () => {
                    try {
                      await clearDraft();

                      if (!isMounted) return;

                      restoreProject(project);
                    } catch (error) {
                      console.error("Failed to clear draft:", error);

                      if (isMounted) {
                        restoreProject(project);
                      }
                    } finally {
                      if (isMounted) {
                        setIsEditorReady(true);
                      }
                    }
                  },
                },
                {
                  text: "Recover Draft",
                  onPress: () => {
                    if (!isMounted) return;

                    restoreDraft(draft);
                    setIsEditorReady(true);
                  },
                },
              ],
            );

            return;
          }

          restoreProject(project);
          setIsEditorReady(true);
          return;
        }

        const draft = await getDraft();

        if (!isMounted) return;

        if (draft?.projectId === null) {
          Alert.alert(
            "Recover Draft?",
            "An unfinished project was found. Would you like to recover it?",
            [
              {
                text: "Discard",
                style: "destructive",
                onPress: async () => {
                  try {
                    await clearDraft();
                  } catch (error) {
                    console.error("Failed to clear draft:", error);
                  } finally {
                    if (isMounted) {
                      setIsEditorReady(true);
                    }
                  }
                },
              },
              {
                text: "Recover",
                onPress: () => {
                  if (!isMounted) return;

                  restoreDraft(draft);
                  setIsEditorReady(true);
                },
              },
            ],
          );

          return;
        }

        setIsEditorReady(true);
      } catch (error) {
        console.error("Failed to initialize editor:", error);

        if (isMounted) {
          setIsEditorReady(true);
        }
      }
    };

    void initializeEditor();

    return () => {
      isMounted = false;
    };
  }, [routeProjectId]);

  const handleImageSelected = (image: SelectedImage) => {
    const orientation = getImageOrientation(image.width, image.height);

    setSelectedImage(image);
    setImageOrientation(orientation);

    setDrawingSurface(null);
    setGridCalculation(null);

    setImageEffects({ ...DEFAULT_IMAGE_EFFECTS });
    setGridStyling({ ...DEFAULT_GRID_STYLING });
  };

  const handleImageCleared = () => {
    setSelectedImage(null);
    setImageOrientation(null);

    setDrawingSurface(null);
    setGridCalculation(null);

    setImageEffects({ ...DEFAULT_IMAGE_EFFECTS });
    setGridStyling({ ...DEFAULT_GRID_STYLING });
  };

  const handleSurfaceChange = (surface: DrawingSurface | null) => {
    setDrawingSurface(surface);
    setGridCalculation(null);
  };

  const handleGridChange = (calculation: GridCalculation | null) => {
    setGridCalculation(calculation);
  };

  const getInitialSurfaceOrientation = (): SurfaceOrientation => {
    return imageOrientation === "landscape" ? "landscape" : "portrait";
  };

  // Debounced draft autosave.
  useEffect(() => {
    if (!isEditorReady) return;

    if (skipNextAutosave.current) {
      skipNextAutosave.current = false;
      return;
    }

    const sequence = ++saveSequence.current;

    const timeoutId = setTimeout(() => {
      const runAutosave = async () => {
        try {
          setDraftStatus("saving");

          let imageForDraft = selectedImage;

          if (selectedImage) {
            const persistedUri = await persistProjectImage(
              projectId ?? "draft",
              selectedImage.uri,
            );

            imageForDraft = {
              ...selectedImage,
              uri: persistedUri,
            };
          }

          // Discard outdated work before writing the draft.
          if (sequence !== saveSequence.current) return;

          const draft = createProjectDraft({
            projectId,
            projectName,
            image: imageForDraft,
            drawingSurface,
            gridCalculation,
            imageEffects,
            gridStyling,
          });

          await saveDraft(draft);

          if (sequence === saveSequence.current) {
            setDraftStatus("saved");
          }
        } catch (error) {
          console.error("Failed to autosave draft:", error);

          if (sequence === saveSequence.current) {
            setDraftStatus("error");
          }
        }
      };

      void runAutosave();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [
    isEditorReady,
    projectId,
    projectName,
    selectedImage,
    drawingSurface,
    gridCalculation,
    imageEffects,
    gridStyling,
  ]);

  const handleSaveProject = async () => {
    if (
      isSavingRef.current ||
      !selectedImage ||
      !drawingSurface ||
      !gridCalculation
    ) {
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      const projectData = {
        name: projectName.trim() || DEFAULT_PROJECT_NAME,
        image: selectedImage,
        drawingSurface,
        gridCalculation,
        imageEffects,
        gridStyling,
      };

      if (projectId) {
        const existingProject = await getProjectById(projectId);

        if (!existingProject) {
          throw new Error("Project no longer exists.");
        }

        const persistedImageUri = await persistProjectImage(
          existingProject.id,
          selectedImage.uri,
        );

        const updatedProject = updateProjectTimestamp({
          ...existingProject,
          ...projectData,
          image: {
            ...selectedImage,
            uri: persistedImageUri,
          },
        });

        await updateStoredProject(updatedProject);

        if (existingProject.image.uri !== persistedImageUri) {
          try {
            await deletePersistedProjectImage(existingProject.image.uri);
          } catch (cleanupError) {
            console.error(
              "Project saved, but old image cleanup failed:",
              cleanupError,
            );
          }
        }
      } else {
        const newProject = createProject(projectData);

        const persistedImageUri = await persistProjectImage(
          newProject.id,
          newProject.image.uri,
        );

        const projectWithPersistedImage = {
          ...newProject,
          image: {
            ...newProject.image,
            uri: persistedImageUri,
          },
        };

        await createStoredProject(projectWithPersistedImage);

        // Prevent the projectId update from recreating the cleared draft.
        skipNextAutosave.current = true;
        setProjectId(projectWithPersistedImage.id);
      }

      // Invalidate pending autosaves and clear the draft after success.
      saveSequence.current += 1;
      await clearDraft();
      setDraftStatus("idle");

      Alert.alert("Saved", "Your project was saved successfully.");
    } catch (error) {
      console.error("Failed to save project:", error);

      Alert.alert(
        "Save Failed",
        error instanceof Error
          ? error.message
          : "Unable to save the project. Your draft has been retained.",
      );
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>New Project</Text>

          <Text style={styles.description}>
            Choose a reference image and configure your physical drawing
            surface.
          </Text>
        </View>

        <ImagePickerSection
          onImageSelected={handleImageSelected}
          onImageCleared={handleImageCleared}
        />

        {selectedImage && imageOrientation ? (
          <>
            <View style={styles.imageDetails}>
              <Text style={styles.sectionLabel}>Reference Image</Text>

              <Text style={styles.imageDimensions}>
                {selectedImage.width} × {selectedImage.height} px
              </Text>

              <Text style={styles.imageOrientation}>
                {capitalize(imageOrientation)}
              </Text>
            </View>

            <View style={styles.sectionSeparator} />

            <DrawingSurfaceSection
              key={selectedImage.uri}
              initialOrientation={getInitialSurfaceOrientation()}
              restoredSurface={drawingSurface}
              onSurfaceChange={handleSurfaceChange}
            />

            {drawingSurface ? (
              <>
                <View style={styles.sectionSeparator} />

                <GridSettingsSection
                  key={`${drawingSurface.type}-${drawingSurface.orientation}`}
                  surface={drawingSurface}
                  restoredCalculation={gridCalculation}
                  onGridChange={handleGridChange}
                />
              </>
            ) : null}

            {gridCalculation ? (
              <View style={styles.readyContainer}>
                <Text style={styles.readyTitle}>Grid Ready</Text>

                <Text style={styles.readyDescription}>
                  {gridCalculation.columns} × {gridCalculation.rows} grid ·{" "}
                  {gridCalculation.cellWidth.toFixed(2)} ×{" "}
                  {gridCalculation.cellHeight.toFixed(2)} mm cells
                </Text>
              </View>
            ) : null}
          </>
        ) : null}

        {selectedImage && drawingSurface && gridCalculation ? (
          <>
            <View style={styles.sectionSeparator} />

            <ImageEffectsSection
              effects={imageEffects}
              onChange={setImageEffects}
            />

            <View style={styles.sectionSeparator} />

            <GridStylingSection
              styling={gridStyling}
              onChange={setGridStyling}
            />

            <GridPreviewSection
              image={selectedImage}
              surface={drawingSurface}
              calculation={gridCalculation}
              imageEffects={imageEffects}
              gridStyling={gridStyling}
            />
          </>
        ) : null}

        {drawingSurface ? (
          <View style={styles.readyContainer}>
            <Text style={styles.readyTitle}>Drawing Surface Ready</Text>

            <Text style={styles.readyDescription}>
              {capitalize(drawingSurface.type)} · {drawingSurface.size.width} ×{" "}
              {drawingSurface.size.height} {drawingSurface.size.unit}
            </Text>
          </View>
        ) : null}

        <View style={styles.projectNameSection}>
          <Text style={styles.projectNameLabel}>Project Name</Text>

          <TextInput
            value={projectName}
            onChangeText={setProjectName}
            placeholder="Enter project name"
            autoCapitalize="words"
            maxLength={80}
            style={styles.projectNameInput}
          />

          <Text>
            {draftStatus === "saving" && "Saving draft..."}
            {draftStatus === "saved" && "Draft saved"}
            {draftStatus === "error" && "Draft could not be saved"}
          </Text>

          <AppButton
            title={isSaving ? "Saving..." : "Save Project"}
            onPress={handleSaveProject}
            disabled={isSaving}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
  },

  imageDetails: {
    marginTop: 20,
    gap: 6,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  imageDimensions: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  imageOrientation: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  sectionSeparator: {
    height: 1,
    marginVertical: 20,
    backgroundColor: COLORS.border,
  },

  readyContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  readyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  readyDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
  },
  projectNameSection: {
    marginTop: 30,
    gap: 12,
  },

  projectNameLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  projectNameInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});
