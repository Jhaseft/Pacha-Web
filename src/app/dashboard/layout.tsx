'use client';

import type { ReactNode } from "react";

// El chrome de la app (Sidebar en PC, BottomNav en móvil y el margen del
// contenido) lo monta el layout raíz vía SidebarWrapper/ContentWrapper para
// las rutas de app. Aquí solo fijamos el fondo claro del área de cliente.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-canvas text-ink">{children}</div>;
}
