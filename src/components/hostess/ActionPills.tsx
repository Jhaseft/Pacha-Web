'use client';

import { ServicePrice } from '@/lib/hostessService';
import { Heart, Phone, Video } from 'lucide-react';

interface ActionPillsProps {
  profile: {
    name: string;
    likesCount: number;
  };
  servicePrices: ServicePrice[];
  onCall: (type: 'CALL' | 'VIDEO_CALL') => void;
  onViewStories: () => void;
}

export default function ActionPills({
  profile,
  servicePrices,
  onCall,
}: ActionPillsProps) {
  const getPrice = (type: ServicePrice['serviceType']) =>
    servicePrices.find((p) => p.serviceType === type)?.price ?? null;

  const callPrice = getPrice('CALL');
  const videoPrice = getPrice('VIDEO_CALL');

  return (
    <div className="flex flex-wrap gap-3 pb-2">
      {callPrice !== null && (
        <button
          onClick={() => onCall('CALL')}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-full text-sm font-bold transition"
        >
          <Phone size={16} />
          Llamada · {callPrice} cr/min
        </button>
      )}

      {videoPrice !== null && (
        <button
          onClick={() => onCall('VIDEO_CALL')}
          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-full text-sm font-bold transition"
        >
          <Video size={16} />
          Video · {videoPrice} cr/min
        </button>
      )}

      <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 text-gray-300 px-4 py-2.5 rounded-full text-sm font-semibold">
        <Heart size={16} className="text-red-500" />
        <span>{profile.likesCount}</span>
      </div>
    </div>
  );
}
