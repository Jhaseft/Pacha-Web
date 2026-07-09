import Link from "next/link";
import { PageHeader } from "./PageHeader";
import { ImageSlot } from "./ImageSlot";
import { CtaBanner } from "./CtaBanner";

// Página inventada (no venía en los mockups). Pon las portadas en `img`.
const POSTS = [
  { title: "Cómo conseguir tus primeros 1,000 seguidores", excerpt: "Estrategias reales para hacer crecer tu comunidad desde cero, sin gastar en publicidad.", tag: "Crecimiento", date: "8 jul 2026", read: "5 min", img: "" },
  { title: "5 formas de monetizar tu comunidad desde el día uno", excerpt: "Descubre las herramientas que puedes activar hoy para empezar a generar ingresos.", tag: "Monetización", date: "3 jul 2026", read: "6 min", img: "" },
  { title: "Guía para crear un perfil que convierte", excerpt: "Tu perfil es tu carta de presentación. Aprende a optimizarlo para atraer más seguidores.", tag: "Perfil", date: "28 jun 2026", read: "4 min", img: "" },
  { title: "Videollamadas: la nueva forma de conectar con tu audiencia", excerpt: "Por qué las experiencias en vivo son la mejor manera de fidelizar a tu comunidad.", tag: "Funciones", date: "21 jun 2026", read: "7 min", img: "" },
  { title: "¿Cuánto cobrar por tu contenido exclusivo?", excerpt: "Una guía práctica para poner precios justos que tu audiencia esté dispuesta a pagar.", tag: "Estrategia", date: "15 jun 2026", read: "5 min", img: "" },
  { title: "Historias de creadores que viven de su pasión", excerpt: "Conoce a creadores que transformaron su comunidad en un negocio sostenible.", tag: "Inspiración", date: "9 jun 2026", read: "8 min", img: "" },
];

export function BlogSection() {
  return (
    <section className="px-5 sm:px-8 lg:px-20 xl:px-32 pb-24">
      <PageHeader
        badge="Blog"
        title={<>Aprende a <span className="text-brand">monetizar tu comunidad</span></>}
        subtitle="Guías, consejos y estrategias para crecer como creador y sacar el máximo provecho de MonetizaLab."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {POSTS.map((p) => (
          <Link
            key={p.title}
            href="#"
            className="bg-card border border-line rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-brand/10 hover:border-brand/40 transition-all group flex flex-col"
          >
            <div className="relative overflow-hidden">
              <ImageSlot src={p.img} alt={p.title} ratio="aspect-video" note="Portada" />
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand text-[11px] font-bold rounded-full px-2.5 py-1 shadow-sm">
                {p.tag}
              </span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-ink font-black text-lg leading-snug mb-2 group-hover:text-brand transition-colors">{p.title}</h3>
              <p className="text-ink-soft text-sm leading-relaxed mb-4 flex-1">{p.excerpt}</p>
              <div className="flex items-center gap-2 text-ink-faint text-xs">
                <span>{p.date}</span>
                <span className="w-1 h-1 rounded-full bg-ink-faint/50" />
                <span>{p.read} de lectura</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <CtaBanner
          title="Pon en práctica lo que aprendes y empieza a monetizar."
          subtitle="Crea tu cuenta de creador gratis en MonetizaLab."
        />
      </div>
    </section>
  );
}
