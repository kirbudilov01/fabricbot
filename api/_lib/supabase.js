import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables");
}

const sb = createClient(url, key, {
  auth: { persistSession: false },
  global: { headers: { "X-Client-Info": "fbc-backend" } }
});

export default sb;
