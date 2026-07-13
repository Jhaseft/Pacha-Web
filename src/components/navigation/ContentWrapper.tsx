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

  // min-w-0: como flex item, sin esto crece hasta el min-content de la página
  // (p. ej. URLs largas) y desborda el viewport en móvil.
  // bg-canvas: el padding del bottom-nav queda fuera del fondo de la página,
  // así que sin esto asoma el body negro debajo del contenido en móvil.
  return (
    <div className={`flex-1 min-w-0 ${showAppChrome ? 'md:ml-64 pb-20 md:pb-0 bg-canvas' : ''}`}>
      {children}
    </div>
  );
}
