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
          ? 'border-green-200 bg-green-50 hover:border-green-300'
          : 'border-amber-200 bg-amber-50 hover:border-amber-300'
      }`}
    >
      <div className="flex items-center gap-4 p-5">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
            isSubscribed ? 'bg-green-100' : 'bg-amber-100'
          }`}
        >
          {isSubscribed ? (
            <Check size={24} className="text-green-600" />
          ) : (
            <Crown size={24} className="text-amber-500" />
          )}
        </div>

        <div className="flex-1 text-left">
          <p className={`font-bold text-base ${isSubscribed ? 'text-green-700' : 'text-amber-600'}`}>
            {isSubscribed ? '✦ Suscrito' : 'Suscribirse al plan'}
          </p>
          <p className="text-xs text-ink-faint mt-1">
            {isSubscribed
              ? `Acceso activo · ${plan.price} cr/mes`
              : `${plan.price} créditos/mes · Acceso a la galería de la anfitriona`}
          </p>
        </div>

        {!isSubscribed && (
          <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            Unirse
          </div>
        )}
      </div>
    </button>
  );
}
