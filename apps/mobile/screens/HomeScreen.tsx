import { Box } from "@coinbase/cds-mobile/layout/Box";
import { RelayProvider } from "@/components/RelayProvider";
import { AppHeader } from "@/components/AppHeader";
import { TripsList } from "@/components/TripsList";

function HomeContent() {
  return (
    <Box flexGrow={1} background="bg">
      <AppHeader />
      <TripsList />
    </Box>
  );
}

export function HomeScreen() {
  return (
    <RelayProvider>
      <HomeContent />
    </RelayProvider>
  );
}
