"use client";

import { trackPixel } from "@/lib/pixel";

const CONTACT = {
  whatsapp: "+51 933 453 022",
  whatsappLink: "https://wa.me/51933453022",
  email: "contacto@monetizalab.vip",
  address: "Jirón Limatambo 386, Tarapoto 22202, Perú",
  facebook: "https://www.facebook.com/share/1CXaS1fbq3/",
  tiktok: "https://www.tiktok.com/@monetizalab",
};

function ContactCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <div className="bg-card border border-line rounded-3xl p-7 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 transition-all text-center group h-full">
      <div className="w-12 h-12 rounded-2xl bg-brand-soft border border-brand/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand/15 transition-colors">
        {icon}
      </div>
      <p className="text-ink-faint text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-ink font-black text-base break-all">{value}</p>
      {sub && <p className="text-ink-faint text-xs mt-1">{sub}</p>}
    </div>
  );

  if (href) {
    const isWhatsApp = href.includes("wa.me");
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block"
        onClick={isWhatsApp ? () => trackPixel("Contact") : undefined}>
        {inner}
      </a>
    );
  }
  return inner;
}

export function LandingContactSection() {
  return (
    <section id="contacto" className="py-20 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-3">Estamos para ayudarte</p>
          <h2 className="text-ink text-4xl sm:text-5xl font-black tracking-tight">Contáctanos</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* WhatsApp */}
          <ContactCard
            href={CONTACT.whatsappLink}
            label="WhatsApp Soporte"
            value={CONTACT.whatsapp}
            sub="Lun – Dom · 10am – 11pm"
            icon={
              <svg className="w-6 h-6 text-brand" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            }
          />

          {/* Email */}
          <ContactCard
            href={`mailto:${CONTACT.email}`}
            label="Correo electrónico"
            value={CONTACT.email}
            sub="Respuesta en menos de 24h"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            }
          />

          {/* Dirección */}
          <ContactCard
            label="Dirección"
            value="Jirón Limatambo 386"
            sub="Tarapoto 22202, Perú"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            }
          />

          {/* Redes sociales */}
          <div className="bg-card border border-line rounded-3xl p-7 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 transition-all text-center group">
            <div className="w-12 h-12 rounded-2xl bg-brand-soft border border-brand/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand/15 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            </div>
            <p className="text-ink-faint text-xs font-bold uppercase tracking-wider mb-3">Síguenos</p>
            <div className="flex items-center justify-center gap-3">
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-canvas-alt hover:bg-[#1877F2]/15 border border-line hover:border-[#1877F2]/40 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 text-ink-soft" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={CONTACT.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-xl bg-canvas-alt hover:bg-ink/5 border border-line hover:border-ink/25 flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 text-ink-soft" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
