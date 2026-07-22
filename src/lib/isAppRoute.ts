/**
 * Rutas donde se muestra el "chrome" de la app (Sidebar en PC, BottomNav en
 * móvil y el margen del contenido). El resto — landing y páginas públicas —
 * no debe mostrar la navegación de app aunque el usuario esté logueado.
 *
 * Nota: /admin NO se incluye aquí. El panel de administración tiene su propio
 * layout autónomo (src/app/admin/layout.tsx) con sidebar y menú móvil propios;
 * si se añade, el chrome global se superpone al de admin (doble sidebar).
 */
export function isAppRoute(pathname: string): boolean {
  return pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");
}
