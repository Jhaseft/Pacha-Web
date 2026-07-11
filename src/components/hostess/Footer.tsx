'use client';

import { Shield, CheckCircle, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-line py-4 sm:py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 p-3 bg-blue-50 rounded-full">
                <Shield size={28} className="text-blue-500" />
              </div>
              <h3 className="text-ink font-bold text-sm sm:text-base mb-1">
                Pago Seguro
              </h3>
              <p className="text-ink-faint text-xs sm:text-sm">
                Tus pagos estan protegidos con tecnologia SSl.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-3 p-3 bg-brand-soft rounded-full">
                <CheckCircle size={28} className="text-brand" />
              </div>
              <h3 className="text-ink font-bold text-sm sm:text-base mb-1">
                Creadora Verificada
              </h3>
              <p className="text-ink-faint text-xs sm:text-sm">
                Perfil autenticado por MonetizaLab.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-3 p-3 bg-violet-50 rounded-full">
                <Headphones size={28} className="text-brand-violet" />
              </div>
              <h3 className="text-ink font-bold text-sm sm:text-base mb-1">
                Soporte 24/7
              </h3>
              <p className="text-ink-faint text-xs sm:text-sm">
                Estamos aqui para ayudarte en todo momento.
              </p>
            </div>
          </div>

          <div className="border-t border-line my-6 sm:my-8" />

          <div className="text-center text-ink-faint text-xs sm:text-sm">
            <p>© 2024 MonetizaLab. Todos los derechos reservados.</p>

          </div>
        </div>
      </div>
    </footer>
  );
}
