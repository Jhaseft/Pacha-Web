// Tarjeta flotante ("mensajito") que se superpone sobre las imágenes del mockup.
// `className` controla la posición (ej. "top-6 -left-4") sobre el contenedor relativo.
export function FloatingCard({
  icon,
  value,
  label,
  className = "",
}: {
  icon?: React.ReactNode;
  value?: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute bg-card border border-line rounded-2xl shadow-xl shadow-brand/10
        px-3.5 py-2.5 flex items-center gap-2.5 animate-[float_5s_ease-in-out_infinite] ${className}`}
    >
      {icon && (
        <span className="w-9 h-9 shrink-0 rounded-xl bg-brand-soft flex items-center justify-center">
          {icon}
        </span>
      )}
      <span className="leading-tight">
        {value && <span className="block text-ink font-black text-sm">{value}</span>}
        <span className="block text-ink-faint text-[11px] leading-snug max-w-[8.5rem]">{label}</span>
      </span>
    </div>
  );
}
