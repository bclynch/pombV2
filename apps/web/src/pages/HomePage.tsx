import { Box } from "@coinbase/cds-web/layout";
import { RelayProvider } from "../components/RelayProvider";
import { TripsList } from "../components/TripsList";

function HomeContent() {
  return (
    <Box minHeight="100vh" width="100%" background="bg">
      <Box as="main" padding={3} width="100%">
        <TripsList />
      </Box>
    </Box>
  );
}

export function HomePage() {
  return (
    <RelayProvider>
      <HomeContent />
    </RelayProvider>
  );
}
