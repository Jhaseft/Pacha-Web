// Menú de navegación de la landing (mismo del mockup MonetizaLab).
// Fuente única — se usa en el Navbar (escritorio) y en el MobileMenu.
// Cada pestaña es una página real dentro de /src/app.
export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Creadores", href: "/creadores" },
  { label: "Categorías", href: "/categorias" },
  { label: "Funciones", href: "/funciones" },
  { label: "Cómo funciona", href: "/como-funciona" },
 // { label: "Blog", href: "/blog" },
] as const;
