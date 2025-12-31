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
import { supabase } from "@/lib/supabase";
import { AuthStackParamList, RootStackParamList } from "@/navigation/types";

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "SignUp">;
};

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (value.length > 20) {
      return "Username must be 20 characters or less";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return null;
  };

  const checkUsernameAvailable = async (value: string): Promise<boolean> => {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", value.toLowerCase())
      .single();
    return !data;
  };

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const usernameValidation = validateUsername(username);
    if (usernameValidation) {
      Alert.alert("Error", usernameValidation);
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

    // Check if username is available
    const isAvailable = await checkUsernameAvailable(username);
    if (!isAvailable) {
      setLoading(false);
      Alert.alert("Error", "Username is already taken");
      return;
    }

    // Sign up the user
    const { error } = await signUp(email, password);

    if (error) {
      setLoading(false);
      Alert.alert("Error", error.message);
      return;
    }

    // Get the new user's session and update their profile with the username
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ username: username.toLowerCase() })
        .eq("id", user.id);
    }

    setLoading(false);
    // Navigate back to home - user is already logged in
    rootNavigation.goBack();
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
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              helperText="3-20 characters, letters, numbers, and underscores only"
            />

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
