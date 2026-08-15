import type { Dispatch, SetStateAction } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, PrimaryButton, StepTitle } from '../components/ui';
import { SERVICES, type ServiceKey } from '../constants';

export function PricesStep({
  enabled,
  prices,
  setPrices,
  saving,
  error,
  onSubmit,
}: {
  enabled: Record<ServiceKey, boolean>;
  prices: Record<ServiceKey, string>;
  setPrices: Dispatch<SetStateAction<Record<ServiceKey, string>>>;
  saving: boolean;
  error: string;
  onSubmit: () => void;
}) {
  return (
    <Card>
      <StepTitle
        title="Configura tus precios"
        subtitle="Define cuánto cobrarás por cada servicio."
      />
      <div className="space-y-3">
        {SERVICES.filter((s) => enabled[s.key]).map((s) => (
          <div key={s.key} className="rounded-2xl border border-line bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br ${s.color} text-white`}
              >
                {s.icon}
              </span>
              <p className="font-bold text-ink text-sm">{s.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-ink-soft text-sm font-semibold">Cr</span>
              <input
                type="number"
                min={0}
                value={prices[s.key]}
                onChange={(e) => setPrices((p) => ({ ...p, [s.key]: e.target.value }))}
                placeholder="0.00"
                className="flex-1 rounded-lg border border-line px-3 py-2 text-ink outline-none focus:border-brand-violet font-semibold"
              />
              <span className="text-ink-faint text-xs w-20 text-right">{s.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-soft/60 px-3 py-2.5">
        <Sparkles className="w-4 h-4 shrink-0 text-brand-violet mt-0.5" />
        <p className="text-xs text-ink-soft">Puedes cambiar estos precios cuando quieras.</p>
      </div>
      <PrimaryButton onClick={onSubmit} loading={saving} error={error}>
        Continuar
      </PrimaryButton>
    </Card>
  );
}
