import type { ReactNode } from "react";
import { Box } from "@coinbase/cds-web/layout";
import { AppHeader } from "./AppHeader";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" width="100%">
      <AppHeader />
      <Box as="main" flexGrow={1} width="100%">
        {children}
      </Box>
    </Box>
  );
}
