'use client';

import { ServiceConfig, ServiceType } from '@/types/precios';
import { MessageCircle, Phone, Video, Gift } from 'lucide-react';

interface PriceCardProps {
  config: ServiceConfig;
  price: string;
  onPriceChange: (value: string) => void;
  index?: number;
}

const iconMap: Record<ServiceType, React.ReactNode> = {
  [ServiceType.MESSAGE_SEND]: <MessageCircle className="w-6 h-6" />,
  [ServiceType.MESSAGE]: <Gift className="w-6 h-6" />,
  [ServiceType.CALL]: <Phone className="w-6 h-6" />,
  [ServiceType.VIDEO_CALL]: <Video className="w-6 h-6" />,
};

const colorSchemes = [
  { border: '#132673', text: '#132673' },
  { border: '#a844f2', text: '#a844f2' },
  { border: '#f03eb3', text: '#f03eb3' },
  { border: '#132673', text: '#132673' },
];

export default function PriceCard({ config, price, onPriceChange, index = 0 }: PriceCardProps) {
  const colorConfig = colorSchemes[index % colorSchemes.length];

  return (
    <div
      className="transition-all hover:shadow-lg shadow-sm"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: colorConfig.border,
        background: 'linear-gradient(135deg, rgba(168, 68, 242, 0.08) 0%, rgba(240, 62, 179, 0.08) 100%)',
        borderRadius: '16px',
        padding: '16px',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div style={{ color: colorConfig.text }}>
          {iconMap[config.type]}
        </div>
        <h3 className="text-ink text-sm font-bold tracking-wide uppercase">
          {config.label}
        </h3>
      </div>

      <p className="text-ink-faint text-xs mb-3 leading-4">
        {config.description}
      </p>

      <div className="flex items-center gap-2">
        <span className="text-ink font-semibold text-sm">S/</span>
        <input
          type="number"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="0"
          className="flex-1 bg-white/10 border rounded-lg px-3 py-2 text-ink placeholder-gray-400 focus:outline-none focus:ring-2 font-semibold text-sm"
          style={{
            borderColor: colorConfig.border,
            borderWidth: '1px',
          }}
        />
        <span className="text-ink font-semibold text-sm">{config.unit}</span>
      </div>
    </div>
  );
}
