"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Wallet, Link2, User } from "lucide-react";
import clsx from "clsx";

const tabs = [
  { href: "/", label: "Discover", icon: Home },
  { href: "/clan", label: "Clan", icon: Users },
  { href: "/balance", label: "Balance", icon: Wallet },
  { href: "/links", label: "Setup", icon: Link2 },
  { href: "/account", label: "Profile", icon: User },
];

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="flex-1">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-xs",
                active 
                  ? "text-primary-600 bg-primary-50 font-semibold" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
        </div>
      </nav>
    </div>
  );
