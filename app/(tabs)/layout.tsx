// app/_layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Chrome as Home, Users, Wallet, Link2, Crown } from "lucide-react";
import clsx from "clsx";

const tabs = [
  { href: "/", label: "Discover", icon: Home },
  { href: "/clan", label: "Clan", icon: Users },
  { href: "/balance", label: "Balance", icon: Wallet },
  { href: "/links", label: "Setup", icon: Link2 },
  { href: "/account", label: "Profile", icon: Crown },
];

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 flex justify-around bg-white border-t p-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center text-sm",
                active ? "text-blue-500 font-bold" : "text-gray-500"
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
