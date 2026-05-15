import Image from "next/image";
import Link from "next/link";
import { LandingContactSection } from "@/components/LandingContactSection";
import { AppDownloadButton } from "@/components/AppDownloadButton";
import { MobileMenu } from "@/components/MobileMenu";
import { LandingFooter } from "@/components/LandingFooter";
import { AutoplayVideo } from "@/components/AutoplayVideo";
 
// ── URLs de contenido — pon tus links aquí ───────────────────────────────────
const IMAGEN_INICIO = "https://res.cloudinary.com/dnbklbswg/image/upload/v1778740935/chicahero_ydkvmr.jpg"; // Link de la imagen del hero (derecha)
const VIDEO_INICIO = "/pacha.mp4"; // Link del video de inicio

// ── Pasos de registro — edita este array para actualizar la sección ──────────
const PASOS_REGISTRO = [
  {
    step: "01",
    title: "Descarga la app",
    desc: "Descarga el APK de Pachamama directamente desde nuestra página. Sin necesidad de Play Store.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Crea tu cuenta",
    desc: "Regístrate gratis con tu número de celular. Solo necesitas unos minutos.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Explora y disfruta",
    desc: "Conéctate con creadoras en vivo, chatea gratis y vive la experiencia completa de Pachamama.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden pb-24 md:pb-0">

      {/* ══════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logofull.jpeg"
              alt="Pachamama"
              width={36}
              height={36}
              style={{ height: "auto" }}
              className="rounded-xl object-cover ring-2 ring-[#A11213]/40"
            />
            <div className="leading-tight">
              <p className="text-white font-black text-base tracking-tight hidden sm:block">Pachamama</p>
              <p className="text-white/30 text-[9px] uppercase tracking-widest hidden sm:block">Karaoke Bar · Tarapoto</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors text-white">Inicio</Link>
            <Link href="/soy-nuevo" className="hover:text-white transition-colors">Soy nuevo</Link>
            <Link href="/trabaja-con-nosotros" className="hover:text-white transition-colors">Trabaja con nosotros</Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="text-white/70 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/login/cliente"
              className="bg-[#A11213] hover:bg-[#8a0f10] text-white text-sm font-black px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#A11213]/25"
            >
              Registrarse
            </Link>
          </div>

          <MobileMenu />
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center gap-10 px-5 sm:px-8 lg:px-20 xl:px-32 pt-28 pb-20 overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-125 h-125 bg-[#A11213]/12 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#A11213]/6 rounded-full blur-[100px]" />
          <div className="absolute top-0 right-1/3 w-64 h-64 bg-red-900/6 rounded-full blur-[80px]" />
        </div>

        {/* Left — texto */}
        <div className="relative flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">

          {/* Online badge */}
          <div className="mb-3 inline-flex items-center gap-2.5 bg-white/8 border border-white/12 rounded-full px-4 py-2">
            <div className="flex -space-x-1.5">
              {["V", "C", "D", "M"].map((l) => (
                <div key={l} className="w-6 h-6 rounded-full bg-linear-to-br from-[#A11213] to-[#5a0000] border-2 border-[#0a0a0a] flex items-center justify-center">
                  <span className="text-white text-[8px] font-black">{l}</span>
                </div>
              ))}
            </div>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">24 creadoras online ahora</span>
          </div>

          {/* Social proof stats */}
          <div className="mb-6 flex flex-wrap justify-center lg:justify-start gap-3">
            {[
              { value: "+500", label: "usuarios registrados" },
              { value: "+1,000", label: "descargas" },
            ].map((s) => (
              <div key={s.label} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                <span className="text-[#ff6060] text-xs font-black">{s.value}</span>
                <span className="text-white/50 text-xs">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-5">
            <span className="text-white">Chatea gratis con</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#A11213] via-[#e03030] to-[#ff6060]">
              creadoras en vivo
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/65 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
            Chat gratis, llamadas y videollamadas en vivo. Disfruta contenido exclusivo desde tu celular.
          </p>

          {/* CTA buttons */}
          <div id="hero-cta" className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mb-6">
            <a
              href={process.env.NEXT_PUBLIC_APK_URL}
              download
              className="flex-1 bg-linear-to-r from-[#A11213] to-[#cc2020] hover:from-[#8a0f10] hover:to-[#b01010]
                text-white font-black px-5 py-4 rounded-2xl transition-all
                shadow-2xl shadow-[#A11213]/40 flex items-center justify-center gap-3 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="white">
                <path d="M17.523 15.341a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-11.046 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM2.1 8.4h19.8A1.1 1.1 0 0 1 23 9.5v6a1.1 1.1 0 0 1-1.1 1.1H21v2.65a.75.75 0 0 1-1.5 0V16.6H4.5v2.65a.75.75 0 0 1-1.5 0V16.6h-.9A1.1 1.1 0 0 1 1 15.5v-6A1.1 1.1 0 0 1 2.1 8.4Zm.9 1.5v5h18v-5H3ZM8.22 2.47a.75.75 0 0 1 1.02-.28L12 3.8l2.76-1.61a.75.75 0 1 1 .75 1.3L13.5 4.8V7.4h-3V4.8L8.5 3.49a.75.75 0 0 1-.28-1.02Z" />
              </svg>
              <span className="flex flex-col leading-tight text-left">
                <span className="text-white/70 text-[10px] uppercase tracking-widest leading-none">Descargar app</span>
                <span className="text-base leading-tight">Android .apk</span>
              </span>
            </a>
            <Link
              href="/login/cliente"
              className="border border-white/15 hover:border-white/30 hover:bg-white/5 text-white font-bold text-sm
                px-5 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Crear cuenta
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2">
            {["Seguro y privado", "Crea tu cuenta en segundos", "100% confidencial", "Diversión garantizada"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — imagen */}
        <div className="relative flex-1 flex justify-center lg:justify-end z-10">
          {IMAGEN_INICIO ? (
            <img
              src={IMAGEN_INICIO}
              alt="Pachamama app"
              className="w-full max-w-sm lg:max-w-md rounded-3xl object-cover shadow-2xl"
            />
          ) : (
            <div className="w-full max-w-sm lg:max-w-md aspect-square bg-white/5 border-2 border-dashed border-white/15 rounded-3xl flex flex-col items-center justify-center gap-3 text-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-sm font-medium">Imagen próximamente</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CÓMO REGISTRARTE
      ══════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 bg-white/2">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Proceso simple</p>
            <h2 className="text-white text-4xl sm:text-5xl font-black tracking-tight">
              ¿Cómo registrarte?
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-10 bottom-10 w-px bg-linear-to-b from-[#A11213] via-[#A11213]/30 to-transparent hidden sm:block" />
            <div className="flex flex-col gap-10">
              {PASOS_REGISTRO.map((item) => (
                <div key={item.step} className="flex items-start gap-6 group">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#A11213]/15 border border-[#A11213]/25 flex items-center justify-center group-hover:bg-[#A11213]/25 transition-colors z-10 relative">
                      {item.icon}
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-[#A11213] text-xs font-black uppercase tracking-widest mb-1">Paso {item.step}</p>
                    <h3 className="text-white text-xl font-black mb-2">{item.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed max-w-md">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VIDEO
      ══════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-xs mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Para nuevos usuarios</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight">
              Así funciona la app
            </h2>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40 bg-black/50">
            {VIDEO_INICIO ? (
              <AutoplayVideo src={VIDEO_INICIO} className="w-full rounded-2xl" />
            ) : (
              <div className="aspect-9/16 flex flex-col items-center justify-center gap-3 text-white/25">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.328l5.603 3.113Z" />
                </svg>
                <p className="text-sm font-medium">Video próximamente</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACTO
      ══════════════════════════════════════════════ */}
      <LandingContactSection />

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <LandingFooter />

      {/* Botón flotante de descarga */}
      <AppDownloadButton />

    </div>
  );
}
