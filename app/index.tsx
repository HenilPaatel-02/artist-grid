import { router, useFocusEffect } from "expo-router";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import { Screen } from "@/src/components/ui/Screen";
import { COLORS } from "@/src/constants/colors";
import { ProjectCardSkeleton } from "@/src/features/project/components/ProjectCardSkeleton";
import { ProjectThumbnail } from "@/src/features/project/components/ProjectThumbnail";
import { getAllProjects } from "@/src/features/project/project.repository";
import type { Project } from "@/src/features/project/project.types";
import { useCallback, useState } from "react";

function formatProjectDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleDateString();
}

export default function HomeScreen() {
  const handleNewProject = () => {
    router.push("/new-project");
  };

  const handleMyProjects = () => {
    router.push("/projects" as any);
  };

  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setProjectsError(null);

      const savedProjects = await getAllProjects();

      const sortedProjects = [...savedProjects].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      setRecentProjects(sortedProjects.slice(0, 3));
    } catch (error) {
      console.error("Failed to load recent projects:", error);
      setProjectsError("Unable to load recent projects.");
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProjects();
    setIsRefreshing(false);
  }, [loadProjects]);

  useFocusEffect(
    useCallback(() => {
      void loadProjects();
    }, [loadProjects]),
  );

  const handleOpenProject = (project: Project) => {
    router.push({
      pathname: "/new-project",
      params: { projectId: project.id },
    });
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void handleRefresh()}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            progressBackgroundColor={COLORS.surface}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              ArtistGrid<Text style={styles.logoDot}>.</Text>
            </Text>

            <Text style={styles.subtitle}>CREATIVE STUDIO</Text>
          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>A</Text>
          </View>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeLabel}>YOUR CREATIVE SPACE</Text>

          <Text style={styles.heading}>
            Turn your{"\n"}
            <Text style={styles.headingAccent}>imagination</Text> into art.
          </Text>

          <Text style={styles.description}>
            Create accurate drawing grids from your favorite reference images.
          </Text>
        </View>

        {/* Main Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroDecorationOne} />
          <View style={styles.heroDecorationTwo} />

          <View style={styles.heroContent}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ARTIST TOOLKIT</Text>
            </View>

            <Text style={styles.heroTitle}>
              Every detail{"\n"}
              starts with a grid.
            </Text>

            <Text style={styles.heroDescription}>
              Plan proportions, configure your paper and prepare your next
              masterpiece.
            </Text>

            <AppButton
              title="+  Create New Project"
              onPress={handleNewProject}
              style={styles.heroButton}
            />
          </View>
        </View>

        {/* Projects */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your Workspace</Text>

            <Text style={styles.sectionSubtitle}>Continue creating</Text>
          </View>
        </View>

        <Pressable
          onPress={handleMyProjects}
          style={({ pressed }) => [
            styles.projectsCard,
            pressed && styles.cardPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open my projects"
        >
          <View style={styles.projectIcon}>
            <Text style={styles.projectIconText}>▦</Text>
          </View>

          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>My Projects</Text>

            <Text style={styles.projectDescription}>
              View, edit and manage your drawings.
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </Pressable>

        {/* Recent Projects */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent Projects</Text>
              <Text style={styles.sectionSubtitle}>
                Pick up where you left off
              </Text>
            </View>

            <Pressable
              onPress={handleMyProjects}
              accessibilityRole="button"
              accessibilityLabel="View all projects"
            >
              <Text style={styles.viewAll}>View all →</Text>
            </Pressable>
          </View>

          {isLoadingProjects ? (
            <View style={styles.recentList}>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </View>
          ) : projectsError ? (
            <View style={styles.emptyProjects}>
              <Text style={styles.emptyIcon}>!</Text>

              <Text style={styles.emptyTitle}>
                You haven&apos;t created any projects yet.
              </Text>

              <Text style={styles.emptyDescription}>
                Check your connection to local storage and try again.
              </Text>

              <Pressable onPress={handleRefresh}>
                <Text style={styles.viewAll}>Try again →</Text>
              </Pressable>
            </View>
          ) : recentProjects.length === 0 ? (
            <View style={styles.emptyProjects}>
              <Text style={styles.emptyIcon}>✦</Text>
              <Text style={styles.emptyTitle}>Your canvas is waiting.</Text>
              <Text style={styles.emptyDescription}>
                Start with a reference photo. Your saved drawing projects will
                appear here.
              </Text>
              <Pressable onPress={handleNewProject}>
                <Text style={styles.viewAll}>Create your first project →</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.recentList}>
              {recentProjects.map((project) => (
                <Pressable
                  key={project.id}
                  onPress={() => handleOpenProject(project)}
                  style={({ pressed }) => [
                    styles.recentCard,
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${project.name}`}
                >
                  <ProjectThumbnail uri={project.image.uri} />

                  <View style={styles.recentProjectInfo}>
                    <Text style={styles.recentProjectName} numberOfLines={1}>
                      {project.name}
                    </Text>

                    <Text style={styles.recentProjectGrid}>
                      {project.gridCalculation.columns} ×{" "}
                      {project.gridCalculation.rows} Grid
                    </Text>

                    <Text style={styles.recentProjectDate}>
                      Updated {formatProjectDate(project.updatedAt)}
                    </Text>
                  </View>

                  <Text style={styles.recentArrow}>›</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Feature Cards */}
        <Text style={styles.sectionTitle}>Made for Artists</Text>

        <View style={styles.featuresRow}>
          <View style={styles.featureCard}>
            <View style={styles.featureDotCyan} />
            <Text style={styles.featureTitle}>Precise Grids</Text>
            <Text style={styles.featureDescription}>
              Accurate drawing proportions.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureDotYellow} />
            <Text style={styles.featureTitle}>Paper Sizes</Text>
            <Text style={styles.featureDescription}>
              Configure your drawing surface.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>MADE FOR YOUR NEXT MASTERPIECE</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 32,
    gap: 22,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
  },

  logoDot: {
    color: COLORS.highlight,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    marginTop: 4,
  },

  profileCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.amethyst,
    borderWidth: 1,
    borderColor: COLORS.violet,
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },

  welcomeSection: {
    gap: 12,
  },

  welcomeLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },

  heading: {
    color: COLORS.textPrimary,
    fontSize: 35,
    fontWeight: "800",
    lineHeight: 42,
    letterSpacing: -1,
  },

  headingAccent: {
    color: COLORS.highlight,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 310,
  },

  heroCard: {
    minHeight: 245,
    backgroundColor: COLORS.amethyst,
    borderRadius: 26,
    overflow: "hidden",
    position: "relative",
  },

  heroContent: {
    padding: 22,
    zIndex: 1,
  },

  heroDecorationOne: {
    position: "absolute",
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: COLORS.violet,
    right: -35,
    top: -35,
  },

  heroDecorationTwo: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary,
    right: 28,
    bottom: -35,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.highlight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginBottom: 22,
  },

  badgeText: {
    color: COLORS.black,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 34,
    marginBottom: 10,
  },

  heroDescription: {
    color: "#E3D5F0",
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 250,
    marginBottom: 22,
  },

  heroButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    minHeight: 48,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 19,
    fontWeight: "700",
  },

  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },

  projectsCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.violet,
    alignItems: "center",
    justifyContent: "center",
  },

  projectIconText: {
    color: COLORS.textPrimary,
    fontSize: 24,
  },

  projectInfo: {
    flex: 1,
    marginLeft: 14,
  },

  projectTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },

  projectDescription: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 5,
  },

  arrow: {
    color: COLORS.primary,
    fontSize: 28,
  },

  cardPressed: {
    opacity: 0.7,
  },

  featuresRow: {
    flexDirection: "row",
    gap: 12,
  },

  featureCard: {
    flex: 1,
    minHeight: 125,
    padding: 16,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  featureDotCyan: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginBottom: 16,
  },

  featureDotYellow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.highlight,
    marginBottom: 16,
  },

  featureTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },

  featureDescription: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },

  footer: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 4,
  },
  recentSection: {
    gap: 16,
  },

  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  viewAll: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  recentList: {
    gap: 12,
  },

  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    gap: 14,
  },

  projectThumbnail: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: COLORS.amethyst,
  },

  recentProjectInfo: {
    flex: 1,
    gap: 5,
  },

  recentProjectName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },

  recentProjectGrid: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },

  recentProjectDate: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },

  recentArrow: {
    color: COLORS.primary,
    fontSize: 27,
  },

  projectsMessage: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },

  messageText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },

  emptyProjects: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },

  emptyIcon: {
    color: COLORS.highlight,
    fontSize: 32,
  },

  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  emptyDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
  },
});
