import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@coinbase/cds-web/buttons";
import { TextInput } from "@coinbase/cds-web/controls";
import { TextTitle2, TextBody, Link } from "@coinbase/cds-web/typography";
import { VStack, HStack, Box } from "@coinbase/cds-web/layout";
import { useAuth } from "../lib/AuthContext";
import { supabase } from "../lib/supabase";

export function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const usernameValidation = validateUsername(username);
    if (usernameValidation) {
      setError(usernameValidation);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // Check if username is available
    const isAvailable = await checkUsernameAvailable(username);
    if (!isAvailable) {
      setLoading(false);
      setError("Username is already taken");
      return;
    }

    // Sign up the user (AuthContext handles username update)
    const { error: signUpError } = await signUp(email, password, username.toLowerCase());

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    setLoading(false);
    // Navigate to home - user is already logged in
    navigate("/");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={6}
    >
      <Box as="form" onSubmit={handleSubmit} width="100%" maxWidth={400}>
        <VStack gap={6}>
          <TextTitle2>Create Account</TextTitle2>

          {error && (
            <Box padding={3} background="bgNegative" borderRadius={200}>
              <TextBody color="fgNegative">{error}</TextBody>
            </Box>
          )}

          <VStack gap={4}>
            <TextInput
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              helperText="3-20 characters, letters, numbers, and underscores only"
            />

            <TextInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
            />

            <TextInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              helperText="Must be at least 6 characters"
            />

            <TextInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
            />
          </VStack>

          <VStack gap={3}>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>

            <HStack justifyContent="center">
              <TextBody>
                Already have an account?{" "}
                <Link href="/login">Sign In</Link>
              </TextBody>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
