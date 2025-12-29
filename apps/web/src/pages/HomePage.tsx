import { useNavigate } from "react-router-dom";
import { Button } from "@coinbase/cds-web/buttons";
import { TextTitle2 } from "@coinbase/cds-web/typography";
import { HStack } from "@coinbase/cds-web/layout";
import { RelayProvider } from "../components/RelayProvider";
import { TripsList } from "../components/TripsList";
import { useAuth } from "../lib/AuthContext";

export function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <RelayProvider>
      <div style={styles.container}>
        <header style={styles.header}>
          <TextTitle2>My Trips</TextTitle2>
          <HStack gap={2}>
            {user ? (
              <Button variant="secondary" onClick={signOut}>
                Sign Out
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Sign In
              </Button>
            )}
          </HStack>
        </header>
        <main style={styles.main}>
          <TripsList />
        </main>
      </div>
    </RelayProvider>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #eee",
  },
  main: {
    padding: "24px",
  },
} as const;
