'use client';

import { EarningTransaction } from '@/types/anfitriona';
import { MessageCircle, Image as ImageIcon, Phone, Video, TrendingUp } from 'lucide-react';
import { AnimatedBorderCard } from './AnimatedBorderCard';

function getServiceIcon(service: string) {
  const s = service.toLowerCase();
  if (s.includes('mensaje')) return <MessageCircle size={30} className="text-white" />;
  if (s.includes('foto') || s.includes('imagen') || s.includes('galería') || s.includes('privada'))
    return <ImageIcon size={30} className="text-white" />;
  if (s.includes('llamada')) return <Phone size={30} className="text-white" />;
  if (s.includes('video')) return <Video size={30} className="text-white" />;
  return <TrendingUp size={30} className="text-white" />;
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
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-2xl p-3 md:p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-purple-600 flex items-center justify-center flex-shrink-0">
            {getServiceIcon(tx.service)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-xs md:text-sm">{tx.service}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {tx.clientName && (
                <p className="text-purple-300 text-xs">{tx.clientName}</p>
              )}
              <p className="text-gray-400 text-xs">
                {new Date(tx.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-yellow-300 text-sm md:text-base font-black">+{tx.amount} cr</p>
            <p className="text-yellow-300 text-xs font-semibold mt-0.5 opacity-80">
              {formatUSD(tx.amount)}
            </p>
          </div>
        </div>
      </div>
    </AnimatedBorderCard>
  );
}
