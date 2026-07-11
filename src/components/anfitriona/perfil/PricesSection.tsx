import { MyProfileData, ServicePrice } from '@/types/perfil';

interface PricesSectionProps {
  profile: MyProfileData | null;
  servicePrices: ServicePrice[];
}

export function PricesSection({ profile, servicePrices }: PricesSectionProps) {
  const getLabel = (serviceType: string) => {
    const typeMap: Record<string, { icon: string; label: string; unit: string }> = {
      MESSAGE: { icon: '💬', label: 'Chat', unit: 'crédito' },
      CALL: { icon: '📞', label: 'Voz', unit: 'créditos/min' },
      VIDEO_CALL: { icon: '🎥', label: 'Video', unit: 'créditos/min' },
    };
    return typeMap[serviceType];
  };

  const filteredPrices = servicePrices.filter(price => getLabel(price.serviceType));

  return (
    <div className="relative rounded-2xl overflow-hidden p-1 bg-gradient-to-br from-blue-700 to-blue-800">
      {/* Inner content with darker blue background */}
      <div
        className="rounded-2xl p-4 space-y-2"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)',
        }}
      >
        {filteredPrices.length > 0 ? (
          filteredPrices.map((price) => {
            const label = getLabel(price.serviceType);
            if (!label) return null;
            return (
              <div key={price.serviceType} className="text-white text-sm">
                <span className="font-bold">
                  {label.icon} {label.label}:
                </span>
                {' '}
                {price.price} {label.unit}
              </div>
            );
          })
        ) : (
          <p className="text-white/40 text-sm">Sin precios configurados</p>
        )}

        {profile?.bio && (
          <p className="text-white text-xs mt-3 pt-3 border-t border-white/10">
            🔥 {profile.bio}
          </p>
        )}
      </div>
    </div>
  );
}
