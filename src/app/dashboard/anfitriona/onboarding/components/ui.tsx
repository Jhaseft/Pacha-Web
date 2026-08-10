import type { ReactNode } from 'react';
import { ArrowLeft, Check, Headphones, Loader2 } from 'lucide-react';

export function Card({
  children,
  center,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={`rounded-[26px] bg-card shadow-2xl shadow-brand/10 ring-1 ring-line p-6 sm:p-7 ${
        center ? 'text-center' : ''
      }`}
    >
      {children}
    </div>
  );
}

export function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-black text-ink mb-1">{title}</h1>
      <p className="text-ink-soft text-sm">{subtitle}</p>
    </div>
  );
}

export function FieldRow({
  index,
  title,
  hint,
  done,
  children,
  last,
}: {
  index: number;
  title: string;
  hint: string;
  done: boolean;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`${last ? '' : 'border-b border-line pb-5 mb-5'}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-bold text-ink text-sm">
            {index}. {title}
          </p>
          <p className="text-ink-faint text-xs">{hint}</p>
        </div>
        {done && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="w-4 h-4" />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function HowStep({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-brand-soft/40 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card text-brand-violet">
        {icon}
      </span>
      <p className="text-sm text-ink-soft">{text}</p>
    </div>
  );
}

export function Toggle({
  on,
  onToggle,
  disabled,
}: {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onToggle}
      className={`relative h-7 w-12 rounded-full transition-colors ${
        on ? 'bg-brand-violet' : 'bg-line'
      } ${disabled ? 'opacity-70' : ''}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
          on ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

export function Header({
  meta,
  onBack,
  onHelp,
}: {
  meta: { n: number; pct: number };
  onBack: () => void;
  onHelp: () => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink-soft"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onHelp}
          className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-brand-violet"
        >
          <Headphones className="w-3.5 h-3.5" /> Soporte
        </button>
      </div>
      <div className="flex items-center justify-between text-sm font-semibold text-ink mb-1.5">
        <span>Meta {meta.n} de 5</span>
        <span className="text-ink-soft">{meta.pct}% completado</span>
      </div>
      <div className="h-2 rounded-full bg-line overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-secondary to-brand-violet transition-all"
          style={{ width: `${meta.pct}%` }}
        />
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  loading,
  error,
}: {
  children: ReactNode;
  onClick: () => void;
  loading?: boolean;
  error?: string;
}) {
  return (
    <>
      <button
        onClick={onClick}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-secondary to-brand-violet py-3.5 font-black text-white shadow-lg shadow-brand-violet/25 transition-transform hover:scale-[1.01] disabled:opacity-50"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
      {error && (
        <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center">
          {error}
        </div>
      )}
    </>
  );
}
