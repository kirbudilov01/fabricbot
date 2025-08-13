// app/(tabs)/account.tsx
"use client";

import { useState } from "react";
import { CircleUser as UserCircle, Wallet, Briefcase, CreditCard, Bell, Settings, MessageSquare, ExternalLink, CircleAlert as AlertCircle } from "lucide-react";

export default function AccountPage() {
  const [notifications, setNotifications] = useState({ deals: true, payouts: false });

  return (
    <div className="p-4 pb-24 max-w-screen-sm mx-auto" data-id="tab-account">
      <header className="flex items-center gap-3 mb-4">
        <img
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
          alt="avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <div className="text-base font-semibold" data-id="account-name">Your Own</div>
          <div className="text-sm text-blue-500">@your_username</div>
          <div className="text-xs text-gray-500">ID: 123456789</div>
        </div>
      </header>

      <section className="bg-white rounded-2xl p-5 shadow mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Wallet size={24} className="text-sky-600" />
          <div className="text-lg font-semibold">Telegram Wallet</div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-red-500 font-semibold" data-id="wallet-address">not connected</span>
        </div>
        <p className="text-sm text-gray-600">Connection will be enabled at the next stage</p>
        <button className="mt-3 bg-blue-500 text-white rounded-lg px-4 py-2" data-id="btn-connect-wallet">
          Connect Wallet
        </button>
      </section>

      <nav className="grid gap-3 mb-6">
        <Row icon={<Briefcase size={20} className="text-gray-400" />} title="Projects & History" subtitle="List of deals and projects" disabled />
        <Row icon={<CreditCard size={20} className="text-gray-400" />} title="Withdrawal Method" subtitle="Payment details" action="Change" disabled />
        <div className="bg-white rounded-2xl p-5 shadow">
          <div className="flex items-center gap-3 mb-3">
            <Bell size={20} className="text-gray-400" />
            <div className="font-semibold text-gray-400">Notifications</div>
          </div>
          <ToggleRow
            label="Deal Events"
            value={notifications.deals}
            onChange={(v) => setNotifications({ ...notifications, deals: v })}
            disabled
          />
          <ToggleRow
            label="Payouts"
            value={notifications.payouts}
            onChange={(v) => setNotifications({ ...notifications, payouts: v })}
            disabled
          />
        </div>
      </nav>

      <button className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-400 rounded-xl py-4 mb-4" disabled>
        <Settings size={18} />
        <span className="font-semibold">Page Setup</span>
      </button>

      <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded-xl py-4 mb-8" data-id="btn-become-partner">
        <UserCircle size={18} />
        <span className="font-semibold">Become Our Partner</span>
      </button>

      <footer className="flex flex-col items-center gap-4 pt-6 border-t text-gray-500">
        <div className="font-semibold">@your_username</div>
        <button className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow text-gray-400" disabled>
          <MessageSquare size={16} />
          <span className="font-semibold">Support</span>
        </button>
      </footer>
    </div>
  );
}

function Row({
  icon,
  title,
  subtitle,
  action,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow flex items-center justify-between min-h-[76px] ${disabled ? "bg-gray-50 shadow-sm" : ""}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full grid place-items-center">{icon}</div>
        <div>
          <div className={`text-sm font-bold ${disabled ? "text-gray-400" : "text-gray-800"}`}>{title}</div>
          <div className={`text-sm ${disabled ? "text-gray-300" : "text-gray-600"}`}>{subtitle}</div>
        </div>
      </div>
      {action && (
        <button className={`px-4 py-2 rounded-lg text-sm font-semibold ${disabled ? "bg-gray-100 text-gray-300" : "bg-blue-50 text-blue-600"}`} disabled={disabled}>
          {action}
        </button>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`text-sm ${disabled ? "text-gray-300" : "text-gray-800"}`}>{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-5 w-5"
      />
    </div>
  );
}

