import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { S3Client, PutObjectCommand } from "https://esm.sh/@aws-sdk/client-s3@3.529.1";
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner@3.529.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { filename, fileType, tripId } = await req.json();

    if (!filename || !tripId) {
      return new Response(
        JSON.stringify({ error: "filename and tripId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get R2 credentials from environment
    const accountId = Deno.env.get("R2_ACCOUNT_ID");
    const accessKeyId = Deno.env.get("R2_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY");
    const bucketName = Deno.env.get("R2_BUCKET_NAME");

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      return new Response(
        JSON.stringify({ error: "R2 credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create S3 client for R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Generate unique file path
    const uuid = crypto.randomUUID();
    const key = `trips/${tripId}/gpx/${uuid}-${filename}`;

    // Create presigned PUT URL (valid for 60 seconds)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType || "application/gpx+xml",
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return new Response(
      JSON.stringify({ uploadUrl, key }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
