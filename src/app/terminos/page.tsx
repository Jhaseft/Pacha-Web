import Link from "next/link";
import Image from "next/image";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
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
            <div className="leading-tight hidden sm:block">
              <p className="text-white font-black text-base tracking-tight">Pachamama</p>
              <p className="text-white/30 text-[9px] uppercase tracking-widest">Karaoke Bar · Tarapoto</p>
            </div>
          </Link>
          <Link
            href="/"
            className="text-white/50 hover:text-white text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-28 pb-20">
        <div className="mb-10">
          <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-white text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-white/40 text-sm">Última actualización: marzo 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-white/70 text-sm leading-relaxed">

          <Section number="1" title="Naturaleza del servicio">
            <p>
              Pachamama es una <strong className="text-white">plataforma social de entretenimiento digital</strong> que
              permite a los usuarios interactuar con creadores mediante mensajes, contenido multimedia y experiencias
              en vivo dentro de la aplicación.
            </p>
            <p className="mt-2">La plataforma no ofrece ni promueve servicios sexuales de ningún tipo.</p>
          </Section>

          <Section number="2" title="Edad mínima">
            <p>
              El uso de la aplicación está permitido únicamente para personas <strong className="text-white">mayores de 18 años</strong>.
              Al registrarse, el usuario declara cumplir este requisito.
            </p>
          </Section>

          <Section number="3" title="Sistema de créditos">
            <p>La plataforma utiliza un sistema de créditos para acceder a funciones premium como:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-white/60">
              <li>Interacción mediante mensajes</li>
              <li>Contenido exclusivo</li>
              <li>Experiencias en vivo</li>
            </ul>
            <p className="mt-2">
              <strong className="text-white">Los créditos no constituyen dinero real y no son reembolsables.</strong>
            </p>
          </Section>

          <Section number="4" title="Pagos">
            <p>Los pagos se procesan mediante proveedores externos (ej: Culqi). La plataforma:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-white/60">
              <li>No almacena información financiera sensible del usuario.</li>
              <li>No garantiza el reembolso de créditos adquiridos.</li>
            </ul>
            <p className="mt-2">El usuario es responsable de verificar sus compras antes de confirmarlas.</p>
          </Section>

          <Section number="5" title="Interacciones dentro de la plataforma">
            <p>Las interacciones entre usuarios y creadores son de carácter:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Social", "Recreativo", "Digital"].map((t) => (
                <span key={t} className="bg-[#A11213]/15 border border-[#A11213]/25 text-[#e07070] text-xs font-bold px-3 py-1 rounded-full">
                  ✔ {t}
                </span>
              ))}
            </div>
            <p className="mt-3">
              La plataforma no garantiza resultados específicos ni establece relaciones fuera del entorno digital.
            </p>
          </Section>

          <Section number="6" title="Conducta del usuario">
            <p>Está estrictamente prohibido:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-white/60">
              <li>Compartir contenido ilegal</li>
              <li>Solicitar o ofrecer servicios sexuales</li>
              <li>Compartir datos personales (teléfono, dirección, etc.)</li>
              <li>Grabar, reproducir o distribuir contenido sin autorización</li>
              <li>Acosar o amenazar a otros usuarios</li>
            </ul>
          </Section>

          <Section number="7" title="Contenido">
            <p>
              Los creadores son responsables del contenido que comparten. La plataforma podrá eliminar contenido que
              incumpla las normas o políticas.
            </p>
          </Section>

          <Section number="8" title="Cuentas de creadores (anfitrionas)">
            <p>
              El registro como creador está sujeto a revisión y aprobación por parte de la plataforma. La plataforma
              se reserva el derecho de aprobar o rechazar perfiles, suspender cuentas y eliminar contenido.
            </p>
          </Section>

          <Section number="9" title="Moderación">
            <p>La plataforma cuenta con herramientas de reporte, bloqueo y revisión de contenido. El incumplimiento
              de normas puede resultar en suspensión o eliminación de la cuenta.
            </p>
          </Section>

          <Section number="10" title="Privacidad">
            <p>
              La información del usuario será tratada conforme a la política de privacidad de la plataforma.
            </p>
          </Section>

          <Section number="11" title="Suspensión de cuentas">
            <p>
              La plataforma podrá suspender cuentas sin previo aviso en caso de incumplimiento de los términos.
            </p>
          </Section>

          <Section number="12" title="Limitación de responsabilidad">
            <p>
              La plataforma actúa como intermediario digital y no es responsable por el comportamiento de los usuarios.
            </p>
          </Section>

          <Section number="13" title="Modificaciones">
            <p>
              Los términos pueden ser modificados en cualquier momento. El uso continuo de la plataforma implica la
              aceptación de dichos cambios.
            </p>
          </Section>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/politica-devoluciones"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
            Política de Devoluciones
          </Link>
          <Link
            href="/libro-reclamaciones"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            Libro de Reclamaciones
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
      <div className="flex items-start gap-4 mb-3">
        <span className="shrink-0 w-8 h-8 rounded-xl bg-[#A11213]/15 border border-[#A11213]/25 flex items-center justify-center text-[#A11213] text-xs font-black">
          {number}
        </span>
        <h2 className="text-white font-black text-base pt-1">{title}</h2>
      </div>
      <div className="pl-12">{children}</div>
    </div>
  );
}
