'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isAppRoute } from '@/lib/isAppRoute';
import Sidebar from './Sidebar';

export default function SidebarWrapper() {
  const { user, isHydrated } = useAuth();
  const pathname = usePathname();

  // Solo en rutas de app y con sesión iniciada.
  if (!(isHydrated && user) || !isAppRoute(pathname)) return null;

  return <Sidebar />;
}
