import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { ThemeProvider } from "@coinbase/cds-mobile/system/ThemeProvider";
import { defaultTheme } from "@coinbase/cds-mobile/themes/defaultTheme";
import { AuthProvider } from "./lib/AuthContext";
import { RootNavigator } from "./navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={defaultTheme} activeColorScheme="light">
        <AuthProvider>
          <SafeAreaView style={styles.container}>
            <RootNavigator />
            <StatusBar style="auto" />
          </SafeAreaView>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
