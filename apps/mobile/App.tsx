import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import { ThemeProvider } from "@coinbase/cds-mobile/system/ThemeProvider";
import { defaultTheme } from "@coinbase/cds-mobile/themes/defaultTheme";
import { AuthProvider } from "./lib/AuthContext";
import { RootNavigator } from "./navigation/RootNavigator";

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme} activeColorScheme="light">
      <AuthProvider>
        <SafeAreaView style={styles.container}>
          <RootNavigator />
          <StatusBar style="auto" />
        </SafeAreaView>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
