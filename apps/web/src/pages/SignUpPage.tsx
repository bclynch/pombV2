import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@coinbase/cds-web/buttons";
import { TextInput } from "@coinbase/cds-web/controls";
import { TextTitle2, TextBody } from "@coinbase/cds-web/typography";
import { VStack, HStack } from "@coinbase/cds-web/layout";
import { useAuth } from "../lib/AuthContext";

export function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
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
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.form}>
          <VStack gap={4}>
            <TextTitle2>Check Your Email</TextTitle2>
            <TextBody>
              We've sent a confirmation link to {email}. Please check your email
              to complete your registration.
            </TextBody>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </VStack>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <VStack gap={6}>
          <TextTitle2>Create Account</TextTitle2>

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
                <Link to="/login" style={styles.link}>
                  Sign In
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
