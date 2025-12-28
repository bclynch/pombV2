import { ReactNode, Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { ActivityIndicator, View } from "react-native";
import { relayEnvironment } from "../lib/supabase";

type Props = {
  children: ReactNode;
};

export function RelayProvider({ children }: Props) {
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <Suspense
        fallback={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        }
      >
        {children}
      </Suspense>
    </RelayEnvironmentProvider>
  );
}
