import Image from "next/image";
import Link from "next/link";
import { LandingPackagesSection } from "@/components/LandingPackagesSection";
import { LandingContactSection } from "@/components/LandingContactSection";
import { AppDownloadButton } from "@/components/AppDownloadButton";
import { MobileMenu } from "@/components/MobileMenu";
import { NavExplorar } from "@/components/NavExplorar";

// ── Shared icons ──────────────────────────────────────────────────────────────
function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#A11213]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674Z" />
    </svg>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white/5 border border-white/8 rounded-3xl p-7 hover:bg-white/8 hover:border-[#A11213]/30 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-2xl bg-[#A11213]/15 border border-[#A11213]/20 flex items-center justify-center mb-5 group-hover:bg-[#A11213]/25 transition-colors">
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-white/65 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
function FeatureCard2({
  title,
}: {

  title: string;

}) {
  return (
    <div className="bg-white/5 border border-white/8 rounded-3xl p-2 hover:bg-white/8 hover:border-[#A11213]/30 transition-all duration-300 group mb-4">
      <h3 className="text-white font-thin ">{title}</h3>
    </div>
  );
}

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
              <p className="text-white font-black text-base tracking-tight hidden sm:block ">Pachamama</p>
              <p className="text-white/30 text-[9px] uppercase tracking-widest hidden sm:block">Karaoke Bar · Tarapoto</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <NavExplorar base="" />
            <Link href="/soy-nuevo" className="hover:text-white transition-colors">Soy nuevo</Link>
            <Link href="/trabaja-con-nosotros" className="hover:text-white transition-colors">Trabaja con nosotros</Link>
          </div>

          {/* Auth buttons — solo desktop */}
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

          {/* Hamburguesa — solo mobile */}
          <MobileMenu />
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center gap-12 lg:gap-0 px-5 sm:px-8 pt-24 pb-20 overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#A11213]/12 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#A11213]/6 rounded-full blur-[100px]" />
          <div className="absolute top-0 right-1/3 w-64 h-64 bg-red-900/6 rounded-full blur-[80px]" />
        </div>

        {/* LEFT — Text content */}
        <div className="relative flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10 lg:pr-10">

          {/* Online badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 bg-white/8 border border-white/12 rounded-full px-4 py-2">
            <div className="flex -space-x-1.5">
              {["V", "C", "D", "M"].map((l) => (
                <div key={l} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#A11213] to-[#5a0000] border-2 border-[#0a0a0a] flex items-center justify-center">
                  <span className="text-white text-[8px] font-black">{l}</span>
                </div>
              ))}
            </div>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">24 creadoras online ahora</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-5">
            <span className="text-white">Conecta con</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A11213] via-[#e03030] to-[#ff6060]">
              creadoras en vivo
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/65 text-lg sm:text-xl max-w-lg mb-8 leading-relaxed">
            Chat gratis, llamadas y videollamadas privadas. Disfruta contenido exclusivo desde tu celular.
          </p>

          {/* Features 2x2 grid */}
          <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-sm">
            {[
              { emoji: "💬", title: "Chat gratis", desc: "Habla sin límites" },
              { emoji: "📞", title: "Llamadas privadas", desc: "Conecta más cerca" },
              { emoji: "🎥", title: "Videollamadas", desc: "Interacción en vivo" },
              { emoji: "⭐", title: "Contenido exclusivo", desc: "Solo para ti" },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-2.5 bg-white/5 border border-white/8 rounded-2xl p-3">
                <span className="text-lg leading-none">{f.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{f.title}</p>
                  <p className="text-white/50 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div id="hero-cta" className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mb-6">
            <a
              href={process.env.NEXT_PUBLIC_APK_URL}
              download
              className="flex-1 bg-gradient-to-r from-[#A11213] to-[#cc2020] hover:from-[#8a0f10] hover:to-[#b01010]
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
            {[
              "Seguro y privado",
              "Crea tu cuenta en segundos",
              "100% confidencial",
              "Diversión garantizada",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — Phone mockup */}
        <div className="relative flex-1 flex justify-center lg:justify-end z-10">
          <div className="relative">
            {/* Glow */}
            <div className="absolute inset-0 rounded-[3rem] bg-[#A11213]/20 blur-3xl scale-110 pointer-events-none" />

            {/* Phone frame */}
            <div
              className="relative w-56 sm:w-64 bg-[#111] rounded-[3rem] border-[3px] border-white/10 shadow-2xl overflow-hidden"
              style={{ aspectRatio: "9/19" }}
            >
              {/* Status bar */}
              <div className="bg-[#111] flex items-center justify-between px-5 pt-3 pb-1.5">
                <span className="text-white text-[9px] font-semibold">9:41</span>
                <div className="w-14 h-4 bg-black rounded-full border border-white/10" />
                <div className="flex items-center gap-0.5">
                  {[6, 10, 14].map((h) => (
                    <div key={h} className="w-[3px] rounded-sm bg-white/50" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>

              {/* App header */}
              <div className="bg-[#111] px-4 py-2.5 flex items-center justify-between border-b border-white/8">
                <div>
                  <p className="text-white font-black text-[13px]">Descubre creadoras</p>
                  <p className="text-green-400 text-[10px] font-semibold">● En vivo ahora</p>
                </div>
                <div className="w-7 h-7 bg-white/8 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
              </div>

              {/* Creator grid */}
              <div className="bg-black grid grid-cols-2 gap-0.5 p-0.5">
                {[
                  { name: "Valentina", count: "1.2K", from: "#6b1018", to: "#2d060a" },
                  { name: "Camila", count: "982", from: "#4a1060", to: "#1e0530" },
                  { name: "Daniela", count: "753", from: "#8b1a10", to: "#3d0a07" },
                  { name: "Mariana", count: "680", from: "#0a3060", to: "#051530" },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="relative overflow-hidden"
                    style={{
                      background: `linear-gradient(to bottom, ${c.from}, ${c.to})`,
                      aspectRatio: "0.75",
                    }}
                  >
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-[#A11213] rounded-full px-1.5 py-0.5">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-[7px] font-bold">En vivo</span>
                    </div>
                    <div className="absolute inset-0 flex items-end justify-center pb-7 opacity-15">
                      <div className="w-8 h-14 bg-white rounded-t-full" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                      <p className="text-white text-[10px] font-black">{c.name}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <svg className="w-2 h-2 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <span className="text-white/60 text-[8px]">{c.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom nav */}
              <div className="bg-black border-t border-white/8 flex items-center justify-around px-2 py-2">
                {[
                  { label: "Inicio", active: true },
                  { label: "Chat", active: false },
                  { label: "Llamadas", active: false },
                  { label: "Perfil", active: false },
                ].map((tab) => (
                  <div key={tab.label} className="flex flex-col items-center gap-0.5">
                    <div className={`w-3 h-3 rounded-sm ${tab.active ? "bg-[#A11213]" : "bg-white/20"}`} />
                    <span className={`text-[7px] font-semibold ${tab.active ? "text-[#A11213]" : "text-white/30"}`}>{tab.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Online badge */}
            <div className="absolute -top-3 -right-4 bg-[#1a1a1a] border border-white/10 rounded-2xl px-3 py-2 shadow-xl">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-[11px] font-black">24 online</span>
              </div>
              <p className="text-white/30 text-[8px] mt-0.5">creadoras en vivo</p>
            </div>

            {/* Download count badge */}
            <div className="absolute -bottom-3 -left-4 bg-[#A11213] rounded-2xl px-3 py-2 shadow-xl">
              <p className="text-white text-[10px] font-black leading-none">+500</p>
              <p className="text-red-200/70 text-[8px]">descargas</p>
            </div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════
          PAQUETES DE CRÉDITOS
      ══════════════════════════════════════════════ */}
      <LandingPackagesSection />

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Por qué elegirnos</p>
            <h2 className="text-white text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Todo en un solo lugar
            </h2>
            <p className="text-white/60 text-lg max-w-lg mx-auto">
              Pachamama te ofrece la experiencia más completa de entretenimiento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              title="Creadoras en vivo"
              desc="Conecta con creadoras en tiempo real. Chatea gratis y descubre funciones premium dentro de la app."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              }
            />
            <FeatureCard
              title="Créditos fáciles"
              desc="Recarga créditos al instante con tu tarjeta de crédito o débito. Proceso 100% seguro vía Culqi."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
              }
            />
            <FeatureCard
              title="Chat gratis"
              desc="Mensajes gratuitos desde el primer momento. Conecta con creadoras y empieza a conversar sin costo inicial."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              }
            />
            <FeatureCard
              title="Contenido exclusivo"
              desc="Accede a publicaciones, historias y experiencias digitales usando créditos dentro de la app."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              }
            />
            <FeatureCard
              title="Disponible todos los días"
              desc="Disfruta la plataforma desde tu celular, web o app móvil."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              }
            />
            <FeatureCard
              title="100% Seguro"
              desc="Tu privacidad y datos están protegidos. Pagos procesados por Culqi con encriptación SSL."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CÓMO FUNCIONA
      ══════════════════════════════════════════════ */}
      <section id="como-funciona" className="py-24 px-5 sm:px-8 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Proceso simple</p>
            <h2 className="text-white text-4xl sm:text-5xl font-black tracking-tight">
              ¿Cómo funciona?
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-10 bottom-10 w-px bg-gradient-to-b from-[#A11213] via-[#A11213]/30 to-transparent hidden sm:block" />

            <div className="flex flex-col gap-10">
              {[
                {
                  step: "01",
                  title: "Crea tu cuenta",
                  desc: "Regístrate gratis con tu número de celular en menos de 2 minutos.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  ),
                },
                {
                  step: "02",
                  title: "Chatea gratis",
                  desc: "Conecta con creadoras y empieza a conversar sin costo inicial.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                    </svg>
                  ),
                },
                {
                  step: "03",
                  title: "Usa créditos cuando quieras",
                  desc: "Activa llamadas, videollamadas y contenido exclusivo con créditos.",
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
                    <p className="text-white/45 text-sm leading-relaxed max-w-md">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DESCARGA LA APP
      ══════════════════════════════════════════════ */}
      <section id="descargar" className="py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-[#0f0f0f] border border-white/8">

            {/* Background glow */}
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#A11213]/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#A11213]/8 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-0 p-10 sm:p-14">

              {/* Left — text + buttons */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-[#A11213]/15 border border-[#A11213]/25 rounded-full px-4 py-1.5 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" />
                  </svg>
                  <span className="text-[#e07070] text-xs font-bold uppercase tracking-widest">App disponible</span>
                </div>

                <h2 className="text-white text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
                  Lleva Pachamama<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A11213] to-[#e03030]">
                    en tu bolsillo
                  </span>
                </h2>
                <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                  Descarga la app oficial y vive la experiencia completa desde tu celular. Disponible para Android e iOS.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                  {["Gratis", "Sin publicidad", "Notificaciones en tiempo real", "Siempre actualizada"].map((f) => (
                    <span key={f} className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1 text-xs text-white/50 font-medium">
                      <span className="w-1 h-1 rounded-full bg-[#A11213]" />
                      {f}
                    </span>
                  ))}
                </div>

                {/* Download buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">

                  {/* Android APK */}
                  <a
                    href={process.env.NEXT_PUBLIC_APK_URL}
                    download
                    className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#A11213]/40
                      rounded-2xl px-5 py-3.5 transition-all w-full sm:w-auto min-w-[190px]"
                  >
                    <div className="w-8 h-8 shrink-0 bg-[#A11213]/20 rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="#A11213">
                        <path d="M17.523 15.341a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-11.046 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM2.1 8.4h19.8A1.1 1.1 0 0 1 23 9.5v6a1.1 1.1 0 0 1-1.1 1.1H21v2.65a.75.75 0 0 1-1.5 0V16.6H4.5v2.65a.75.75 0 0 1-1.5 0V16.6h-.9A1.1 1.1 0 0 1 1 15.5v-6A1.1 1.1 0 0 1 2.1 8.4Zm.9 1.5v5h18v-5H3ZM8.22 2.47a.75.75 0 0 1 1.02-.28L12 3.8l2.76-1.61a.75.75 0 1 1 .75 1.3L13.5 4.8V7.4h-3V4.8L8.5 3.49a.75.75 0 0 1-.28-1.02Z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white/40 text-[10px] uppercase tracking-wider leading-none mb-0.5">Descargar para</p>
                      <p className="text-white font-black text-base leading-tight">Android (.apk)</p>
                    </div>
                  </a>

                  {/* App Store */}
                  <a
                    href="#"
                    className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#A11213]/40
                      rounded-2xl px-5 py-3.5 transition-all w-full sm:w-auto min-w-[190px]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="white">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-white/40 text-[10px] uppercase tracking-wider leading-none mb-0.5">Disponible en</p>
                      <p className="text-white font-black text-base leading-tight">App Store</p>
                    </div>
                  </a>

                </div>

                <p className="text-white/20 text-xs mt-5 text-center lg:text-left">
                  ¿No tienes la app? También puedes usar la versión web.
                </p>
              </div>

              {/* Right — Phone mockup */}
              <div className="flex-1 flex justify-center lg:justify-end lg:pr-4">
                <div className="relative">
                  {/* Outer glow */}
                  <div className="absolute inset-0 rounded-[3rem] bg-[#A11213]/20 blur-2xl scale-110 pointer-events-none" />

                  {/* Phone frame */}
                  <div className="relative w-56 sm:w-64 bg-[#1a1a1a] rounded-[3rem] border-4 border-white/10 shadow-2xl overflow-hidden"
                    style={{ aspectRatio: "9/19" }}>

                    {/* Status bar */}
                    <div className="bg-black flex items-center justify-between px-6 pt-4 pb-2">
                      <span className="text-white text-[9px] font-semibold">15:44</span>
                      <div className="w-20 h-5 bg-black rounded-full border border-white/10" />
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-2 border border-white/40 rounded-sm relative">
                          <div className="absolute inset-0.5 right-0 bg-white/40 rounded-sm w-1/2" />
                        </div>
                      </div>
                    </div>

                    {/* App content preview */}
                    <div className="bg-black flex-1 px-4 py-3 h-full">
                      {/* Logo inside phone */}
                      <div className="flex items-center gap-2 mb-4">
                        <Image src="/logofull.jpeg" alt="Pachamama" width={28} height={28} className="rounded-lg object-cover" />
                        <div>
                          <p className="text-white text-[10px] font-black leading-none">Pachamama</p>
                          <p className="text-white/30 text-[8px]">Karaoke Bar</p>
                        </div>
                      </div>

                      {/* Mis Creditos heading */}
                      <p className="text-white text-center text-xs font-black italic mb-3">Mis Créditos</p>

                      {/* Balance pill */}
                      <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-1.5 border border-white rounded-full px-4 py-1.5">
                          <svg viewBox="0 0 64 64" className="w-4 h-4" fill="none">
                            <polygon points="32,4 58,24 32,60 6,24" fill="#5bc8f5" stroke="#3aafde" strokeWidth="2" strokeLinejoin="round"/>
                            <polygon points="32,4 48,24 32,36 16,24" fill="#aae8ff" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-white text-sm font-black">975</span>
                        </div>
                      </div>

                      {/* Package cards mini */}
                      {[
                        { credits: "555", price: "15" },
                        { credits: "2000", price: "200" },
                        { credits: "500", price: "50" },
                      ].map((p) => (
                        <div key={p.credits} className="relative bg-white rounded-xl px-3 py-2 mb-2 flex items-center justify-between">
                          <div className="absolute -top-1.5 right-2">
                            <span className="bg-[#A11213] text-white text-[7px] font-black px-1.5 py-0.5 rounded-full">BONO</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg viewBox="0 0 64 64" className="w-5 h-5" fill="none">
                              <polygon points="32,4 58,24 32,60 6,24" fill="#fde8e8" stroke="#A11213" strokeWidth="3" strokeLinejoin="round"/>
                            </svg>
                            <div>
                              <p className="text-[#A11213] text-xs font-black leading-none">{p.credits}</p>
                              <p className="text-[#A11213]/60 text-[8px]">S/{p.price}</p>
                            </div>
                          </div>
                          <div className="bg-[#A11213] text-white text-[8px] font-black px-2 py-1 rounded-lg">
                            Comprar
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="bg-black border-t border-white/10 flex items-center justify-around px-2 py-2">
                      {["Inicio", "Chats", "Créditos", "Perfil"].map((tab, i) => (
                        <div key={tab} className="flex flex-col items-center gap-0.5">
                          <div className={`w-3 h-3 rounded-sm ${i === 2 ? "bg-[#A11213]" : "bg-white/20"}`} />
                          <span className={`text-[7px] font-semibold ${i === 2 ? "text-[#A11213]" : "text-white/30"}`}>{tab}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute -bottom-4 -right-4 bg-[#1a1a1a] border border-white/10 rounded-2xl px-3 py-2 shadow-xl">
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674Z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-white text-[10px] font-black">5.0</span>
                    </div>
                    <p className="text-white/30 text-[8px] mt-0.5">+200 reseñas</p>
                  </div>

                  {/* Download count badge */}
                  <div className="absolute -top-4 -left-4 bg-[#A11213] rounded-2xl px-3 py-2 shadow-xl">
                    <p className="text-white text-[10px] font-black leading-none">+500</p>
                    <p className="text-red-200/70 text-[8px]">descargas</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACTO
      ══════════════════════════════════════════════ */}
      <LandingContactSection />

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section id="final-cta" className="py-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#A11213] via-[#8B0000] to-[#4a0000] rounded-3xl p-10 sm:p-14 text-center">
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/20" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white/3" />

            <div className="relative">
              <Image
                src="/logofull.jpeg"
                alt="Pachamama"
                width={80}
                height={80}
                className="rounded-2xl object-cover mx-auto mb-6 ring-4 ring-white/20 shadow-2xl"
              />
              <h2 className="text-white text-3xl sm:text-5xl font-black mb-4 tracking-tight">
                ¿Listo para vivir<br />la experiencia?
              </h2>
              <p className="text-red-200/70 text-base sm:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                Descarga Pachamama App y conecta con creadoras en vivo desde tu celular.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/login/cliente"
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#A11213] font-black text-base
                    px-8 py-4 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  Crear cuenta gratis
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto border-2 border-white/30 hover:border-white/60 text-white font-bold text-base
                    px-8 py-4 rounded-2xl transition-all flex items-center justify-center"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 bg-black/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          {/* Main footer */}
          <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logofull.jpeg"
                  alt="Pachamama"
                  width={44}
                  height={44}
                  className="rounded-xl object-cover ring-2 ring-[#A11213]/30"
                />
                <div>
                  <p className="text-white font-black text-lg leading-tight">Pachamama</p>
                  <p className="text-white/30 text-xs">Karaoke Bar · Tarapoto</p>
                </div>
              </div>
              <p className="text-white/35 text-sm leading-relaxed max-w-xs">
                La mejor experiencia de karaoke y entretenimiento en Tarapoto, Perú. Conéctate con nuestrascreadorasy vive momentos únicos.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-5">
                <a href="https://www.facebook.com/share/1CXaS1fbq3/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#1877F2]/20 border border-white/8 hover:border-[#1877F2]/30 flex items-center justify-center transition-all">
                  <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@pachamama.tarapot?_r=1&_t=ZS-958bCZCbA4w" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/8 hover:border-white/25 flex items-center justify-center transition-all">
                  <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" />
                  </svg>
                </a>
                <a href="https://wa.me/51933453022" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#A11213]/20 border border-white/8 hover:border-[#A11213]/30 flex items-center justify-center transition-all">
                  <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-5">Plataforma</p>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Iniciar sesión", href: "/login" },
                  { label: "Crear cuenta", href: "/login/cliente" },
                  { label: "Mis créditos", href: "/dashboard" },
                  { label: "Descargar app", href: "#descargar" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/35 hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-5">Legal</p>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Términos y Condiciones", href: "/terminos" },
                  { label: "Política de Devoluciones", href: "/politica-devoluciones" },
                  { label: "Libro de Reclamaciones", href: "/libro-reclamaciones" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/35 hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-5">Contacto</p>
              <ul className="flex flex-col gap-3 text-sm text-white/35">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#A11213] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span>Jirón Limatambo 386, Tarapoto 22202, Perú</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#A11213] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <a href="mailto:jose.cp186@gmail.com" className="hover:text-white/60 transition-colors">jose.cp186@gmail.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#A11213] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <a href="https://wa.me/51933453022" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">+51 933 453 022</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/20 text-xs">
              © {new Date().getFullYear()} Pachamama Karaoke Bar. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
              <Link href="/terminos" className="text-white/20 hover:text-white/40 text-xs transition-colors">Términos y Condiciones</Link>
              <span className="text-white/10">·</span>
              <Link href="/politica-devoluciones" className="text-white/20 hover:text-white/40 text-xs transition-colors">Política de Devoluciones</Link>
              <span className="text-white/10">·</span>
              <Link href="/libro-reclamaciones" className="text-white/20 hover:text-white/40 text-xs transition-colors">Libro de Reclamaciones</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating download button */}
      <AppDownloadButton />

    </div>
  );
}
