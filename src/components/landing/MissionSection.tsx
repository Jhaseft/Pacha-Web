import { ImageSlot } from "./ImageSlot";
import { CtaBanner } from "./CtaBanner";

// ▸ TU imagen (collage de personas / creadores) para esta sección.
const IMAGEN_MISION = "https://res.cloudinary.com/dnbklbswg/image/upload/v1776099177/main-sample.png";

const VALORES = [
  { title: "Creadores primero", desc: "Ponemos las necesidades reales de los creadores en el centro de cada decisión.", icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" },
  { title: "Innovación constante", desc: "Mejoramos día a día para ofrecer la mejor experiencia y más oportunidades.", icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" },
  { title: "Confianza y seguridad", desc: "Protegemos la privacidad y los datos de creadores y usuarios.", icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" },
  { title: "Comunidad", desc: "Fortalecemos conexiones auténticas entre creadores y seguidores.", icon: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" },
];

export function MissionSection() {
  return (
    <section className="relative py-24 px-5 sm:px-8 lg:px-20 xl:px-32 bg-canvas-alt overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-14">

        {/* Izquierda — texto */}
        <div className="flex-1">
          <span className="inline-block bg-brand-soft text-brand text-xs font-bold uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
            Nuestra misión
          </span>
          <h2 className="text-ink text-4xl sm:text-5xl font-black tracking-tight mb-6">Nuestra misión</h2>
          <div className="w-14 h-1 rounded-full bg-brand mb-6" />
          <p className="text-ink text-2xl sm:text-3xl font-bold leading-snug max-w-xl mb-5">
            Empoderar a los creadores de contenido para que{" "}
            <span className="text-brand">conviertan su comunidad</span> en una fuente de{" "}
            <span className="text-brand">ingresos sostenible</span> mediante herramientas simples,
            tecnología y experiencias que conecten directamente con sus seguidores.
          </p>
          <p className="text-ink-soft text-base leading-relaxed max-w-xl">
            Creemos en el talento, en la creatividad y en el poder de las comunidades. Por eso, construimos
            soluciones innovadoras que abren oportunidades y transforman pasiones en negocios reales.
          </p>
        </div>

        {/* Derecha — collage de personas + tarjeta "Nuestro propósito" */}
        <div className="flex-1 flex justify-center w-full">
          <div className="relative w-full max-w-md">
            <ImageSlot src={IMAGEN_MISION} alt="Creadores de contenido" ratio="aspect-4/3" note="Aquí va el collage de personas" />

            {/* Tarjeta de propósito */}
            <div className="absolute -bottom-8 left-4 sm:-left-8 max-w-[16rem] bg-card border border-line rounded-2xl shadow-xl shadow-brand/10 p-5 animate-[float_6s_ease-in-out_infinite]">
              <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>
              </span>
              <h3 className="text-ink font-black text-base mb-1">Nuestro propósito</h3>
              <p className="text-ink-soft text-sm leading-relaxed">
                Creemos que toda comunidad tiene valor y que cada creador merece vivir de su talento.
              </p>
            </div>
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

      <CtaBanner title="Transformamos tu pasión en oportunidades reales." />
    </section>
  );
}
