'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  MessageCircle,
  User,
  Gem,
  CircleDollarSign,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Brand } from '@/components/Brand';

type Role = 'ANFITRIONA' | 'USER' | 'ADMIN';

type Tab = { href: string; title: string; icon: typeof Home };

const tabsByRole: Record<Role, Tab[]> = {
  ANFITRIONA: [
    { href: '/dashboard/anfitriona', title: 'Inicio', icon: Home },
    { href: '/dashboard/earnings', title: 'Ganancias', icon: CircleDollarSign },
    { href: '/dashboard/chats', title: 'Chats', icon: MessageCircle },
    { href: '/dashboard/anfitriona/perfil', title: 'Perfil', icon: User },
  ],
  USER: [
    { href: '/dashboard', title: 'Inicio', icon: Home },
    { href: '/dashboard/chats', title: 'Chats', icon: MessageCircle },
    { href: '/dashboard/creditos', title: 'Créditos', icon: Gem },
    { href: '/dashboard/perfil', title: 'Perfil', icon: User },
  ],
  ADMIN: [
    { href: '/admin', title: 'Inicio', icon: Home },
    { href: '/admin/clientes', title: 'Clientes', icon: User },
    { href: '/admin/anfitrionas', title: 'Creadores', icon: MessageCircle },
    { href: '/admin/packages', title: 'Paquetes', icon: Gem },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const role = (user.role as Role) || 'USER';
  const tabs = tabsByRole[role];

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Usuario';
  const initials = (user.firstName?.[0] ?? 'U').toUpperCase();
  const roleLabel =
    role === 'ANFITRIONA' ? 'Creador de contenido' : role === 'ADMIN' ? 'Admin' : 'Cliente';

  const isActive = (href: string) => {
    if (href === '/dashboard' || href === '/admin') {
      return pathname === href;
    }
    // For anfitriona routes, check exact match first
    if (href === '/dashboard/anfitriona') {
      return pathname === href;
    }
    // For other routes, match with trailing slash
    return pathname === href || pathname.startsWith(href + '/');
  };


  return (
    <aside className="hidden md:flex fixed top-0 left-0 z-40 h-screen w-64 flex-col border-r border-line bg-card">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-line">
        <Brand />
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-brand-soft text-brand'
                  : 'text-ink-soft hover:bg-canvas-alt hover:text-ink'
              }`}
            >
              <Icon size={20} />
              {tab.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        
      </div>
    </aside>
  );
}
