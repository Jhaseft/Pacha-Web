'use client';

import { EarningTransaction } from '@/types/anfitriona';
import { MessageCircle, Image as ImageIcon, Phone, Video, TrendingUp } from 'lucide-react';
import { AnimatedBorderCard } from './AnimatedBorderCard';

function getServiceIcon(service: string) {
  const s = service.toLowerCase();
  if (s.includes('mensaje')) return <MessageCircle size={22} className="text-white" />;
  if (s.includes('foto') || s.includes('imagen') || s.includes('galería') || s.includes('privada'))
    return <ImageIcon size={22} className="text-white" />;
  if (s.includes('llamada')) return <Phone size={22} className="text-white" />;
  if (s.includes('video')) return <Video size={22} className="text-white" />;
  return <TrendingUp size={22} className="text-white" />;
}

export function TransactionItem({
  tx,
  formatUSD,
}: {
  tx: EarningTransaction;
  formatUSD: (n: number) => string;
}) {
  return (
    <AnimatedBorderCard>
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-4xl p-5 md:p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-3xl bg-purple-600 flex items-center justify-center flex-shrink-0">
            {getServiceIcon(tx.service)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm md:text-base">{tx.service}</p>
            {tx.clientName && (
              <p className="text-purple-300 text-xs mt-0.5">{tx.clientName}</p>
            )}
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              {new Date(tx.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-yellow-300 text-sm md:text-base font-black">+{tx.amount} cr</p>
            <p className="text-yellow-300 text-xs md:text-sm font-semibold opacity-70 mt-1">
              ≈ {formatUSD(tx.amount)}
            </p>
          </div>
        </div>
      </div>
    </AnimatedBorderCard>
  );
}
