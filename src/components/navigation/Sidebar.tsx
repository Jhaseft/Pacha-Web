'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  MessageCircle,
  User,
  Gem,
  CircleDollarSign,
  LogOut,
  Settings,
} from 'lucide-react';

type Role = 'ANFITRIONA' | 'USER' | 'ADMIN';

const menuByRole = {
  ANFITRIONA: [
    { name: 'dashboard/anfitriona', title: 'Inicio', icon: Home },
    { name: 'dashboard/earnings', title: 'Ganancias', icon: CircleDollarSign },
    { name: 'dashboard/messages', title: 'Mensajes', icon: MessageCircle },
    { name: 'dashboard/profile', title: 'Perfil', icon: User },
    { name: 'dashboard/settings', title: 'Configuración', icon: Settings },
  ],
  USER: [
    { name: 'dashboard', title: 'Inicio', icon: Home },
    { name: 'dashboard/messages', title: 'Mensajes', icon: MessageCircle },
    { name: 'dashboard/credits', title: 'Créditos', icon: Gem },
    { name: 'dashboard/profile', title: 'Perfil', icon: User },
    { name: 'dashboard/settings', title: 'Configuración', icon: Settings },
  ],
  ADMIN: [
    { name: 'admin', title: 'Dashboard', icon: Home },
    { name: 'admin/clientes', title: 'Clientes', icon: User },
    { name: 'admin/anfitrionas', title: 'Anfitrionas', icon: MessageCircle },
    { name: 'admin/packages', title: 'Paquetes', icon: Gem },
    { name: 'admin/settings', title: 'Configuración', icon: Settings },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const role = (user.role as Role) || 'USER';
  const menu = menuByRole[role];

  const isActive = (menuName: string) => {
    if (menuName === 'dashboard' || menuName === 'admin') {
      return pathname === `/${menuName}` || (pathname.startsWith(`/${menuName}/`) && !menu.some(m => m.name !== menuName && pathname.includes(m.name)));
    }
    return pathname.includes(menuName);
  };

  const handleLogout = async () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-black to-gray-950 border-r border-white/10 h-screen fixed left-0 top-0">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Pachamama
          </h1>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.firstName?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {user.firstName}
              </p>
              <p className="text-gray-400 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.name);

            return (
              <button
                key={item.name}
                onClick={() => router.push(`/${item.name}`)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-pink-500 border border-pink-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-all ${
                    active ? 'text-pink-500' : 'group-hover:text-pink-500'
                  }`}
                />
                <span className="font-medium text-sm">{item.title}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-pink-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all group"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </>
  );
}
