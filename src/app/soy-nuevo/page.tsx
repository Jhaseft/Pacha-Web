import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { AppDownloadButton } from "@/components/AppDownloadButton";
import { LandingFooter } from "@/components/LandingFooter";
import { AutoplayVideo } from "@/components/AutoplayVideo";

// ── URLs de contenido — pon tus links aquí ───────────────────────────────────
const IMAGEN_HERO = "https://res.cloudinary.com/dnbklbswg/image/upload/v1778741258/chicasoynuevp_s1pcfi.jpg"; // Link de la imagen del hero (derecha)
const VIDEO_DESCARGA = "/pacha.mp4"; // Link del video de instalación
const VIDEO_RECARGA = "https://res.cloudinary.com/dnbklbswg/video/upload/v1778735232/PAYPAL_FINAL__szmq99.mp4"; // Link del video de recarga de créditos

// ── Pasos para descargar la app — edita este array para actualizar ────────────
const PASOS_DESCARGA = [
  {
    step: "01",
    title: "Descarga el APK",
    desc: "Toca el botón 'Descargar app' y guarda el archivo APK en tu celular.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Permite la instalación",
    desc: "Ve a Ajustes → Seguridad → activa 'Instalar apps de fuentes desconocidas'. Solo es necesario una vez.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Instala y abre la app",
    desc: "Toca el archivo descargado, instala y abre Pachamama. ¡En segundos estás dentro!",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
      </svg>
    ),
  },
];

// ── Pasos para recargar la billetera — edita este array para actualizar ───────
const PASOS_RECARGA = [
  {
    step: "01",
    title: "Ve a Mis Créditos",
    desc: "Dentro de la app, toca el ícono de créditos en la barra de navegación inferior.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Elige un paquete",
    desc: "Selecciona el paquete de créditos que más te convenga. Cada paquete incluye un bono adicional.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Paga con tarjeta",
    desc: "Ingresa los datos de tu tarjeta de crédito o débito. El pago es 100% seguro vía Culqi con encriptación SSL.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

function StepsSection({ title, subtitle, steps }: {
  title: string;
  subtitle: string;
  steps: typeof PASOS_DESCARGA;
}) {
  return (
    <section className="py-20 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">{subtitle}</p>
          <h2 className="text-white text-3xl sm:text-4xl font-black tracking-tight">{title}</h2>
        </div>
        <div className="relative">
          <div className="absolute left-6 top-10 bottom-10 w-px bg-linear-to-b from-[#A11213] via-[#A11213]/30 to-transparent hidden sm:block" />
          <div className="flex flex-col gap-10">
            {steps.map((item) => (
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
  );
}

function VideoPlaceholder({ src, title }: { src?: string; title: string }) {
  return (
    <section className="py-10 px-5 sm:px-8 bg-white/2">
      <div className="max-w-xs mx-auto">
        <p className="text-white/50 text-center text-sm font-semibold mb-6 uppercase tracking-widest">{title}</p>
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40">
          {src ? (
            <AutoplayVideo src={src} className="w-full rounded-2xl" />
          ) : (
            <div className="aspect-9/16 bg-black/50 flex flex-col items-center justify-center gap-3 text-white/25">
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
  );
}

export default function SoyNuevoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden pb-24 md:pb-0">

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
              <p className="text-white/30 text-[9px] uppercase tracking-widest hidden sm:block">Karaoke Bar · Tarapoto</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/soy-nuevo" className="hover:text-white transition-colors text-white">Soy nuevo</Link>
            <Link href="/trabaja-con-nosotros" className="hover:text-white transition-colors">Trabaja con nosotros</Link>
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

      {/* Hero — split layout */}
      <section className="relative min-h-[70vh] flex flex-col lg:flex-row items-center gap-10 px-5 sm:px-8 lg:px-20 xl:px-32 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-125 h-125 bg-[#A11213]/10 rounded-full blur-[120px]" />
        </div>

        {/* Left — text */}
        <div className="relative flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <div className="mb-5 inline-flex items-center gap-2 bg-[#A11213]/15 border border-[#A11213]/30 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A11213] animate-pulse" />
            <span className="text-[#e07070] text-xs font-bold uppercase tracking-widest">Para nuevos usuarios</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
            <span className="text-white">El mejor</span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#A11213] via-[#e03030] to-[#ff6060]">
              entretenimiento
            </span>
            <br />
            <span className="text-white">dentro de nuestra app</span>
          </h1>

          <p className="text-white/55 text-lg max-w-lg mb-8 leading-relaxed">
            Descarga Pachamama, crea tu cuenta y conéctate con creadoras en vivo desde tu celular.
          </p>

          <a
            href={process.env.NEXT_PUBLIC_APK_URL}
            download
            className="bg-linear-to-r from-[#A11213] to-[#cc2020] hover:from-[#8a0f10] hover:to-[#b01010]
              text-white font-black px-8 py-4 rounded-2xl transition-all
              shadow-2xl shadow-[#A11213]/40 flex items-center gap-3 active:scale-95 w-fit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="white">
              <path d="M17.523 15.341a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-11.046 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM2.1 8.4h19.8A1.1 1.1 0 0 1 23 9.5v6a1.1 1.1 0 0 1-1.1 1.1H21v2.65a.75.75 0 0 1-1.5 0V16.6H4.5v2.65a.75.75 0 0 1-1.5 0V16.6h-.9A1.1 1.1 0 0 1 1 15.5v-6A1.1 1.1 0 0 1 2.1 8.4Zm.9 1.5v5h18v-5H3ZM8.22 2.47a.75.75 0 0 1 1.02-.28L12 3.8l2.76-1.61a.75.75 0 1 1 .75 1.3L13.5 4.8V7.4h-3V4.8L8.5 3.49a.75.75 0 0 1-.28-1.02Z" />
            </svg>
            Descargar app
          </a>
        </div>

        {/* Right — imagen hero (pon el link en IMAGEN_HERO arriba) */}
        <div className="relative flex-1 flex justify-center lg:justify-end z-10">
          {IMAGEN_HERO ? (
            <img
              src={IMAGEN_HERO}
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

      {/* Pasos para descargar */}
      <StepsSection
        title="Cómo descargar la app"
        subtitle="Instalación rápida"
        steps={PASOS_DESCARGA}
      />

      <VideoPlaceholder src={VIDEO_DESCARGA || undefined} title="Mira cómo instalar la app" />

      <StepsSection
        title="Cómo recargar tu billetera"
        subtitle="Sin complicaciones"
        steps={PASOS_RECARGA}
      />

      <VideoPlaceholder src={VIDEO_RECARGA || undefined} title="Mira cómo recargar créditos" />

      {/* Footer */}
      <LandingFooter />

      {/* Botón flotante de descarga */}
      <AppDownloadButton />
    </div>
  );
}
