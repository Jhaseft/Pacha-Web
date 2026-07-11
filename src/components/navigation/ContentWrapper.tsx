'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isAppRoute } from '@/lib/isAppRoute';
import { ReactNode } from 'react';

export default function ContentWrapper({ children }: { children: ReactNode }) {
  const { user, isHydrated } = useAuth();
  const pathname = usePathname();

  // El margen del sidebar y el padding del bottom-nav solo aplican en las
  // rutas de app con sesión; en la landing el contenido va a ancho completo.
  const showAppChrome = isHydrated && !!user && isAppRoute(pathname);

  return (
    <div className={`flex-1 ${showAppChrome ? 'md:ml-64 pb-20 md:pb-0' : ''}`}>
      {children}
    </div>
  );
}
