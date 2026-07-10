'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
    { name: 'dashboard/messages', title: 'Chat', icon: MessageCircle },
    { name: 'dashboard/profile', title: 'Perfil', icon: User },
  ],
  USER: [
    { name: 'dashboard', title: 'Inicio', icon: Home },
    { name: 'dashboard/messages', title: 'Chats', icon: MessageCircle },
    { name: 'dashboard/credits', title: 'Créditos', icon: Gem },
    { name: 'dashboard/profile', title: 'Perfil', icon: User },
  ],
  ADMIN: [
    { name: 'admin', title: 'Inicio', icon: Home },
    { name: 'admin/clientes', title: 'Clientes', icon: User },
    { name: 'admin/anfitrionas', title: 'Anfitrionas', icon: MessageCircle },
    { name: 'admin/packages', title: 'Paquetes', icon: Gem },
  ],
};

const activeColor: Record<Role, string> = {
  ANFITRIONA: '#f03eb3',
  USER: '#f03eb3',
  ADMIN: '#f03eb3',
};

export default function BottomNav() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const role = (user.role as Role) || 'USER';
  const tabs = tabsByRole[role];
  const color = activeColor[role];

  const isActive = (tabName: string) => {
    if (tabName === 'dashboard' || tabName === 'admin') {
      return pathname === `/${tabName}` || pathname.startsWith(`/${tabName}/`) && !tabs.some(t => t.name !== tabName && pathname.includes(t.name));
    }
    return pathname.includes(tabName);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 flex md:hidden">
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
              {/* Top indicator */}
              {active && (
                <div
                  className="absolute top-0 w-7 h-0.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}

              {/* Icon with glow */}
              <div
                className={`transition-all ${
                  active ? 'drop-shadow-lg' : ''
                }`}
                style={
                  active
                    ? {
                        filter: `drop-shadow(0 0 8px ${color})`,
                      }
                    : undefined
                }
              >
                <Icon
                  size={26}
                  color={active ? color : 'rgba(255,255,255,0.45)'}
                />
              </div>

              {/* Label */}
              <span
                className={`text-xs mt-1 font-${active ? 'bold' : 'normal'} transition-all`}
                style={{
                  color: active ? color : 'rgba(255,255,255,0.45)',
                  textShadow: active ? `0 0 8px ${color}` : 'none',
                }}
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
