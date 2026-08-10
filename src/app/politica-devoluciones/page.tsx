import Link from "next/link";
import Image from "next/image";

export default function PoliticaDevolucionesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logofull.jpeg"
              alt="MonetizaLab"
              width={36}
              height={36}
              className="rounded-xl object-cover ring-2 ring-[#A11213]/40"
            />
            <div className="leading-tight hidden sm:block">
              <p className="text-white font-black text-base tracking-tight">MonetizaLab</p>
              <p className="text-white/30 text-[9px] uppercase tracking-widest">Plataforma de creadores</p>
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
            Política de Cambios y Devoluciones
          </h1>
          <p className="text-white/40 text-sm">Última actualización: marzo 2025</p>
        </div>

        <div className="space-y-6 text-white/70 text-sm leading-relaxed">

          {/* Alert box */}
          <div className="bg-[#A11213]/10 border border-[#A11213]/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#A11213] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <div>
                <p className="text-white font-black text-base mb-1">Créditos no reembolsables</p>
                <p className="text-white/60">
                  Los créditos adquiridos dentro de la plataforma MonetizaLab <strong className="text-white">no son reembolsables</strong> ni
                  canjeables por dinero en efectivo o por ningún otro medio de pago. Al completar una compra, el
                  usuario acepta expresamente esta condición.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-white/5 rounded-2xl p-6 space-y-3">
            <h2 className="text-white font-black text-lg">Naturaleza del servicio digital</h2>
            <p>
              MonetizaLab es una plataforma de entretenimiento digital. Los créditos adquiridos son bienes digitales
              que se utilizan de forma inmediata al ser acreditados en la billetera virtual del usuario.
            </p>
            <p>
              De conformidad con las normas de protección al consumidor aplicables a servicios digitales y contenido
              en línea, <strong className="text-white">no procede devolución</strong> una vez que los créditos han sido acreditados en la
              cuenta del usuario, dado que se trata de contenido digital de acceso inmediato.
            </p>
          </div>

          <div className="border border-white/5 rounded-2xl p-6 space-y-3">
            <h2 className="text-white font-black text-lg">Excepciones y errores de cobro</h2>
            <p>
              Si se detecta un <strong className="text-white">error en el cobro</strong> (cobro duplicado, monto incorrecto o fallo técnico
              comprobable), el usuario podrá solicitar la revisión del cargo dentro de los{" "}
              <strong className="text-white">5 días calendario</strong> siguientes a la transacción, presentando:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>Comprobante o constancia de la transacción</li>
              <li>Descripción detallada del problema</li>
              <li>Datos de contacto del usuario</li>
            </ul>
            <p>
              La solicitud deberá enviarse a{" "}
              <a href="mailto:contacto@monetizalab.vip" className="text-[#A11213] hover:text-[#e03030] transition-colors underline">
                contacto@monetizalab.vip
              </a>{" "}
              con asunto: <strong className="text-white">"Error de cobro - [nombre del usuario]"</strong>.
            </p>
          </div>

          <div className="border border-white/5 rounded-2xl p-6 space-y-3">
            <h2 className="text-white font-black text-lg">Tiempo de respuesta</h2>
            <p>
              La plataforma se compromete a responder las solicitudes de revisión de cobro en un plazo máximo de{" "}
              <strong className="text-white">10 días hábiles</strong> desde la recepción del correo.
            </p>
          </div>

          <div className="border border-white/5 rounded-2xl p-6 space-y-3">
            <h2 className="text-white font-black text-lg">Suspensión de cuenta</h2>
            <p>
              En caso de suspensión de cuenta por incumplimiento de los Términos y Condiciones, el usuario no tendrá
              derecho a reembolso de los créditos no utilizados, dado que la suspensión es consecuencia directa de la
              infracción cometida.
            </p>
          </div>

          <div className="border border-white/5 rounded-2xl p-6 space-y-3">
            <h2 className="text-white font-black text-lg">Marco legal aplicable</h2>
            <p>
              La presente política se rige por el{" "}
              <strong className="text-white">Código de Protección y Defensa del Consumidor (Ley N° 29571)</strong> y las
              disposiciones complementarias emitidas por el Instituto Nacional de Defensa de la Competencia y de la
              Protección de la Propiedad Intelectual (Indecopi).
            </p>
            <p>
              Si no quedas satisfecho con la respuesta de la plataforma, puedes presentar tu reclamo directamente
              ante Indecopi a través de su{" "}
              <a
                href="https://www.indecopi.gob.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A11213] hover:text-[#e03030] transition-colors underline"
              >
                portal oficial
              </a>.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/terminos"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
            Términos y Condiciones
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
