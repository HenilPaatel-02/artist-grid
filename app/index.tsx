import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppButton } from "@/src/components/ui/AppButton";
import { Screen } from "@/src/components/ui/Screen";
import { COLORS } from "@/src/constants/colors";

export default function HomeScreen() {
  const handleNewProject = () => {
    router.push("/new-project");
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>ArtistGrid</Text>

        <Text style={styles.description}>
          Drawing Reference Toolkit for Artists
        </Text>

        <AppButton title="New Project" onPress={handleNewProject} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 12,
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
});
