import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TextTitle2 } from "@coinbase/cds-mobile/typography/TextTitle2";
import { TextTitle3 } from "@coinbase/cds-mobile/typography/TextTitle3";
import { useAuth } from "@/lib/AuthContext";
import { MainStackParamList } from "@/navigation/types";

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function AppHeader() {
  const navigation = useNavigation<NavigationProp>();
  const { session, profile } = useAuth();

  const handleLogoPress = () => {
    navigation.navigate("Home");
  };

  const handleProfilePress = () => {
    if (session && profile?.username) {
      navigation.navigate("Profile", { username: profile.username });
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogoPress} style={styles.logoButton}>
        <TextTitle2 style={styles.logo}>POMB</TextTitle2>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <TextTitle3 style={styles.avatarText}>
              {profile?.username?.charAt(0).toUpperCase() ?? "?"}
            </TextTitle3>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logoButton: {
    padding: 4,
  },
  logo: {
    fontWeight: "700",
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
