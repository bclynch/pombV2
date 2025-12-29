import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@coinbase/cds-web/buttons";
import { TextInput } from "@coinbase/cds-web/controls";
import { TextTitle2, TextBody } from "@coinbase/cds-web/typography";
import { VStack, HStack } from "@coinbase/cds-web/layout";
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
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <VStack gap={6}>
          <TextTitle2>Welcome Back</TextTitle2>

          {error && (
            <div style={styles.error}>
              <TextBody>{error}</TextBody>
            </div>
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
                <Link to="/signup" style={styles.link}>
                  Sign Up
                </Link>
              </TextBody>
            </HStack>
          </VStack>
        </VStack>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "24px",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
  },
  error: {
    padding: "12px",
    backgroundColor: "#fee",
    borderRadius: "8px",
    color: "#c00",
  },
  link: {
    color: "#0052ff",
    textDecoration: "none",
  },
} as const;
