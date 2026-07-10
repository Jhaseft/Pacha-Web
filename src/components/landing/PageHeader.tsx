// Encabezado reutilizable de las páginas internas: píldora + título + bajada.
// `title` acepta ReactNode para resaltar palabras con <span className="text-brand">.
export function PageHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <div className="relative text-center max-w-3xl mx-auto pt-32 mb-16 px-5">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-96 h-72 bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <span className="relative inline-block bg-brand-soft text-brand text-xs font-bold uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
        {badge}
      </span>
      <h1 className="relative text-ink text-4xl sm:text-5xl font-black tracking-tight mb-4">{title}</h1>
      <p className="relative text-ink-soft text-lg leading-relaxed">{subtitle}</p>
    </div>
  );
}
