import { ReactNode, Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { relayEnvironment } from "../lib/relay";

type Props = {
  children: ReactNode;
};

export function RelayProvider({ children }: Props) {
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </RelayEnvironmentProvider>
  );
}
