import { Suspense, type ReactNode } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { ActivityIndicator } from "react-native";
import { Box } from "@coinbase/cds-mobile/layout/Box";
import { relayEnvironment } from "@/lib/supabase";

type Props = {
  children: ReactNode;
};

export function RelayProvider({ children }: Props) {
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <Suspense
        fallback={
          <Box flexGrow={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" />
          </Box>
        }
      >
        {children}
      </Suspense>
    </RelayEnvironmentProvider>
  );
}
