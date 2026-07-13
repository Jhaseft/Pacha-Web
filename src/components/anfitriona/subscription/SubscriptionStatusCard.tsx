'use client';

import { Crown, Tag, PauseCircle, PlayCircle } from 'lucide-react';
import type { SubscriptionPlan } from '@/types/subscriptions';

interface Props {
  plan: SubscriptionPlan;
  toggling: boolean;
  onToggle: () => void;
}

export default function SubscriptionStatusCard({ plan, toggling, onToggle }: Props) {
  const isActive = plan.isActive;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm bg-card ${
        isActive ? 'border-[#a844f2]/40' : 'border-line'
      }`}
    >
      {/* Estado */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isActive ? 'bg-[#a844f2]/10' : 'bg-canvas-alt'
            }`}
          >
            <Crown size={22} color={isActive ? '#f03eb3' : '#9ca3af'} />
          </div>
          <p className="text-ink font-bold text-lg truncate">Mi plan</p>
        </div>

        <div
          className={`rounded-full px-3 py-1 border text-[11px] font-bold whitespace-nowrap shrink-0 ${
            isActive
              ? 'bg-[#a844f2]/10 border-[#a844f2]/40 text-[#f03eb3]'
              : 'bg-canvas-alt border-line text-ink-faint'
          }`}
        >
          {isActive ? '● ACTIVO' : '● INACTIVO'}
        </div>
      </div>

      {/* Precio */}
      <div className="rounded-xl bg-canvas-alt p-4 flex items-center gap-3 mb-4">
        <Tag size={18} color="#a844f2" className="shrink-0" />
        <div className="min-w-0">
          <p className="text-ink-faint text-[10px] uppercase tracking-widest">Precio mensual</p>
          <p className="text-ink text-[22px] font-black mt-0.5">
            {plan.price}
            <span className="text-ink-faint text-[13px] font-normal"> créditos/mes</span>
          </p>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        disabled={toggling}
        className={`w-full rounded-xl py-4 flex items-center justify-center gap-2 border font-bold text-sm transition-colors disabled:opacity-60 ${
          isActive
            ? 'border-[#a844f2]/40 bg-[#a844f2]/5 text-[#a844f2] hover:bg-[#a844f2]/10'
            : 'border-green-500/40 bg-green-500/5 text-green-600 hover:bg-green-500/10'
        }`}
      >
        {toggling ? (
          <span
            className={`w-4 h-4 rounded-full border-2 border-t-transparent animate-spin ${
              isActive ? 'border-[#a844f2]' : 'border-green-600'
            }`}
          />
        ) : isActive ? (
          <PauseCircle size={20} />
        ) : (
          <PlayCircle size={20} />
        )}
        {isActive ? 'Desactivar plan' : 'Activar plan'}
      </button>
    </div>
  );
}
