'use client';

import { Crown } from 'lucide-react';

export default function SubscriptionEmptyState() {
  return (
    <div className="rounded-2xl border border-line bg-card p-8 flex flex-col items-center gap-3 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-canvas-alt flex items-center justify-center">
        <Crown size={32} color="#132673" />
      </div>
      <p className="text-ink font-extrabold text-[17px] text-center">Sin plan activo</p>
      <p className="text-ink-faint text-[13px] text-center leading-5">
        Crea tu plan de suscripción para que tus clientes puedan suscribirse y acceder a contenido
        exclusivo.
      </p>
    </div>
  );
}
