import Link from "next/link";
import { RegisterLink } from "@/components/RegisterLink";
import { FloatingCard } from "./FloatingCard";
import { ImageSlot } from "./ImageSlot";

// ▸ TU imagen del teléfono. Deja "" para ver el marcador de posición.
const IMAGEN_HERO = "https://res.cloudinary.com/dnbklbswg/image/upload/v1783607560/Dise%C3%B1o_sin_t%C3%ADtulo_16_dhch1d.png";

// Tarjetas flotantes del hero ("los mensajitos") — mismas del mockup.
const HERO_STATS = [
  {
    value: "+10K",
    label: "Creadores activos",
    pos: "top-6 -left-3 sm:-left-8",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    value: "+2M",
    label: "Conexiones creadas",
    pos: "top-1/3 -right-3 sm:-right-10",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    value: "+5M",
    label: "Ingresos generados",
    pos: "bottom-10 -left-3 sm:-left-12",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

// Íconos para "Comparte tu enlace en:"
const SHARE_ICONS = [
  {
    label: "Instagram",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" /></svg>
    ),
  },
  {
    label: "TikTok",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" /></svg>
    ),
  },
  {
    label: "Facebook",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
    ),
  },
  {
    label: "WhatsApp",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Z" /></svg>
    ),
  },
  {
    label: "Copiar enlace",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
    ),
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center gap-10 px-5 sm:px-8 lg:px-20 xl:px-32 pt-28 pb-20 overflow-hidden">

      {/* Glow de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-brand/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-violet/10 rounded-full blur-[120px]" />
      </div>

      {/* Izquierda — texto */}
      <div className="relative flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 bg-brand-soft border border-brand/15 rounded-full px-4 py-2">
          <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1L12 2Z" /></svg>
          <span className="text-brand text-xs font-semibold tracking-wide">La nueva forma de monetizar tu comunidad</span>
        </div>

        {/* Título */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-5">
          <span className="text-ink">Monetiza tu comunidad.</span>
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand via-brand-violet to-brand-strong">
            Convierte tu audiencia en ingresos.
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-ink-soft text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
          MonetizaLab permite a los creadores conectar directamente con su comunidad mediante un enlace personalizado
          donde sus seguidores pueden chatear, realizar llamadas, videollamadas, suscribirse y acceder a experiencias exclusivas.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-8">
          <RegisterLink className="flex-1 bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand text-white font-black px-6 py-4 rounded-2xl transition-all shadow-xl shadow-brand/30 flex items-center justify-center gap-2.5 active:scale-95">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>
            Quiero ser creador
          </RegisterLink>
          <Link
            href="#creadores"
            className="border border-line hover:border-brand/40 hover:bg-brand-soft text-ink font-bold text-sm px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            Explorar creadores
          </Link>
        </div>

        {/* Comparte tu enlace en */}
        <div className="flex items-center gap-3">
          <span className="text-ink-faint text-sm">Comparte tu enlace en:</span>
          <div className="flex items-center gap-2">
            {SHARE_ICONS.map((s) => (
              <span key={s.label} aria-label={s.label} className="w-8 h-8 rounded-lg bg-card border border-line text-ink-soft flex items-center justify-center hover:text-brand hover:border-brand/40 transition-all">
                {s.icon}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Derecha — imagen del teléfono + tarjetas flotantes */}
      <div className="relative flex-1 flex justify-center lg:justify-end z-10 w-full">
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <ImageSlot src={IMAGEN_HERO} alt="App MonetizaLab" note="Aquí va la imagen del teléfono" />

          {HERO_STATS.map((stat) => (
            <FloatingCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} className={stat.pos} />
          ))}

          {/* Flechita decorativa */}
          <svg className="absolute -bottom-6 -right-4 w-16 h-16 text-brand/50 hidden sm:block" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M8 20 C 30 8, 52 20, 50 48" />
            <path d="M40 42 L 50 50 L 58 40" />
          </svg>
        </div>
      </div>
    </section>
  );
}
