import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import {
  deleteStoredProject,
  getAllProjects,
  getProjectById,
} from "@/src/features/project/project.repository";
import type { Project } from "@/src/features/project/project.types";

import { AppButton } from "@/src/components/ui/AppButton";

import { deletePersistedProjectImage } from "@/src/features/project/project-image.storage";

import { COLORS } from "@/src/constants/colors";
import { ProjectThumbnail } from "@/src/features/project/components/ProjectThumbnail";

function formatProjectDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString();
}
function ProjectCard({
  project,
  onDelete,
  isDeleting,
}: {
  project: Project;
  onDelete: (project: Project) => void;
  isDeleting: boolean;
}) {
  const handleOpen = () => {
    router.push({
      pathname: "/new-project",
      params: {
        projectId: project.id,
      },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <ProjectThumbnail uri={project.image.uri} />

        <View style={styles.projectDetails}>
          <Text style={styles.projectName} numberOfLines={1}>
            {project.name}
          </Text>

          <Text style={styles.projectInfo}>
            {project.gridCalculation.columns} × {project.gridCalculation.rows}{" "}
            grid
          </Text>

          <Text style={styles.projectDate}>
            Updated {formatProjectDate(project.updatedAt)}
          </Text>
        </View>
      </View>

      <Text style={styles.projectInfo}>
        {project.gridCalculation.columns} × {project.gridCalculation.rows} grid
      </Text>

      <Text style={styles.projectDate}>
        Updated {formatProjectDate(project.updatedAt)}
      </Text>

      <View style={styles.actions}>
        <AppButton title="Open" onPress={handleOpen} />

        <AppButton
          title={isDeleting ? "Deleting..." : "Delete"}
          onPress={() => onDelete(project)}
          disabled={isDeleting}
        />
      </View>
    </View>
  );
}
export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [projects, sortOrder]);

  const loadProjects = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const savedProjects = await getAllProjects();

      setProjects(savedProjects);
    } catch (err) {
      console.error("Failed to load projects:", err);

      setError("Unable to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProjects();
    }, []),
  );

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.message}>Loading projects...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Screen>
    );
  }

  const handleDeleteProject = (project: Project) => {
    Alert.alert(
      "Delete Project?",
      `"${project.name}" will be permanently removed from your saved projects.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingProjectId(project.id);

              // 1. Get the project before deleting its record.
              const projectToDelete = await getProjectById(project.id);

              if (!projectToDelete) {
                throw new Error("Project no longer exists.");
              }

              // 2. Delete the project record from storage.
              await deleteStoredProject(project.id);

              // 3. Update the UI immediately.
              setProjects((currentProjects) =>
                currentProjects.filter((item) => item.id !== project.id),
              );

              // 4. Delete its locally persisted image.
              try {
                await deletePersistedProjectImage(projectToDelete.image.uri);
              } catch (imageError) {
                // The project record is already deleted.
                // An image cleanup failure should not undo that success.
                console.error(
                  "Project deleted, but image cleanup failed:",
                  imageError,
                );
              }

              Alert.alert("Success", "Project deleted successfully.");
            } catch (error) {
              console.error("Failed to delete project:", error);

              Alert.alert(
                "Delete Failed",
                error instanceof Error
                  ? error.message
                  : "Unable to delete the project.",
              );
            } finally {
              setDeletingProjectId(null);
            }
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>My Projects</Text>

        {projects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>✦</Text>
            </View>

            <Text style={styles.emptyTitle}>Your canvas is waiting.</Text>

            <Text style={styles.emptyDescription}>
              You haven&apos;t saved any projects yet. Start with a reference
              image and create your first drawing grid.
            </Text>

            <AppButton
              title="+  Create New Project"
              onPress={() => router.push("/new-project")}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <>
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>
                {sortedProjects.length}{" "}
                {sortedProjects.length === 1 ? "Project" : "Projects"}
              </Text>

              <View style={styles.sortActions}>
                <Pressable
                  onPress={() => setSortOrder("newest")}
                  style={[
                    styles.sortButton,
                    sortOrder === "newest" && styles.sortButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortOrder === "newest" && styles.sortButtonTextActive,
                    ]}
                  >
                    Newest
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setSortOrder("oldest")}
                  style={[
                    styles.sortButton,
                    sortOrder === "oldest" && styles.sortButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortOrder === "oldest" && styles.sortButtonTextActive,
                    ]}
                  >
                    Oldest
                  </Text>
                </Pressable>
              </View>
            </View>
            <FlatList
              data={sortedProjects}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ProjectCard
                  project={item}
                  onDelete={handleDeleteProject}
                  isDeleting={deletingProjectId === item.id}
                />
              )}
              contentContainerStyle={styles.list}
            />
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  list: {
    paddingBottom: 24,
  },

  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  projectDetails: {
    flex: 1,
    gap: 5,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  projectInfo: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  projectDate: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  message: {
    marginTop: 10,
    color: "#6B7280",
  },

  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: COLORS.amethyst,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.violet,
  },

  emptyIcon: {
    fontSize: 34,
    color: COLORS.highlight,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },

  emptyDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 280,
  },

  emptyButton: {
    width: "100%",
    marginTop: 8,
  },

  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sortLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  sortActions: {
    flexDirection: "row",
    gap: 8,
  },

  sortButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sortButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  sortButtonText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },

  sortButtonTextActive: {
    color: COLORS.black,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
});
