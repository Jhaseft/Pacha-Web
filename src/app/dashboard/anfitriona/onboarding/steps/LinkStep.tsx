import { Copy, Link2, Share2 } from 'lucide-react';
import { Card, PrimaryButton, StepTitle } from '../components/ui';
import { copy, share } from '../helpers';

export function LinkStep({
  publicLink,
  onContinue,
}: {
  publicLink: string;
  onContinue: () => void;
}) {
  return (
    <Card>
      <StepTitle
        title="Obtén tu enlace"
        subtitle="Este es tu enlace personal de MonetizaLab."
      />
      <div className="rounded-2xl border border-line bg-card p-5 text-center shadow-sm">
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-violet">
          <Link2 className="w-7 h-7" />
        </span>
        <p className="font-black text-brand-violet break-all">{publicLink}</p>
        <p className="mt-2 text-xs text-ink-soft">
          Tus seguidores podrán encontrarte y contactarte desde este enlace.
        </p>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => copy(publicLink)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-secondary to-brand-violet py-3 font-bold text-white shadow-md shadow-brand-violet/25"
          >
            <Copy className="w-4 h-4" /> Copiar enlace
          </button>
          <button
            onClick={() => share(publicLink)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-line py-3 font-bold text-ink"
          >
            <Share2 className="w-4 h-4" /> Compartir enlace
          </button>
        </div>
      </div>
      <PrimaryButton onClick={onContinue}>Continuar</PrimaryButton>
    </Card>
  );
}
