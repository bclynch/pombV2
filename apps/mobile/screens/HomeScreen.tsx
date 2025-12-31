import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RelayProvider } from "@/components/RelayProvider";
import { AppHeader } from "@/components/AppHeader";
import { TripsList } from "@/components/TripsList";

function HomeContent() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppHeader />
      <TripsList />
    </SafeAreaView>
  );
}

export function HomeScreen() {
  return (
    <RelayProvider>
      <HomeContent />
    </RelayProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
