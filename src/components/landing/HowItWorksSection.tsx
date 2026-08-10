import { PageHeader } from "./PageHeader";
import { ImageSlot } from "./ImageSlot";
import { CtaBanner } from "./CtaBanner";

// ▸ Pon la captura/mockup de cada paso en `img` (opcional).
const STEPS = [
  { n: "1", title: "Crea tu cuenta", desc: "Regístrate en segundos y comienza tu viaje como creador.", img: "https://res.cloudinary.com/dcyx3nqj5/image/upload/v1785383115/WhatsApp_Image_2026-07-29_at_11.27.47_PM_uol2kd.jpg" },
  { n: "2", title: "Personaliza tu perfil", desc: "Agrega tu foto, biografía, redes y métodos de pago.", img: "https://res.cloudinary.com/dcyx3nqj5/image/upload/v1785383122/Gemini_Generated_Image_adjk9eadjk9eadjk_ctaedu.png" },
  { n: "3", title: "Obtén tu enlace único", desc: "Te damos un enlace personalizado listo para compartir.", img: "https://res.cloudinary.com/dcyx3nqj5/image/upload/v1785383123/Gemini_Generated_Image_tqfxvftqfxvftqfx_dtvq74.png" },
  { n: "4", title: "Compártelo con tu comunidad", desc: "Ponlo en tu bio, stories, posts o donde quieras.", img: "https://res.cloudinary.com/dcyx3nqj5/image/upload/v1785383131/Gemini_Generated_Image_lsikpjlsikpjlsik_cm0iy5.png" },
  { n: "5", title: "Comienza a monetizar", desc: "Chatea, llama, haz videollamadas, ofrece contenido y gana.", img: "https://res.cloudinary.com/dcyx3nqj5/image/upload/v1785383127/Gemini_Generated_Image_wdrqbewdrqbewdrq_el7rs7.png" },
];

export function HowItWorksSection() {
  return (
    <section className="px-5 sm:px-8 lg:px-16 xl:px-24 pb-24">
      <PageHeader
        badge="¿Cómo funciona?"
        title={<>Empieza en minutos. <span className="text-brand">Monetiza para siempre.</span></>}
        subtitle="MonetizaLab te da todo lo que necesitas para conectar con tu comunidad y convertir cada interacción en ingresos."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {STEPS.map((s, i) => (
          <div key={s.n} className="relative flex flex-col">
            {/* Flecha conectora (escritorio) */}
            {i < STEPS.length - 1 && (
              <svg className="hidden lg:block absolute top-16 -right-4 w-8 h-8 text-brand/40 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            )}

            <div className="bg-card border border-line rounded-3xl p-4 h-full flex flex-col hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 transition-all">
              <span className="w-9 h-9 rounded-2xl bg-linear-to-br from-brand to-brand-violet text-white font-black text-sm flex items-center justify-center mb-4 shadow-lg shadow-brand/25">
                {s.n}
              </span>
              <div className="mb-4">
                <ImageSlot src={s.img} alt={s.title} ratio="aspect-3/4" note="Mockup" />
              </div>
              <h3 className="text-ink font-black text-base mb-1.5">{s.title}</h3>
              <p className="text-ink-soft text-sm leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <CtaBanner
          title="Tu comunidad está lista. Tú también deberías estarlo."
          subtitle="Únete a miles de creadores que ya se están monetizando con su contenido todos los días."
        />
      </div>
    </section>
  );
}
