'use client';

import { ServiceType, ServiceConfig } from '@/types/precios';
import PriceCard from './PriceCard';

interface PricesListProps {
  prices: Record<ServiceType, string>;
  configs: ServiceConfig[];
  onPriceChange: (serviceType: ServiceType, value: string) => void;
}

export default function PricesList({
  prices,
  configs,
  onPriceChange,
}: PricesListProps) {
  return (
    <div className="space-y-4">
      {configs.map((config, index) => (
        <PriceCard
          key={config.type}
          config={config}
          price={prices[config.type]}
          onPriceChange={(value) => onPriceChange(config.type, value)}
          index={index}
        />
      ))}
    </div>
  );
}
