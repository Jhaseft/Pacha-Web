import { FloatingCard } from "./FloatingCard";
import { ImageSlot } from "./ImageSlot";
import { CtaBanner } from "./CtaBanner";

// ▸ TU imagen del mundo / planeta para esta sección.
const IMAGEN_VISION = " https://res.cloudinary.com/dnbklbswg/image/upload/v1783607364/istockphoto-512882116-170667a_r09h8r.jpg";

const STATS = [
  {
    value: "+10K", label: "Creadores", pos: "top-2 left-1/2 -translate-x-1/2",
    icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
  },
  {
    value: "+20", label: "Países", pos: "top-1/4 -right-2 sm:-right-6",
    icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16.5a3.987 3.987 0 0 0-3.951 3.012A8.949 8.949 0 0 0 12 21Zm3.75-9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z",
  },
  {
    value: "+1M", label: "Usuarios", pos: "bottom-1/4 -left-2 sm:-left-6",
    icon: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  },
  {
    value: "+$$$", label: "Ingresos generados", pos: "bottom-3 left-1/2 -translate-x-1/2",
    icon: "M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
];

const VALORES = [
  { title: "Comunidad global", desc: "Conectamos creadores y usuarios de todo el mundo.", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" },
  { title: "Crecimiento continuo", desc: "Innovamos constantemente para brindar las mejores herramientas.", icon: "M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" },
  { title: "Impacto real", desc: "Generamos oportunidades económicas y transformamos vidas.", icon: "M3.75 13.5 3 21m0 0 7.5-.75M3 21l6.75-6.75m0 0 3.75 3.75m-3.75-3.75L21 3m0 0-5.25.75M21 3l-.75 5.25" },
  { title: "Alianzas estratégicas", desc: "Trabajamos con empresas líderes para potenciar el ecosistema digital.", icon: "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84" },
];

export function VisionSection() {
  return (
    <section className="relative py-24 px-5 sm:px-8 lg:px-20 xl:px-32 bg-canvas overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-14">

        {/* Izquierda — texto */}
        <div className="flex-1">
          <span className="inline-block bg-brand-soft text-brand text-xs font-bold uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
            Nuestra visión
          </span>
          <h2 className="text-ink text-4xl sm:text-5xl font-black tracking-tight mb-6">Nuestra visión</h2>
          <div className="w-14 h-1 rounded-full bg-brand mb-6" />
          <p className="text-ink text-2xl sm:text-3xl font-bold leading-snug max-w-xl mb-5">
            Ser la plataforma <span className="text-brand">líder en Latinoamérica</span> que conecte creadores,
            usuarios y empresas en un ecosistema de <span className="text-brand">monetización</span> basado en resultados.
          </p>
          <p className="text-ink-soft text-base leading-relaxed max-w-xl">
            Imaginamos un futuro donde cualquier creador, sin importar su tamaño, pueda vivir de su pasión y
            construir negocios digitales sostenibles junto a su comunidad.
          </p>
        </div>

        {/* Derecha — mundo + tarjetas flotantes */}
        <div className="flex-1 flex justify-center w-full">
          <div className="relative w-full max-w-sm">
            <ImageSlot src={IMAGEN_VISION} alt="Ecosistema global de MonetizaLab" ratio="aspect-square" note="Aquí va la imagen del mundo" />
            {STATS.map((s) => (
              <FloatingCard
                key={s.label}
                value={s.value}
                label={s.label}
                className={s.pos}
                icon={
                  <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
        {VALORES.map((v) => (
          <div key={v.title}>
            <span className="w-11 h-11 rounded-xl bg-brand-soft border border-brand/15 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={v.icon} /></svg>
            </span>
            <h3 className="text-ink font-black text-base mb-1.5">{v.title}</h3>
            <p className="text-ink-soft text-sm leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <CtaBanner
        title="Visualizamos un mundo donde cada creador puede vivir de su talento y su comunidad lo impulsa."
        subtitle="En MonetizaLab estamos construyendo ese futuro, hoy."
      />
    </section>
  );
}
