import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Replace internal Docker URLs with external URLs for client access
function toExternalUrl(url: string): string {
  // Replace internal kong:8000 with external localhost:54321
  return url.replace("http://kong:8000", "http://127.0.0.1:54321");
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role key for storage operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate a signed upload URL for Supabase Storage
    const filePath = `avatars/${userId}.jpg`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("profiles")
      .createSignedUploadUrl(filePath, { upsert: true });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // Get public URL for the file
    const { data: publicUrlData } = supabase
      .storage
      .from("profiles")
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({
        uploadUrl: toExternalUrl(uploadData.signedUrl),
        token: uploadData.token,
        path: uploadData.path,
        publicUrl: toExternalUrl(publicUrlData.publicUrl)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
