'use client';

import { useEffect, useState } from 'react';
import { ServiceType, ServiceConfig } from '@/types/precios';
import { apiGetMyServicePrices, apiUpsertServicePrice } from '@/lib/precios';
import PageHeader from '@/components/common/PageHeader';
import { MessageCircle, Gift, Phone, Video } from 'lucide-react';

const SERVICE_CONFIGS: ServiceConfig[] = [
  {
    type: ServiceType.MESSAGE_SEND,
    label: 'Costo por mensaje',
    description: 'Créditos que el cliente paga al enviarte un mensaje',
    unit: 'créditos',
    minPrice: 0,
    maxPrice: 100,
  },
  {
    type: ServiceType.MESSAGE,
    label: 'Regalo',
    description: 'Por cada regalo enviado al cliente',
    unit: 'créditos',
    minPrice: 0,
    maxPrice: 100,
  },
  {
    type: ServiceType.CALL,
    label: 'Llamada',
    description: 'Por minuto de llamada',
    unit: 'por minuto',
    minPrice: 1,
    maxPrice: 200,
  },
  {
    type: ServiceType.VIDEO_CALL,
    label: 'Video Llamada',
    description: 'Por minuto de videollamada',
    unit: 'por minuto',
    minPrice: 1,
    maxPrice: 300,
  },
];

const iconMap: Record<ServiceType, React.ReactNode> = {
  [ServiceType.MESSAGE_SEND]: <MessageCircle className="w-6 h-6" />,
  [ServiceType.MESSAGE]: <Gift className="w-6 h-6" />,
  [ServiceType.CALL]: <Phone className="w-6 h-6" />,
  [ServiceType.VIDEO_CALL]: <Video className="w-6 h-6" />,
};

export default function PreciosPage() {
  const [prices, setPrices] = useState<Record<ServiceType, string>>({
    MESSAGE_SEND: '',
    MESSAGE: '',
    CALL: '',
    VIDEO_CALL: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      setIsLoading(true);
      const data = await apiGetMyServicePrices();
      const mapped: Record<ServiceType, string> = {
        MESSAGE_SEND: '',
        MESSAGE: '',
        CALL: '',
        VIDEO_CALL: '',
      };
      data.forEach((sp) => {
        mapped[sp.serviceType] = String(sp.price);
      });
      setPrices(mapped);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar precios');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (serviceType: ServiceType, value: string) => {
    setPrices((prev) => ({ ...prev, [serviceType]: value }));
  };

  const handleSave = async () => {
    for (const service of SERVICE_CONFIGS) {
      const val = prices[service.type];
      if (val === '') continue;
      const num = Number(val);
      const minVal = service.type === ServiceType.MESSAGE_SEND ? 0 : 1;
      if (isNaN(num) || num < minVal) {
        const msg =
          service.type === ServiceType.MESSAGE_SEND
            ? `El precio de "${service.label}" debe ser un número mayor o igual a 0.`
            : `El precio de "${service.label}" debe ser un número mayor a 0.`;
        setError(msg);
        return;
      }
    }

    setIsSaving(true);
    try {
      await Promise.all(
        SERVICE_CONFIGS.filter((s) => prices[s.type] !== '').map((s) =>
          apiUpsertServicePrice(s.type, Number(prices[s.type]))
        )
      );
      setError('');
      alert('¡Listo! Precios guardados correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar precios');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full px-5 md:px-12 lg:px-16 py-6 md:py-8 flex-1 flex flex-col">
        <PageHeader
          title="Mis Precios"
          description="Configura los precios de tus servicios"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4 flex-1">
          {SERVICE_CONFIGS.map((config, index) => {
            const colorSchemes = [
              { border: '#132673', text: '#132673' },
              { border: '#a844f2', text: '#a844f2' },
              { border: '#f03eb3', text: '#f03eb3' },
              { border: '#132673', text: '#132673' },
            ];
            const colorConfig = colorSchemes[index % colorSchemes.length];

            return (
              <div
                key={config.type}
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
                    value={prices[config.type]}
                    onChange={(e) => handlePriceChange(config.type, e.target.value)}
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
          })}
        </div>

        <div className="pt-4 md:pt-6 pb-6 md:pb-8 mt-4 md:mt-0 flex justify-center">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-80 md:w-96 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black tracking-wide py-3 md:py-4 rounded-2xl hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'GUARDAR CAMBIOS'}
          </button>
        </div>
      </div>
    </div>
  );
}
