import Link from "next/link";

const LOGO_SRC =
  "https://res.cloudinary.com/dnbklbswg/image/upload/v1783607654/1000040485-removebg-preview_glnmou.png";

/**
 * Marca MonetizaLab (logo + wordmark). Fuente única de verdad para el logo
 * que aparece arriba a la izquierda en la landing, el login y el sidebar.
 */
export function Brand({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`flex items-center gap-2.5 ${className}`}>
      <img src={LOGO_SRC} alt="MonetizaLab" className="w-9 h-9 object-contain" />
      <span className="text-ink font-black text-lg tracking-tight">
        Monetiza<span className="text-brand">Lab</span>
      </span>
    </Link>
  );
}
