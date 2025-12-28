import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { RelayProvider } from "./components/RelayProvider";
import { TripsList } from "./components/TripsList";

export default function App() {
  return (
    <RelayProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Trips</Text>
        </View>
        <TripsList />
        <StatusBar style="auto" />
      </SafeAreaView>
    </RelayProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
