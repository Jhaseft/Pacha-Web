"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGetAllPackages } from "@/lib/packages";
import type { PackageData } from "@/types/package";

function DiamondOutline({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 58,24 32,60 6,24" fill="#fde8e8" stroke="#A11213" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="32,4 48,24 32,36 16,24" fill="none" stroke="#A11213" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function LandingPackagesSection() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetAllPackages()
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="paquetes" className="py-24 px-5 sm:px-8 bg-white/[0.02]">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-[#A11213] text-xs font-bold uppercase tracking-widest mb-3">Catálogo de servicios</p>
          <h2 className="text-white text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Paquetes de Créditos
          </h2>
          <p className="text-white/40 text-base max-w-lg mx-auto leading-relaxed">
            Elige el paquete que mejor se adapte a ti. Los créditos te permiten acceder a mensajes,
            contenido exclusivo y experiencias en vivo dentro de la plataforma.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 rounded-3xl h-28 animate-pulse" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">No hay paquetes disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {packages.map((pkg) => (
              <div key={pkg.id} className="relative bg-white rounded-3xl px-5 py-5 shadow-xl">
                {/* Bono badge */}
                <div className="absolute -top-3 right-5">
                  <span className="bg-[#A11213] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                    BONO +10
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <DiamondOutline className="w-10 h-10 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[#A11213] text-3xl font-black leading-none tracking-tight">
                        {pkg.credits.toLocaleString()}
                      </p>
                      <p className="text-[#A11213] text-sm font-bold">créditos</p>
                      <p className="text-[#A11213]/60 text-sm font-semibold">
                        S/{Number(pkg.price) % 1 === 0
                          ? Number(pkg.price).toFixed(0)
                          : Number(pkg.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/login"
                    className="bg-[#A11213] hover:bg-[#8a0f10] active:scale-95 text-white font-black text-base
                      px-7 py-3.5 rounded-2xl transition-all shrink-0 min-w-[110px] flex items-center
                      justify-center shadow-md"
                  >
                    Comprar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-white/20 text-xs text-center mt-8">
          Al comprar créditos aceptas nuestros{" "}
          <Link href="/terminos" className="underline hover:text-white/40 transition-colors">
            Términos y Condiciones
          </Link>
          . Los créditos no son reembolsables.
        </p>
      </div>
    </section>
  );
}
