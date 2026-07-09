import { FloatingCard } from "./FloatingCard";
import { ImageSlot } from "./ImageSlot";

// ▸ TU imagen del teléfono para esta sección.
const IMAGEN_QUE_ES = "https://res.cloudinary.com/dnbklbswg/image/upload/v1783607224/Dise%C3%B1o_sin_t%C3%ADtulo_15_sjxmte.png";

const FEATURES = [
  {
    title: "Tu enlace, tu comunidad",
    desc: "Obtén un enlace único que puedes compartir en tus redes sociales, historias, bio o donde quieras.",
    icon: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244",
  },
  {
    title: "Conecta sin intermediarios",
    desc: "Habla, llama y haz videollamadas con tus seguidores de manera segura y privada.",
    icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z",
  },
  {
    title: "Monetiza a tu manera",
    desc: "Ofrece contenido exclusivo, suscripciones y más. Tú decides tus precios y tus reglas.",
    icon: "M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    title: "Tú tienes el control",
    desc: "Mide tus resultados, conoce a tu audiencia y haz crecer tu negocio.",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  },
];

const CARDS = [
  { value: "Miles de creadores", label: "monetizan su comunidad", pos: "top-4 -right-2 sm:-right-12" },
  { value: "Millones de conexiones", label: "entre creadores y seguidores", pos: "top-1/2 -translate-y-1/2 -right-2 sm:-right-16" },
  { value: "Ingresos reales", label: "por cada interacción, llamada o suscripción", pos: "bottom-6 -right-2 sm:-right-10" },
];

export function WhatIsSection() {
  return (
    <section id="funciones" className="relative py-24 px-5 sm:px-8 lg:px-20 xl:px-32 bg-canvas overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-14">

        {/* Izquierda — texto + features */}
        <div className="flex-1 order-2 lg:order-1">
          <span className="inline-block bg-brand-soft text-brand text-xs font-bold uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
            ¿Qué es MonetizaLab?
          </span>
          <h2 className="text-ink text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-5 max-w-xl">
            Una plataforma creada para que los creadores{" "}
            <span className="text-brand">moneticen su comunidad.</span>
          </h2>
          <p className="text-ink-soft text-lg leading-relaxed max-w-xl mb-8">
            MonetizaLab es el puente entre creadores y seguidores. Te damos las herramientas para que puedas conectar
            de forma directa, ofrecer experiencias exclusivas y convertir cada interacción en ingresos reales.
          </p>

          <div className="flex flex-col gap-6 max-w-xl">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <span className="w-11 h-11 shrink-0 rounded-xl bg-brand-soft border border-brand/15 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </span>
                <div>
                  <h3 className="text-ink font-black text-base mb-1">{f.title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Derecha — imagen del teléfono + tarjetas flotantes */}
        <div className="flex-1 order-1 lg:order-2 flex justify-center w-full">
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <ImageSlot src={IMAGEN_QUE_ES} alt="Perfil de creador en MonetizaLab" note="Aquí va la imagen del teléfono" />
            {CARDS.map((c) => (
              <FloatingCard
                key={c.value}
                value={c.value}
                label={c.label}
                className={c.pos}
                icon={
                  <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
