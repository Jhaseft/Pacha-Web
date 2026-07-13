'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isAppRoute } from '@/lib/isAppRoute';
import {
  Home,
  MessageCircle,
  User,
  Gem,
  CircleDollarSign,
} from 'lucide-react';

type Role = 'ANFITRIONA' | 'USER' | 'ADMIN';

const tabsByRole = {
  ANFITRIONA: [
    { name: 'dashboard/anfitriona', title: 'Inicio', icon: Home },
    { name: 'dashboard/earnings', title: 'Ganancias', icon: CircleDollarSign },
    { name: 'dashboard/chats', title: 'Chats', icon: MessageCircle },
    { name: 'dashboard/anfitriona/perfil', title: 'Perfil', icon: User },
  ],
  USER: [
    { name: 'dashboard', title: 'Inicio', icon: Home },
    { name: 'dashboard/chats', title: 'Chats', icon: MessageCircle },
    { name: 'dashboard/creditos', title: 'Créditos', icon: Gem },
    { name: 'dashboard/perfil', title: 'Perfil', icon: User },
  ],
  ADMIN: [
    { name: 'admin', title: 'Inicio', icon: Home },
    { name: 'admin/clientes', title: 'Clientes', icon: User },
    { name: 'admin/anfitrionas', title: 'Anfitrionas', icon: MessageCircle },
    { name: 'admin/packages', title: 'Paquetes', icon: Gem },
  ],
};

export default function BottomNav() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user || !isAppRoute(pathname)) return null;

  const role = (user.role as Role) || 'USER';
  const tabs = tabsByRole[role];

  const isActive = (tabName: string) => {
    if (tabName === 'dashboard' || tabName === 'admin') {
      return pathname === `/${tabName}`;
    }
    return pathname.startsWith(`/${tabName}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-line flex md:hidden">
      <div className="w-full flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.name);

          return (
            <button
              key={tab.name}
              onClick={() => router.push(`/${tab.name}`)}
              className="flex-1 flex flex-col items-center py-3 relative group transition-colors"
            >
              {/* Indicador superior */}
              {active && (
                <div className="absolute top-0 w-7 h-0.5 rounded-full bg-brand" />
              )}

              <Icon size={24} className={active ? 'text-brand' : 'text-ink-faint'} />

              <span
                className={`text-xs mt-1 transition-colors ${
                  active ? 'font-bold text-brand' : 'font-normal text-ink-faint'
                }`}
              >
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
