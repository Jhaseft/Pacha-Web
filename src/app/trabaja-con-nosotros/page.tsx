import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { NavExplorar } from "@/components/NavExplorar";
import { ChatAsistente } from "@/components/ChatAsistente";

export default function TrabajaConNosotrosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logofull.jpeg"
              alt="Pachamama"
              width={36}
              height={36}
              className="rounded-xl object-cover ring-2 ring-[#A11213]/40"
            />
            <div className="leading-tight">
              <p className="text-white font-black text-base tracking-tight hidden sm:block">Pachamama</p>
              <p className="text-white/30 text-[9px] uppercase tracking-widest hidden sm:block">Bar · Tarapoto</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <NavExplorar base="/" />
            <Link href="/soy-nuevo" className="hover:text-white transition-colors">Soy nuevo</Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className="text-white/70 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
              Iniciar sesión
            </Link>
            <Link href="/login/cliente" className="bg-[#A11213] hover:bg-[#8a0f10] text-white text-sm font-black px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#A11213]/25">
              Registrarse
            </Link>
          </div>
          <MobileMenu />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-5 sm:px-8 pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A11213]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#A11213]/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative mb-6 inline-flex items-center gap-2 bg-[#A11213]/15 border border-[#A11213]/30 rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A11213] animate-pulse" />
          <span className="text-[#e07070] text-xs font-bold uppercase tracking-widest">Únete al equipo</span>
        </div>

        <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
          <span className="text-white">Trabaja con </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A11213] via-[#e03030] to-[#A11213]">nosotros</span>
        </h1>

        <p className="relative text-white/50 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          Forma parte del equipo de creadoras de Pachamama. Gana dinero desde tu celular, con horarios flexibles y total libertad.
        </p>

        <a
          href="https://wa.me/51933453022?text=Hola,%20me%20interesa%20trabajar%20como%20anfitriona%20en%20Pachamama"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#A11213] hover:bg-[#8a0f10] active:scale-95 text-white font-black text-base px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-[#A11213]/40 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Postular por WhatsApp
        </a>
      </section>

      {/* Video presentación */}
      <section className="py-14 px-5 sm:px-8 bg-white/2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Conócenos mejor</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight mb-3">¿Cómo es trabajar con nosotros?</h2>
            <p className="text-white/45 text-sm max-w-md mx-auto leading-relaxed">
              Mira este video y descubre todo lo que Pachamama tiene para ofrecerte.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-full sm:w-64 shrink-0 mx-auto sm:mx-0">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40">
                <div className="absolute inset-0 bg-[#A11213]/5 pointer-events-none z-0" />
                <video
                  src="https://res.cloudinary.com/dai7rtja6/video/upload/v1778618603/REDUCIDO_vet1gy.mp4"
                  controls
                  playsInline
                  className="relative z-10 w-full rounded-2xl"
                >
                  <track kind="captions" />
                </video>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {[
                { label: "Horarios 100% flexibles", icon: "🕐" },
                { label: "Gana dinero desde tu celular", icon: "💰" },
                { label: "Soporte y acompañamiento constante", icon: "🤝" },
                { label: "Comunidad de creadoras activa", icon: "✨" },
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

      {/* Retiro de dinero */}
      <section className="py-14 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Cobra sin complicaciones</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight mb-3">Retira tu dinero fácilmente</h2>
            <p className="text-white/45 text-sm max-w-md mx-auto leading-relaxed">
              Múltiples métodos de retiro disponibles. Cobra cuando quieras y como prefieras.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-full sm:w-64 shrink-0 mx-auto sm:mx-0">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40">
                <div className="absolute inset-0 bg-[#A11213]/5 pointer-events-none z-0" />
                <video
                  src="https://res.cloudinary.com/dai7rtja6/video/upload/v1778645708/Retiro_De_Dinero_Comprimido_owvcmj.mp4"
                  controls
                  playsInline
                  className="relative z-10 w-full rounded-2xl"
                >
                  <track kind="captions" />
                </video>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {[
                { label: "Transferencia bancaria", icon: "🏦" },
                { label: "Binance", icon: "🟡" },
                { label: "Bybit", icon: "🔵" },
                { label: "PayPal", icon: "💙" },
                { label: "Retiros rápidos y seguros", icon: "⚡" },
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

      {/* Beneficios */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Lo que ofrecemos</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight">Beneficios de ser anfitriona</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Ingresos atractivos",
                desc: "Gana dinero por cada interacción con los usuarios. Tú decides cuánto tiempo dedicar.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
              },
              {
                title: "Horarios flexibles",
                desc: "Trabaja cuando quieras y desde donde quieras. Sin turnos fijos ni compromisos de horas.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
              },
              {
                title: "100% desde tu celular",
                desc: "Todo se maneja a través de la app. Sin necesidad de ir a ningún lugar físico.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" />
                  </svg>
                ),
              },
              {
                title: "Privacidad garantizada",
                desc: "Tu información personal está protegida. Tú controlas qué compartes y con quién.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                ),
              },
              {
                title: "Soporte constante",
                desc: "Nuestro equipo está disponible para ayudarte en todo momento. No estarás sola.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                ),
              },
              {
                title: "Comunidad exclusiva",
                desc: "Únete a una comunidad de creadoras que se apoyan mutuamente y comparten experiencias.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
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

      {/* Requisitos */}
      <section className="py-20 px-5 sm:px-8 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">¿Qué necesitas?</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight">Requisitos para postular</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Ser mayor de 18 años",
              "Tener un smartphone con acceso a internet",
              "Ser simpática, carismática y extrovertida",
              "Disponibilidad mínima de 2 horas al día",
              "Tener buena presencia y actitud positiva",
              "Residir en Tarapoto o alrededores",
            ].map((req) => (
              <div key={req} className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl px-5 py-4">
                <div className="w-8 h-8 rounded-xl bg-[#A11213]/15 border border-[#A11213]/25 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-white/70 text-sm">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asistente IA */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Asistente inteligente</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight mb-3">¿Tienes dudas? Pregúntanos</h2>
            <p className="text-white/45 text-sm max-w-md mx-auto leading-relaxed">
              Nuestro asistente con IA responde todas tus preguntas sobre cómo ser anfitriona en Pachamama.
            </p>
          </div>
          <ChatAsistente
            role="anfitriona"
            titulo="Asistente Pachamama"
            subtitulo="Trabaja con nosotros · Creadoras"
            welcomeMessage="¡Hola! 💫 Soy el asistente de Pachamama para anfitrionas. Te puedo explicar cómo funciona la plataforma, cómo crear tu perfil y cómo empezar a generar ingresos. ¿Qué quieres saber?"
            sugerencias={[]}
            embedded
          />
        </div>
      </section>
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Cómo aplicar</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight">Proceso de postulación</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-10 bottom-10 w-px bg-gradient-to-b from-[#A11213] via-[#A11213]/30 to-transparent hidden sm:block" />
            <div className="flex flex-col gap-10">
              {[
                {
                  step: "01",
                  title: "Escríbenos por WhatsApp",
                  desc: "Envíanos un mensaje indicando que quieres ser anfitriona en Pachamama. Responderemos a la brevedad.",
                },
                {
                  step: "02",
                  title: "Entrevista rápida",
                  desc: "Tendremos una breve conversación para conocerte mejor y resolver todas tus dudas.",
                },
                {
                  step: "03",
                  title: "Configuración de perfil",
                  desc: "Nuestro equipo te ayudará a configurar tu perfil y empezar a generar ingresos desde el primer día.",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-6 group">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#A11213]/15 border border-[#A11213]/25 flex items-center justify-center group-hover:bg-[#A11213]/25 transition-colors z-10 relative">
                      <span className="text-[#A11213] font-black text-sm">{item.step}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-white text-xl font-black mb-2">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed max-w-md">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
                ¿Te animas a unirte?
              </h2>
              <p className="text-red-200/70 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                Escríbenos ahora por WhatsApp y empieza a generar ingresos desde hoy mismo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://wa.me/51933453022?text=Hola,%20me%20interesa%20trabajar%20como%20anfitriona%20en%20Pachamama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#A11213] font-black text-base px-8 py-4 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  Postular por WhatsApp
                </a>
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
