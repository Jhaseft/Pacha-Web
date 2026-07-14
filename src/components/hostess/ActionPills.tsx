'use client';

import { ServicePrice, SubscriptionPlan, SubscriptionStatus } from '@/lib/hostessService';
import { MessageCircle, Phone, Video, Crown } from 'lucide-react';

interface ActionPillsProps {
  profile: {
    name: string;
    likesCount: number;
  };
  servicePrices: ServicePrice[];
  subPlan: SubscriptionPlan | null;
  subStatus: SubscriptionStatus | null;
  onChat: () => void;
  onCall: (type: 'CALL' | 'VIDEO_CALL') => void;
  onSubscribe: () => void;
}

export default function ActionPills({
  servicePrices,
  subPlan,
  subStatus,
  onChat,
  onCall,
  onSubscribe,
}: ActionPillsProps) {
  const getPrice = (type: ServicePrice['serviceType']) =>
    servicePrices.find((p) => p.serviceType === type)?.price ?? null;

  const callPrice = getPrice('CALL');
  const videoPrice = getPrice('VIDEO_CALL');
  const chatPrice = getPrice('MESSAGE_SEND');
  const subPrice = subPlan?.price ?? null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Chat Button */}
      <button
        onClick={onChat}
        className="flex flex-col items-center justify-center gap-1 bg-linear-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-3 py-3 rounded-lg font-bold transition text-sm"
      >
        <MessageCircle size={18} />
        <span>Chat</span>
        <span className="text-xs opacity-90">
          {chatPrice !== null ? `Desde ${chatPrice} cred/mensaje` : 'Enviar mensaje'}
        </span>
      </button>

      <button
        onClick={() => callPrice !== null && onCall('CALL')}
        disabled={callPrice === null}
        className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg font-bold transition text-sm ${callPrice !== null
          ? 'bg-linear-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white cursor-pointer'
          : 'bg-canvas-alt text-ink-faint cursor-not-allowed opacity-60'
          }`}
      >
        <Phone size={18} />
        <span>Llamada</span>
        <span className="text-xs opacity-90">
          {callPrice !== null ? `Desde ${callPrice} cred/min` : 'No disponible'}
        </span>
      </button>

      <button
        onClick={() => videoPrice !== null && onCall('VIDEO_CALL')}
        disabled={videoPrice === null}
        className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg font-bold transition text-sm ${videoPrice !== null
          ? 'bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer'
          : 'bg-canvas-alt text-ink-faint cursor-not-allowed opacity-60'
          }`}
      >
        <Video size={18} />
        <span>Videollamada</span>
        <span className="text-xs opacity-90">
          {videoPrice !== null ? `Desde ${videoPrice} cred/min` : 'No disponible'}

        </span>
      </button>

      <button
        onClick={() => subPlan && onSubscribe()}
        disabled={!subPlan}
        className={`flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg font-bold transition text-sm ${subPlan && !subStatus?.isSubscribed
            ? 'bg-linear-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white cursor-pointer'
            : subStatus?.isSubscribed
              ? 'bg-linear-to-br from-green-600 to-green-700 text-white cursor-default'
              : 'bg-canvas-alt text-ink-faint cursor-not-allowed opacity-60'
          }`}
      >
        <Crown size={18} />
        <span>
          {subStatus?.isSubscribed ? 'Suscrito' : 'Suscribirse'}
        </span>
        <span className="text-xs opacity-90">
          {subStatus?.isSubscribed
            ? 'Acceso completo'
            : subPlan
              ? `Desde ${subPrice} cred/mes`
              : 'No disponible'}
        </span>
      </button>


      {subStatus?.isSubscribed && (
        <div className="flex flex-col items-center justify-center gap-1 bg-linear-to-br from-green-600 to-green-700 text-white px-3 py-3 rounded-lg font-bold text-sm">
          <Crown size={18} />
          <span>Suscrito</span>
          <span className="text-xs opacity-90">Acceso completo</span>
        </div>
      )}
    </div>
  );
}
