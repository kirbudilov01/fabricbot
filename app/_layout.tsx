// app/_layout.tsx
import { Slot } from "expo-router";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fabricbot-backend1.vercel.app";

function getInitDataFromUrl() {
  const u = new URL(window.location.href);
  return u.searchParams.get("initData") || u.searchParams.get("tgWebAppData") || "";
}

function getInitData() {
  // @ts-ignore
  const tg = typeof window !== "undefined" ? (window as any).Telegram?.WebApp : undefined;
  if (tg?.initDataUnsafe && tg?.initData) return tg.initData as string; // из Telegram
  return getInitDataFromUrl(); // из URL (?initData=...)
}

async function loginWithTelegram(initData: string) {
  if (!initData) throw new Error("no initData");
  const r = await fetch(`${API_URL}/api/auth/telegram`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-InitData": initData,
    },
    body: JSON.stringify({}),
  });
  if (!r.ok) throw new Error(`auth failed: ${r.status}`);
  return r.json();
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const initData = getInitData();
        const data = await loginWithTelegram(initData);
        setUser(data?.user || data);
      } catch (e: any) {
        setError(e?.message || "auth error");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) return <div style={{ padding: 16 }}>загрузка…</div>;
  if (error) return <div style={{ padding: 16 }}>ошибка: {error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12, opacity: 0.8 }}>
        {user ? (
          <div>вошли как <b>{user.first_name || user.name || "user"}</b> (tg_id: {user.telegram_id || user.id})</div>
        ) : (
          <div>юзер не получен</div>
        )}
      </div>
      <Slot />
    </div>
  );
}
