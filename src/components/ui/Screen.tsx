import { SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS } from "@/src/constants/colors";

type ScreenProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
