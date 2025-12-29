import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "./AuthContext";
import { RootStackParamList } from "@/navigation/types";

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useRequireAuth() {
  const { user } = useAuth();
  const navigation = useNavigation<RootNavigationProp>();

  const requireAuth = (callback: () => void) => {
    if (user) {
      callback();
    } else {
      navigation.navigate("Auth");
    }
  };

  return { requireAuth, isAuthenticated: !!user };
}
