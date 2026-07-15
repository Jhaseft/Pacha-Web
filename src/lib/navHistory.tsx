'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Cuenta las navegaciones internas (client-side) que hace la app en esta
// pestaña. Una variable de módulo sobrevive a la navegación SPA de Next pero se
// reinicia en una recarga completa o pestaña nueva. Así distinguimos:
//   - internalNavigations === 0  → el usuario entró directo por la URL (link)
//   - internalNavigations  >  0  → llegó navegando dentro de la app
// document.referrer no sirve para esto: no se actualiza en navegación cliente.
let internalNavigations = 0;

export function hasInternalHistory(): boolean {
  return internalNavigations > 0;
}

/**
 * Se monta una sola vez en el layout raíz. Incrementa el contador en cada
 * cambio de ruta, saltando el montaje inicial (esa "navegación" es la carga del
 * documento, no un movimiento dentro de la app).
 */
export function NavigationTracker() {
  const pathname = usePathname();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    internalNavigations += 1;
  }, [pathname]);

  return null;
}
