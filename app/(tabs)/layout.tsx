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
      {/* Main content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom navigation - always visible */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 shadow-lg">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex flex-col items-center py-2 px-3 rounded-lg transition-colors text-xs min-w-0",
                  active 
                    ? "text-primary-600 bg-primary-50 font-semibold" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon size={20} className="mb-1 flex-shrink-0" />
                <span className="text-xs truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}