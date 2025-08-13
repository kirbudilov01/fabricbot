import { useEffect, useState } from "react";
import { CircleUser as UserCircle, Wallet, Briefcase, CreditCard, Bell, Settings, MessageSquare, ExternalLink, CircleAlert as AlertCircle } from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // TODO: сюда позже подставим реальный запрос /api/me
    setUser(null);
  }, []);

  return (
    <div className="p-4 pb-24 max-w-screen-sm mx-auto">
      <header className="flex items-center gap-3 mb-4">
        <UserCircle size={36} />
        <div>
          <div className="text-base font-semibold">{user?.first_name ?? "Профиль"}</div>
          <div className="text-sm text-gray-500">{user?.username ? `@${user.username}` : "не авторизован"}</div>
        </div>
      </header>

      <nav className="grid gap-2">
        <Row icon={<Wallet size={18} />} label="Кошелёк" />
        <Row icon={<Briefcase size={18} />} label="Портфель" />
        <Row icon={<CreditCard size={18} />} label="Карты" />
        <Row icon={<Bell size={18} />} label="Уведомления" />
        <Row icon={<Settings size={18} />} label="Настройки" />
        <Row icon={<MessageSquare size={18} />} label="Поддержка" />
        <Row icon={<ExternalLink size={18} />} label="О проекте" />
        <Row icon={<AlertCircle size={18} />} label="Правила" />
      </nav>
    </div>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-xl border hover:bg-gray-50 text-left">
      <span className="shrink-0">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}
