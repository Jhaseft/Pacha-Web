'use client';

import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';

export default function SidebarWrapper() {
  const { user, isHydrated } = useAuth();
  const isAuthenticated = isHydrated && user;

  if (!isAuthenticated) return null;

  return <Sidebar />;
}
