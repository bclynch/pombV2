import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, SafeAreaView, Alert } from "react-native";
import { RelayProvider } from "./components/RelayProvider";
import { TripsList } from "./components/TripsList";
import { ThemeProvider } from "@coinbase/cds-mobile/system/ThemeProvider";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { TextTitle2 } from "@coinbase/cds-mobile/typography/TextTitle2";
import { defaultTheme } from '@coinbase/cds-mobile/themes/defaultTheme';

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme} activeColorScheme="light">
      <RelayProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TextTitle2>My Trips</TextTitle2>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={() => Alert.alert("CDS Works!", "Button pressed successfully")}>
              Test CDS Button
            </Button>
          </View>
          <TripsList />
          <StatusBar style="auto" />
        </SafeAreaView>
      </RelayProvider>
    </ThemeProvider>
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
  buttonContainer: {
    padding: 16,
  },
});
