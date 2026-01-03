import { Suspense, type ReactNode } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { Box } from "@coinbase/cds-web/layout";
import { Spinner } from "@coinbase/cds-web/loaders";
import { relayEnvironment } from "../lib/relay";

type Props = {
  children: ReactNode;
};

export function RelayProvider({ children }: Props) {
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <Suspense
        fallback={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            <Spinner size={32} />
          </Box>
        }
      >
        {children}
      </Suspense>
    </RelayEnvironmentProvider>
  );
}
