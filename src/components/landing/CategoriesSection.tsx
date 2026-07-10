import { PageHeader } from "./PageHeader";
import { CtaBanner } from "./CtaBanner";

// ▸ Pon la URL de la imagen (persona) de cada categoría en `img`.
const CATEGORIES = [
  { name: "Lifestyle", desc: "Inspiración diaria, vlogs y momentos reales.", count: "+2.3K", color: "#a855f7", img: "", icon: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" },
  { name: "Fitness", desc: "Entrenamiento, nutrición y vida saludable.", count: "+1.8K", color: "#22c55e", img: "", icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" },
  { name: "Música", desc: "Cantantes, músicos y talento en vivo.", count: "+1.2K", color: "#ec4899", img: "", icon: "M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163V4.883a.75.75 0 0 0-.947-.723L9.75 6.416a.75.75 0 0 0-.55.723v9.246m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 16.412Z" },
  { name: "Gaming", desc: "Gamers, streams y contenido épico.", count: "+2.1K", color: "#3b82f6", img: "", icon: "M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
  { name: "Educación", desc: "Aprende algo nuevo cada día.", count: "+1.6K", color: "#f97316", img: "", icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" },
  { name: "Belleza", desc: "Tips, maquillaje, skincare y más.", count: "+1.9K", color: "#f43f5e", img: "", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" },
  { name: "Moda", desc: "Estilo, tendencias y outfits únicos.", count: "+1.4K", color: "#8b5cf6", img: "", icon: "M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" },
  { name: "Negocios", desc: "Emprendimiento, finanzas y productividad.", count: "+1.3K", color: "#10b981", img: "", icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" },
  { name: "Viajes", desc: "Descubre lugares increíbles.", count: "+1.1K", color: "#06b6d4", img: "", icon: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" },
  { name: "Tecnología", desc: "Gadgets, reviews y novedades tech.", count: "+1.5K", color: "#6366f1", img: "", icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" },
  { name: "Salud", desc: "Bienestar físico y mental.", count: "+1.7K", color: "#ef4444", img: "", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" },
  { name: "Humor", desc: "Risas, comedia y buen ambiente.", count: "+2K", color: "#eab308", img: "", icon: "M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" },
];

export function CategoriesSection() {
  return (
    <section className="px-5 sm:px-8 lg:px-20 xl:px-32 pb-24">
      <PageHeader
        badge="Categorías"
        title={<>Explora creadores <span className="text-brand">por categoría</span></>}
        subtitle="Encuentra creadores de contenido en diferentes categorías. Conecta con quienes más te inspiran y disfruta de contenido único."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {CATEGORIES.map((c) => (
          <div key={c.name} className="bg-card border border-line rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-brand/10 hover:border-brand/40 transition-all group">
            {/* Imagen (persona) — la pones tú en `img` */}
            <div className="relative aspect-4/3 overflow-hidden" style={{ backgroundColor: `${c.color}1a` }}>
              {c.img ? (
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-14 h-14" style={{ color: c.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                  </svg>
                </div>
              )}
              <span className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-sm" style={{ color: c.color, backgroundColor: `${c.color}33` }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                </svg>
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-ink font-black text-base">{c.name}</h3>
                <span className="shrink-0 inline-flex items-center gap-1 text-brand text-[11px] font-bold bg-brand-soft rounded-full px-2 py-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" /></svg>
                  {c.count} creadores
                </span>
              </div>
              <p className="text-ink-soft text-sm leading-relaxed">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <CtaBanner
          title="¿No encuentras tu categoría? Únete y sé parte de MonetizaLab."
          subtitle="Miles de creadores ya están monetizando su contenido."
        />
      </div>
    </section>
  );
}
