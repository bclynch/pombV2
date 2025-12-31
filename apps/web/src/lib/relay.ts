import { createRelayEnvironment } from "@pomb/common/relay-environment";
import { supabase } from "./supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const relayEnvironment = createRelayEnvironment({
  supabaseUrl,
  supabaseAnonKey,
  getAccessToken: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  },
});
