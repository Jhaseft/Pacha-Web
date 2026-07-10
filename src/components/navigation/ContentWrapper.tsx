'use client';

import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';

export default function ContentWrapper({ children }: { children: ReactNode }) {
  const { user, isHydrated } = useAuth();
  const isAuthenticated = isHydrated && user;

  return (
    <div className={`flex-1 ${isAuthenticated ? 'md:ml-64' : ''} pb-20 md:pb-0`}>
      {children}
    </div>
  );
}
