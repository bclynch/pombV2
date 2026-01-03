import {
  Environment,
  Network,
  RecordSource,
  Store,
  type FetchFunction,
  type GraphQLResponse,
} from "relay-runtime";

export type RelayConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  getAccessToken?: () => Promise<string | null>;
};

export function createRelayEnvironment(config: RelayConfig): Environment {
  const fetchFn: FetchFunction = async (request, variables) => {
    const accessToken = config.getAccessToken
      ? await config.getAccessToken()
      : null;

    const response = await fetch(`${config.supabaseUrl}/graphql/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.supabaseAnonKey,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({
        query: request.text,
        variables,
      }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
    }

    return json as GraphQLResponse;
  };

  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}
