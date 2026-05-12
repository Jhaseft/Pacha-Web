import Image from "next/image";
import Link from "next/link";

export default function SoyNuevoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logofull.jpeg"
              alt="Pachamama"
              width={36}
              height={36}
              className="rounded-xl object-cover ring-2 ring-[#A11213]/40"
            />
            <div className="leading-tight">
              <p className="text-white font-black text-base tracking-tight hidden sm:block">Pachamama</p>
              <p className="text-white/30 text-[9px] uppercase tracking-widest hidden sm:block">Karaoke Bar · Tarapoto</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-white/70 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
              Iniciar sesión
            </Link>
            <Link href="/login/cliente" className="bg-[#A11213] hover:bg-[#8a0f10] text-white text-sm font-black px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#A11213]/25">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-5 sm:px-8 pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A11213]/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative mb-6 inline-flex items-center gap-2 bg-[#A11213]/15 border border-[#A11213]/30 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A11213] animate-pulse" />
          <span className="text-[#e07070] text-xs font-bold uppercase tracking-widest">Bienvenido a Pachamama</span>
        </div>

        <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
          <span className="text-white">¡Hola, </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A11213] via-[#e03030] to-[#A11213]">nuevo usuario!</span>
        </h1>

        <p className="relative text-white/50 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          Estás a pocos pasos de vivir la mejor experiencia de karaoke y entretenimiento en Tarapoto. Te explicamos cómo empezar.
        </p>

        <Link
          href="/login/cliente"
          className="bg-[#A11213] hover:bg-[#8a0f10] active:scale-95 text-white font-black text-base px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-[#A11213]/40 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          Crear mi cuenta gratis
        </Link>
      </section>

      {/* Formas de pago */}
      <section className="py-14 px-5 sm:px-8 bg-white/2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Sin complicaciones</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight mb-3">Formas de pago</h2>
            <p className="text-white/45 text-sm max-w-md mx-auto leading-relaxed">
              Recarga tus créditos de forma rápida y segura. Mira cómo funciona el proceso de pago.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Video pequeño centrado */}
            <div className="w-full sm:w-64 shrink-0 mx-auto sm:mx-0">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40">
                <div className="absolute inset-0 bg-[#A11213]/5 pointer-events-none z-0" />
                <video
                  src="https://res.cloudinary.com/dai7rtja6/video/upload/v1778618215/PAYPAL_FINAL__ed998e.mp4"
                  controls
                  playsInline
                  className="relative z-10 w-full rounded-2xl"
                >
                  <track kind="captions" />
                </video>
              </div>
            </div>

            {/* Chips informativos en columna */}
            <div className="flex flex-col gap-3 w-full">
              {[
                { label: "Tarjeta de crédito / débito", icon: "💳" },
                { label: "Pago 100% seguro vía Culqi", icon: "🔒" },
                { label: "Acreditación instantánea", icon: "⚡" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-white/60 text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pasos */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Proceso simple</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight">Empieza en 3 pasos</h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-10 bottom-10 w-px bg-gradient-to-b from-[#A11213] via-[#A11213]/30 to-transparent hidden sm:block" />
            <div className="flex flex-col gap-10">
              {[
                {
                  step: "01",
                  title: "Crea tu cuenta",
                  desc: "Regístrate gratis con tu número de celular. Solo necesitas unos minutos y ya podrás explorar todo lo que Pachamama tiene para ti.",
                  cta: { label: "Registrarme ahora", href: "/login/cliente" },
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  ),
                },
                {
                  step: "02",
                  title: "Recarga créditos",
                  desc: "Elige el paquete que más te convenga y paga de forma segura con tu tarjeta de crédito o débito a través de Culqi.",
                  cta: null,
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                  ),
                },
                {
                  step: "03",
                  title: "Conecta y disfruta",
                  desc: "Explora los perfiles de nuestras anfitrionas, chatea, desbloquea fotos y contenido exclusivo, y vive momentos únicos.",
                  cta: null,
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-6 group">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#A11213]/15 border border-[#A11213]/25 flex items-center justify-center group-hover:bg-[#A11213]/25 transition-colors z-10 relative">
                      {item.icon}
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-[#A11213] text-xs font-black uppercase tracking-widest mb-1">Paso {item.step}</p>
                    <h3 className="text-white text-xl font-black mb-2">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed max-w-md mb-3">{item.desc}</p>
                    {item.cta && (
                      <Link href={item.cta.href} className="inline-flex items-center gap-1.5 text-[#A11213] hover:text-[#e03030] text-sm font-bold transition-colors">
                        {item.cta.label}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-5 sm:px-8 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Por qué unirte</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight">¿Qué obtienes?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Registro gratuito",
                desc: "Crear tu cuenta no tiene ningún costo. Empieza a explorar sin compromisos.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
              },
              {
                title: "Anfitrionas exclusivas",
                desc: "Conecta con nuestras anfitrionas en tiempo real. Chatea y vive momentos únicos.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                ),
              },
              {
                title: "Pagos 100% seguros",
                desc: "Todos los pagos se procesan vía Culqi con encriptación SSL. Tus datos siempre protegidos.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                ),
              },
              {
                title: "Disponible 24/7",
                desc: "La plataforma está disponible a cualquier hora desde la web o la app móvil.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
              },
              {
                title: "App móvil gratis",
                desc: "Descarga nuestra app para Android o iOS y lleva Pachamama en tu bolsillo.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" />
                  </svg>
                ),
              },
              {
                title: "Contenido premium",
                desc: "Accede a fotos e historias exclusivas usando tus créditos. Todo en un solo lugar.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/8 rounded-3xl p-7 hover:bg-white/8 hover:border-[#A11213]/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-[#A11213]/15 border border-[#A11213]/20 flex items-center justify-center mb-5 group-hover:bg-[#A11213]/25 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#A11213] via-[#8B0000] to-[#4a0000] rounded-3xl p-10 sm:p-14 text-center">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/20" />
            <div className="relative">
              <Image
                src="/logofull.jpeg"
                alt="Pachamama"
                width={80}
                height={80}
                className="rounded-2xl object-cover mx-auto mb-6 ring-4 ring-white/20 shadow-2xl"
              />
              <h2 className="text-white text-3xl sm:text-5xl font-black mb-4 tracking-tight">
                ¿Listo para empezar?
              </h2>
              <p className="text-red-200/70 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                Crea tu cuenta gratis ahora y descubre todo lo que Pachamama tiene para ti.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/login/cliente"
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#A11213] font-black text-base px-8 py-4 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  Crear cuenta gratis
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto border-2 border-white/30 hover:border-white/60 text-white font-bold text-base px-8 py-4 rounded-2xl transition-all flex items-center justify-center"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
