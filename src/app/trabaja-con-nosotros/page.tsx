import Image from "next/image";
import Link from "next/link";
import { RegisterLink } from "@/components/RegisterLink";
import { MobileMenu } from "@/components/MobileMenu";
import { AppDownloadButton } from "@/components/AppDownloadButton";
import { LandingFooter } from "@/components/LandingFooter";
import { AutoplayVideo } from "@/components/AutoplayVideo";
import { PixelEvent } from "@/components/PixelEvent";

// ── Imagen del hero (derecha) — pon el link aquí ─────────────────────────────
const IMAGEN_TRABAJA = "https://res.cloudinary.com/dnbklbswg/image/upload/v1778740624/chicacd_uzoc0a.jpg"; // Link de la imagen del hero

// ── URLs de videos — pon tus links aquí ──────────────────────────────────────
const VIDEO_CREAR_CUENTA = "https://res.cloudinary.com/dai7rtja6/video/upload/v1778618603/REDUCIDO_vet1gy.mp4";
const VIDEO_RETIRO = "https://res.cloudinary.com/dai7rtja6/video/upload/v1778645708/Retiro_De_Dinero_Comprimido_owvcmj.mp4";
const VIDEO_PRECIOS = "https://res.cloudinary.com/dnbklbswg/video/upload/v1778737427/ANFITRIONAS_CONFIGURACION_exlmzo.mp4"; // Link del video de configuración de precios

// ── Pasos para crear tu cuenta — edita este array para actualizar ─────────────
const PASOS_CREAR_CUENTA = [
  {
    step: "01",
    title: "Descarga la app",
    desc: "Descarga el APK de MonetizaLab e instálalo en tu celular Android. Solo toma unos segundos.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Regístrate como creadora",
    desc: "Abre la app, selecciona 'Soy creadora' y completa tu perfil con tus datos básicos.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Configura tu perfil",
    desc: "Añade tu foto, descripción y configura tu disponibilidad. Nuestro equipo te guiará en el proceso.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

// ── Pasos para retirar dinero — edita este array para actualizar ──────────────
const PASOS_RETIRO = [
  {
    step: "01",
    title: "Acumula tus ganancias",
    desc: "Cada interacción con usuarios genera créditos en tu cuenta. Ve tus ganancias en tiempo real.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Solicita tu retiro",
    desc: "Desde la app, ve a tu perfil y toca 'Retirar dinero'. Elige el monto y tu método de pago preferido.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Recibe tu dinero",
    desc: "Procesamos tu retiro por transferencia bancaria, Binance, Bybit o PayPal. Rápido y seguro.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

// ── Pasos para configurar precios — edita este array para actualizar ──────────
const PASOS_PRECIOS = [
  {
    step: "01",
    title: "Ve a configuración",
    desc: "En la app, accede a tu perfil y toca 'Mis tarifas' para ver las opciones disponibles.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Define tu tarifa por servicio",
    desc: "Establece el precio en créditos para chat, llamadas y videollamadas. Tú decides cuánto cobrar.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Guarda y empieza a ganar",
    desc: "Una vez guardados tus precios, los usuarios ya pueden verte y contratarte. ¡A generar ingresos!",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#A11213]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
      </svg>
    ),
  },
];

function StepsSection({ title, subtitle, steps }: {
  title: string;
  subtitle: string;
  steps: typeof PASOS_CREAR_CUENTA;
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

function VideoSection({ src, title }: { src?: string; title: string }) {
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

export default function TrabajaConNosotrosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden pb-24 md:pb-0">
      <PixelEvent event="Host_Interes" />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logofull.jpeg"
              alt="MonetizaLab"
              width={36}
              height={36}
              className="rounded-xl object-cover ring-2 ring-[#A11213]/40"
            />
            <div className="leading-tight">
              <p className="text-white font-black text-base tracking-tight hidden sm:block">MonetizaLab</p>
              <p className="text-white/30 text-[9px] uppercase tracking-widest hidden sm:block">Plataforma de creadores</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link href="/soy-nuevo" className="hover:text-white transition-colors">Soy nuevo</Link>
            <Link href="/trabaja-con-nosotros" className="hover:text-white transition-colors text-white">Trabaja con nosotros</Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className="text-white/70 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/5 transition-all">
              Iniciar sesión
            </Link>
            <RegisterLink className="bg-[#A11213] hover:bg-[#8a0f10] text-white text-sm font-black px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-[#A11213]/25">
              Registrarse
            </RegisterLink>
          </div>
          <MobileMenu />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center gap-10 px-5 sm:px-8 lg:px-20 xl:px-32 pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-125 h-125 bg-[#A11213]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#A11213]/5 rounded-full blur-[100px]" />
        </div>

        {/* Left — texto */}
        <div className="relative flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <div className="mb-6 inline-flex items-center gap-2 bg-[#A11213]/15 border border-[#A11213]/30 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A11213] animate-pulse" />
            <span className="text-[#e07070] text-xs font-bold uppercase tracking-widest">Para creadoras</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5 max-w-2xl">
            <span className="text-white">Conecta, conversa y </span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#A11213] via-[#e03030] to-[#ff6060]">
              gana dinero
            </span>
            <span className="text-white"> desde tu celular</span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
            Únete a MonetizaLab y empieza a generar ingresos con horarios totalmente flexibles desde donde quieras.
          </p>

          <a
            href="https://wa.me/51933453022?text=Hola,%20me%20interesa%20trabajar%20como%20creador%20de%20contenido%20en%20MonetizaLab"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#A11213] hover:bg-[#8a0f10] active:scale-95 text-white font-black text-base px-10 py-4 rounded-2xl transition-all shadow-2xl shadow-[#A11213]/40 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Postular por WhatsApp
          </a>
        </div>

        {/* Right — imagen */}
        <div className="relative flex-1 flex justify-center lg:justify-end z-10">
          {IMAGEN_TRABAJA ? (
            <img
              src={IMAGEN_TRABAJA}
              alt="Trabaja con MonetizaLab"
              className="w-full max-w-sm lg:max-w-md rounded-3xl object-cover shadow-2xl"
            />
          ) : (
            <div className="w-full max-w-sm lg:max-w-md aspect-square bg-white/5 border-2 border-dashed border-white/15 rounded-3xl flex flex-col items-center justify-center gap-3 text-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <p className="text-sm font-medium">Imagen próximamente</p>
            </div>
          )}
        </div>
      </section>

      {/* Bloque 1: Crear cuenta + video */}
      <StepsSection
        title="Cómo crear tu cuenta"
        subtitle="Empieza hoy"
        steps={PASOS_CREAR_CUENTA}
      />
      <VideoSection src={VIDEO_CREAR_CUENTA || undefined} title="Mira cómo crear tu cuenta" />

      {/* Bloque 2: Retirar dinero + video */}
      <StepsSection
        title="Cómo retirar tu dinero"
        subtitle="Cobra sin complicaciones"
        steps={PASOS_RETIRO}
      />
      <VideoSection src={VIDEO_RETIRO || undefined} title="Mira cómo retirar tus ganancias" />

      {/* Bloque 3: Configurar precios + video (placeholder) */}
      <StepsSection
        title="Cómo configurar tus precios"
        subtitle="Tú decides cuánto cobrar"
        steps={PASOS_PRECIOS}
      />
      <VideoSection src={VIDEO_PRECIOS || undefined} title="Mira cómo configurar tus tarifas" />

      {/* Footer */}
      <LandingFooter />

      {/* Botón flotante de descarga */}
      <AppDownloadButton variant="host" />
    </div>
  );
}
