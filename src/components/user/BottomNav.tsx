"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Gem, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", title: "Inicio", icon: Home, exact: true },
  { href: "/dashboard/chats", title: "Chats", icon: MessageCircle },
  { href: "/dashboard/creditos", title: "Créditos", icon: Gem },
  { href: "/dashboard/perfil", title: "Perfil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0a0a0a] border-t border-white/[0.06]">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ href, title, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex-1 flex flex-col items-center gap-1 py-2.5 group"
            >
              <span
                className={`absolute top-0 h-0.5 rounded-full bg-secondary transition-all ${
                  active ? "w-7 opacity-100" : "w-0 opacity-0"
                }`}
              />
              <Icon
                size={24}
                className={`transition-colors ${
                  active
                    ? "text-secondary drop-shadow-[0_0_10px_rgba(240,62,179,0.7)]"
                    : "text-white/45 group-hover:text-white/70"
                }`}
              />
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  active ? "text-secondary" : "text-white/40"
                }`}
              >
                {title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
