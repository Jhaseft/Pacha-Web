// Sección "¿Cómo registrarte?" — pasos de alta editables en el array PASOS.
const PASOS = [
  {
    step: "01",
    title: "Descarga la app",
    desc: "Descarga el APK de MonetizaLab directamente desde nuestra página. Sin necesidad de Play Store.",
    icon: "M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3",
  },
  {
    step: "02",
    title: "Crea tu cuenta",
    desc: "Regístrate gratis con tu número de celular. Solo necesitas unos minutos.",
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  },
  {
    step: "03",
    title: "Comparte y monetiza",
    desc: "Comparte tu enlace, conéctate con tu comunidad y empieza a generar ingresos reales.",
    icon: "M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z",
  },
];

export function HowToRegisterSection() {
  return (
    <section id="como-funciona" className="py-24 px-5 sm:px-8 bg-canvas-alt">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-3">Proceso simple</p>
          <h2 className="text-ink text-4xl sm:text-5xl font-black tracking-tight">¿Cómo registrarte?</h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-10 bottom-10 w-px bg-linear-to-b from-brand via-brand/30 to-transparent hidden sm:block" />
          <div className="flex flex-col gap-10">
            {PASOS.map((item) => (
              <div key={item.step} className="flex items-start gap-6 group">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-soft border border-brand/20 flex items-center justify-center group-hover:bg-brand/15 transition-colors z-10 relative">
                  <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div className="pt-2">
                  <p className="text-brand text-xs font-black uppercase tracking-widest mb-1">Paso {item.step}</p>
                  <h3 className="text-ink text-xl font-black mb-2">{item.title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed max-w-md">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
