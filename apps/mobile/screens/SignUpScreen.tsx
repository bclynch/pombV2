import { useState } from "react";
import { KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button } from "@coinbase/cds-mobile/buttons/Button";
import { TextInput } from "@coinbase/cds-mobile/controls/TextInput";
import { TextTitle2 } from "@coinbase/cds-mobile/typography/TextTitle2";
import { TextBody } from "@coinbase/cds-mobile/typography/TextBody";
import { Box, VStack } from "@coinbase/cds-mobile/layout";
import { Pressable } from "@coinbase/cds-mobile/system/Pressable";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { AuthStackParamList, RootStackParamList } from "@/navigation/types";

// supabase is still needed for username availability check

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "SignUp">;
};

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

    const isAvailable = await checkUsernameAvailable(username);
    if (!isAvailable) {
      setLoading(false);
      Alert.alert("Error", "Username is already taken");
      return;
    }

    const { error } = await signUp(email, password, username.toLowerCase());

    if (error) {
      setLoading(false);
      Alert.alert("Error", error.message);
      return;
    }

    setLoading(false);
    rootNavigation.goBack();
  };

  const handleClose = () => {
    rootNavigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Box flexGrow={1} background="bg">
        <Box padding={2} alignItems="flex-end">
          <Pressable onPress={handleClose}>
            <TextBody>Cancel</TextBody>
          </Pressable>
        </Box>
        <Box flexGrow={1} justifyContent="center" padding={3}>
          <VStack gap={6}>
            <Box alignItems="center">
              <TextTitle2>Create Account</TextTitle2>
            </Box>

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
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
}
