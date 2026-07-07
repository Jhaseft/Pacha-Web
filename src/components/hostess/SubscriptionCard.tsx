'use client';

import { SubscriptionPlan, SubscriptionStatus } from '@/lib/hostessService';
import { Crown, Check } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionCardProps {
  profile: { name: string };
  plan: SubscriptionPlan | null;
  status: SubscriptionStatus | null;
  onSubscribe: () => Promise<void>;
}

export default function SubscriptionCard({
  profile,
  plan,
  status,
  onSubscribe,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  if (!plan) return null;

  const isSubscribed =
    status?.isSubscribed === true &&
    (status.expiresAt ? new Date(status.expiresAt) > new Date() : true);

  const handleClick = async () => {
    if (isSubscribed) return;
    setLoading(true);
    try {
      await onSubscribe();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSubscribed || loading}
      className={`w-full rounded-2xl overflow-hidden border transition ${
        isSubscribed
          ? 'border-green-500/40 bg-gradient-to-r from-green-950 to-green-900 hover:border-green-500/60'
          : 'border-yellow-600/40 bg-gradient-to-r from-yellow-950 to-yellow-900 hover:border-yellow-500/60'
      }`}
    >
      <div className="flex items-center gap-4 p-5">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isSubscribed ? 'bg-green-900' : 'bg-yellow-900'
          }`}
        >
          {isSubscribed ? (
            <Check size={24} className="text-green-500" />
          ) : (
            <Crown size={24} className="text-yellow-500" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 text-left">
          <p className={`font-bold text-base ${isSubscribed ? 'text-green-500' : 'text-yellow-500'}`}>
            {isSubscribed ? '✦ Suscrito' : 'Suscribirse al plan'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isSubscribed
              ? `Acceso activo · ${plan.price} cr/mes`
              : `${plan.price} créditos/mes · Acceso a la galería de la anfitriona`}
          </p>
        </div>

        {!isSubscribed && (
          <div className="bg-yellow-500 text-yellow-950 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            Unirse
          </div>
        )}
      </div>
    </button>
  );
}
