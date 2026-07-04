import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const handleNewProject = () => {
    console.log("New Project");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ArtistGrid</Text>

        <Text style={styles.description}>
          Drawing Reference Toolkit for Artists
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNewProject}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>New Project</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    color: "#A1A1AA",
    textAlign: "center",
    marginBottom: 32,
  },

  button: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
