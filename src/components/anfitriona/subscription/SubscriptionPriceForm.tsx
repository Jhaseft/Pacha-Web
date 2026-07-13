'use client';

import { useState } from 'react';
import { Pencil, Gem, Save } from 'lucide-react';

interface Props {
  initialPrice?: number;
  saving: boolean;
  onSave: (price: number) => void;
}

export default function SubscriptionPriceForm({ initialPrice, saving, onSave }: Props) {
  const [price, setPrice] = useState(initialPrice ? String(initialPrice) : '');

  const handleSubmit = () => {
    const parsed = parseFloat(price);
    if (!parsed || parsed < 1) return;
    onSave(parsed);
  };

  const canSave = !!price && !saving;

  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-canvas-alt flex items-center justify-center shrink-0">
          <Pencil size={20} color="#a844f2" />
        </div>
        <div className="min-w-0">
          <p className="text-ink font-bold text-[15px]">
            {initialPrice ? 'Editar precio' : 'Crear plan'}
          </p>
          <p className="text-ink-faint text-xs mt-0.5">Define cuánto cobrarás por mes</p>
        </div>
      </div>

      {/* Input */}
      <div className="rounded-xl border border-line bg-canvas-alt flex items-center px-4 mb-4 focus-within:border-[#a844f2] transition-colors">
        <Gem size={18} color="#a844f2" className="shrink-0" />
        <input
          type="number"
          min={1}
          step="1"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canSave) handleSubmit();
          }}
          placeholder="Ej: 50"
          className="flex-1 min-w-0 bg-transparent text-ink text-lg font-bold py-3.5 px-2.5 outline-none placeholder:text-ink-faint placeholder:font-normal"
        />
        <span className="text-ink-faint text-[13px] shrink-0">créditos/mes</span>
      </div>

      {/* Botón */}
      <button
        onClick={handleSubmit}
        disabled={!canSave}
        className="w-full rounded-xl py-4 flex items-center justify-center gap-2 font-bold text-sm text-white bg-gradient-to-r from-[#a844f2] to-[#f03eb3] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        {saving ? (
          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        ) : (
          <Save size={18} />
        )}
        {saving ? 'Guardando...' : initialPrice ? 'Guardar cambios' : 'Crear plan'}
      </button>
    </div>
  );
}
