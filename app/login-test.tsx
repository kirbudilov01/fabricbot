import { useEffect, useState } from "react";
const API = "https://fabricbot-backend1.vercel.app";

function getInitData(): string {
  if (typeof window === "undefined") return "";
  const tg = (window as any)?.Telegram?.WebApp;
  if (tg?.initData) return tg.initData;
  return new URLSearchParams(window.location.search).get("initData") || "";
}

export default function LoginTest() {
  const [hasTG, setHasTG] = useState(false);
  const [initLen, setInitLen] = useState(0);
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp;
    setHasTG(!!tg);
    setInitLen(getInitData().length);
  }, []);

  const send = async () => {
    try {
      setErr(null); setResp(null);
      const initData = getInitData();
      if (!initData) throw new Error("initData пустой. Открой через Telegram или добавь ?initData=...");
      const r = await fetch(`${API}/api/auth/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData })
      });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "auth failed");
      setResp(j);
    } catch (e:any) { setErr(e.message || String(e)); }
  };

  return (
    <div style={{ padding:16, fontFamily:"system-ui, Arial" }}>
      <h2>Login Test</h2>
      <div>Telegram WebApp detected: <b>{hasTG ? "YES" : "NO"}</b></div>
      <div>initData length: <b>{initLen}</b></div>
      <button onClick={send} style={{ marginTop:12 }}>Отправить initData на бэкенд</button>
      {err && <pre style={{ background:"#c62828", color:"#fff", padding:8, marginTop:12 }}>{err}</pre>}
      {resp && <pre style={{ background:"#f5f5f5", padding:8, marginTop:12 }}>{JSON.stringify(resp, null, 2)}</pre>}
      <p style={{ marginTop:12, color:"#666" }}>
        В браузере можно передать ?initData=... в URL (скопируй из Telegram).
      </p>
    </div>
  );
}
