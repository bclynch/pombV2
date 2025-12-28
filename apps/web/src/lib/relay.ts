import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const fetchFn: FetchFunction = async (request, variables) => {
  const response = await fetch(`${supabaseUrl}/graphql/v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  return response.json();
};

export const relayEnvironment = new Environment({
  network: Network.create(fetchFn),
  store: new Store(new RecordSource()),
});
