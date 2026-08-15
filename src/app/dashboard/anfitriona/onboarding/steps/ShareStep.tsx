import { Copy, Share2 } from 'lucide-react';
import { Card, PrimaryButton, StepTitle } from '../components/ui';
import { ShareBtn } from '../components/ShareButton';
import { copy, share } from '../helpers';

export function ShareStep({
  publicLink,
  onContinue,
}: {
  publicLink: string;
  onContinue: () => void;
}) {
  return (
    <Card>
      <StepTitle
        title="Comparte tu enlace"
        subtitle="Comparte tu enlace en tus redes sociales para empezar a recibir clientes."
      />
      <div className="grid grid-cols-4 gap-3">
        <ShareBtn label="WhatsApp" color="bg-emerald-500" href={`https://wa.me/?text=${encodeURIComponent(publicLink)}`} />
        <ShareBtn label="Instagram" color="bg-linear-to-br from-amber-500 via-pink-500 to-purple-600" onClick={() => copy(publicLink)} />
        <ShareBtn label="TikTok" color="bg-black" onClick={() => copy(publicLink)} />
        <ShareBtn label="Facebook" color="bg-blue-600" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicLink)}`} />
      </div>
      <div className="mt-4 space-y-2">
        <button
          onClick={() => share(publicLink)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-secondary to-brand-violet py-3 font-bold text-white shadow-md shadow-brand-violet/25"
        >
          <Share2 className="w-4 h-4" /> Compartir ahora
        </button>
        <button
          onClick={() => copy(publicLink)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-line py-3 font-bold text-ink"
        >
          <Copy className="w-4 h-4" /> Copiar enlace
        </button>
      </div>
      <PrimaryButton onClick={onContinue}>Continuar</PrimaryButton>
    </Card>
  );
}
