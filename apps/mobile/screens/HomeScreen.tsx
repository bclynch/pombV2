import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { TextTitle2 } from "@coinbase/cds-mobile/typography/TextTitle2";
import { RelayProvider } from "@/components/RelayProvider";
import { TripsList } from "@/components/TripsList";
import { useAuth } from "@/lib/AuthContext";
import { RootStackParamList } from "@/navigation/types";

export function HomeScreen() {
  const { signOut, user } = useAuth();
  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <RelayProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextTitle2>My Trips</TextTitle2>
          {user ? (
            <Button variant="secondary" onPress={signOut}>
              Sign Out
            </Button>
          ) : (
            <Button variant="secondary" onPress={() => navigate("Auth")}>
              Sign In
            </Button>
          )}
        </View>
        <TripsList />
      </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
