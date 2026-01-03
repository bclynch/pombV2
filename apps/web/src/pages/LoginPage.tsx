import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@coinbase/cds-web/buttons";
import { TextInput } from "@coinbase/cds-web/controls";
import { TextTitle2, TextBody, Link } from "@coinbase/cds-web/typography";
import { VStack, HStack, Box } from "@coinbase/cds-web/layout";
import { useAuth } from "../lib/AuthContext";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
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
          <TextTitle2>Welcome Back</TextTitle2>

          {error && (
            <Box padding={3} background="bgNegative" borderRadius={200}>
              <TextBody color="fgNegative">{error}</TextBody>
            </Box>
          )}

          <VStack gap={4}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </VStack>

          <VStack gap={3}>
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <HStack justifyContent="center">
              <TextBody>
                Don't have an account?{" "}
                <Link href="/signup">Sign Up</Link>
              </TextBody>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
