// Colores oficiales MonetizaLab — espejo de las variables CSS en globals.css.
// Úsalo cuando necesites el hex crudo (gradientes, SVG, canvas). Para estilos
// normales prefiere las clases de Tailwind: bg-primary, text-secondary, etc.
export const colors = {
  primary: "#132673", // Azul
  purple: "#a844f2", // Morado
  secondary: "#f03eb3", // Rosado
  dark: "#000000", // Negro
  surface: {
    DEFAULT: "#0a0613", // fondo de pantalla
    card: "#150a24", // tarjetas / paneles
    border: "#2a1a45", // bordes sutiles
  },
} as const;

export default colors;
