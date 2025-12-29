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

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "SignUp">;
};

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Success",
        "Check your email for a confirmation link to complete your registration.",
        [{ text: "OK", onPress: () => rootNavigation.goBack() }]
      );
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
            <TextTitle2>Create Account</TextTitle2>
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
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              helperText="Must be at least 6 characters"
            />

            <TextInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </VStack>

          <VStack gap={3}>
            <Button onPress={handleSignUp} disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <Button variant="secondary" onPress={() => navigation.navigate("Login")}>
              Already have an account? Sign In
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
