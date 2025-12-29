import { useState } from "react";
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { TextInput } from "@coinbase/cds-mobile/controls/TextInput";
import { TextTitle2 } from "@coinbase/cds-mobile/typography/TextTitle2";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { VStack } from "@coinbase/cds-mobile/layout/VStack";
import { useAuth } from "@/lib/AuthContext";
import { AuthStackParamList, RootStackParamList } from "@/navigation/types";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      rootNavigation.goBack();
    }
  };

  const handleClose = () => {
    rootNavigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.closeButton}>
        <Pressable onPress={handleClose}>
          <TextBody>Cancel</TextBody>
        </Pressable>
      </View>
      <View style={styles.content}>
        <VStack gap={6}>
          <View style={styles.header}>
            <TextTitle2>Welcome Back</TextTitle2>
          </View>

          <VStack gap={4}>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </VStack>

          <VStack gap={3}>
            <Button onPress={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button variant="secondary" onPress={() => navigation.navigate("SignUp")}>
              Don't have an account? Sign Up
            </Button>
          </VStack>
        </VStack>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  closeButton: {
    padding: 16,
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
  },
});
