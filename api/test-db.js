import sb from "./_lib/supabase.js";

export default async function handler(req, res) {
  const { data, error } = await sb
    .from("users")
    .select("id, tg_id, username, display_name, created_at")
    .order("created_at", { ascending: false })
    .limit(7);

  if (error) return res.status(500).json({ ok: false, error: error.message });
  res.status(200).json({ ok: true, rows: data ?? [] });
}
