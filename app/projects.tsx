import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
      <Text style={styles.projectName}>{project.name}</Text>

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
      "Delete Project",
      `Are you sure you want to delete "${project.name}"?`,
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
            <Text style={styles.emptyTitle}>No projects yet</Text>

            <Text style={styles.emptyDescription}>
              Create and save your first drawing project.
            </Text>
          </View>
        ) : (
          <FlatList
            data={projects}
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  projectName: {
    fontSize: 18,
    fontWeight: "600",
  },

  projectInfo: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },

  projectDate: {
    marginTop: 4,
    fontSize: 12,
    color: "#9CA3AF",
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

  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  emptyDescription: {
    marginTop: 8,
    textAlign: "center",
    color: "#6B7280",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
});
