import { EarningsData } from '@/types/perfil';

interface EarningsSectionProps {
  earnings: EarningsData | null;
}

export function EarningsSection({ earnings }: EarningsSectionProps) {
  const formatUSD = (credits: number) => {
    return `$${(credits * 0.01).toFixed(2)}`;
  };

  return (
    <div className="relative rounded-2xl overflow-hidden p-1 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600">
      <div
        className="rounded-2xl p-4 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.4) 0%, rgba(37, 99, 235, 0.4) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex-1 text-center">
          <p className="text-pink-400 text-sm font-bold mb-1">🔥 Ganaste hoy</p>
          <p className="text-white font-bold text-lg">{earnings?.today ?? 0} créditos</p>
          <p className="text-blue-200 text-xs font-semibold">≈ {formatUSD(earnings?.today ?? 0)}</p>
        </div>

        <div className="w-px h-10 bg-white/20 mx-3" />

        {/* Right column: This week */}
        <div className="flex-1 text-center">
          <p className="text-white/80 text-sm font-semibold mb-1">Esta semana</p>
          <p className="text-white font-bold text-lg">{earnings?.thisWeek ?? 0} créditos</p>
          <p className="text-blue-200 text-xs font-semibold">≈ {formatUSD(earnings?.thisWeek ?? 0)}</p>
        </div>
      </div>
    </div>
  );
}
