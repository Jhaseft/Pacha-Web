import type { Dispatch, SetStateAction } from 'react';
import { Card, PrimaryButton, StepTitle, Toggle } from '../components/ui';
import { SERVICES, type ServiceKey } from '../constants';

export function ServicesStep({
  enabled,
  setEnabled,
  onContinue,
}: {
  enabled: Record<ServiceKey, boolean>;
  setEnabled: Dispatch<SetStateAction<Record<ServiceKey, boolean>>>;
  onContinue: () => void;
}) {
  return (
    <Card>
      <StepTitle
        title="Activa tus servicios"
        subtitle="Elige los servicios que ofrecerás a tus clientes."
      />
      <div className="space-y-3">
        {SERVICES.map((s) => (
          <div
            key={s.key}
            className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${s.color} text-white`}
            >
              {s.icon}
            </span>
            <div className="flex-1">
              <p className="font-bold text-ink text-sm">{s.title}</p>
              <p className="text-ink-faint text-xs">{s.subtitle}</p>
            </div>
            <Toggle
              on={enabled[s.key]}
              disabled={s.key === 'MESSAGE_SEND'}
              onToggle={() => setEnabled((e) => ({ ...e, [s.key]: !e[s.key] }))}
            />
          </div>
        ))}
      </div>
      <PrimaryButton onClick={onContinue}>Continuar</PrimaryButton>
    </Card>
  );
}
