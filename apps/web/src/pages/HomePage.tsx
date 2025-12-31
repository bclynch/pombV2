import { useNavigate } from "react-router-dom";
import { Button } from "@coinbase/cds-web/buttons";
import { TextTitle2 } from "@coinbase/cds-web/typography";
import { HStack } from "@coinbase/cds-web/layout";
import { useLazyLoadQuery } from "react-relay";
import { RelayProvider } from "../components/RelayProvider";
import { TripsList } from "../components/TripsList";
import { useAuth } from "../lib/AuthContext";

function HomeContent() {
  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <TripsList />
      </main>
    </div>
  );
}

export function HomePage() {
  return (
    <RelayProvider>
      <HomeContent />
    </RelayProvider>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
  },
  main: {
    padding: "24px",
  },
} as const;
