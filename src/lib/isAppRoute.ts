/**
 * Rutas donde se muestra el "chrome" de la app (Sidebar en PC, BottomNav en
 * móvil y el margen del contenido). El resto — landing y páginas públicas —
 * no debe mostrar la navegación de app aunque el usuario esté logueado.
 */
export function isAppRoute(pathname: string): boolean {
  return pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    // Galerías del perfil de creador ("Ver todo"): muestran el chrome de app.
    (pathname.startsWith("/anfitrionas/") &&
      (pathname.endsWith("/album") || pathname.endsWith("/desbloquear")));
}
