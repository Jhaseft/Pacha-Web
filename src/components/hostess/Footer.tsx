'use client';

import { Shield, CheckCircle, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-gray-950 to-black border-t border-gray-900 py-4 sm:py-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 p-3 bg-linear-to-br from-blue-500/20 to-blue-600/20 rounded-full">
                <Shield size={28} className="text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-sm sm:text-base mb-1">
                Pago Seguro
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Tus pagos estan protegidos con tecnologia SSl.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-3 p-3 bg-linear-to-br from-pink-500/20 to-pink-600/20 rounded-full">
                <CheckCircle size={28} className="text-pink-400" />
              </div>
              <h3 className="text-white font-bold text-sm sm:text-base mb-1">
                Creadora Verificada
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Perfil autenticado por MonetizaLab.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-3 p-3 bg-linear-to-br from-purple-500/20 to-purple-600/20 rounded-full">
                <Headphones size={28} className="text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-sm sm:text-base mb-1">
                Soporte 24/7
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Estamos aqui para ayudarte en todo momento.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 my-6 sm:my-8" />

          <div className="text-center text-gray-500 text-xs sm:text-sm">
            <p>© 2024 MonetizaLab. Todos los derechos reservados.</p>

          </div>
        </div>
      </div>
    </footer>
  );
}
