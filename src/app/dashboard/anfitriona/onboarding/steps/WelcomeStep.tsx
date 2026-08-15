import { Check, DollarSign, Headphones, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { Card, HowStep, PrimaryButton } from '../components/ui';

export function WelcomeStep({
  name,
  onStart,
  onHelp,
}: {
  name: string;
  onStart: () => void;
  onHelp: () => void;
}) {
  return (
    <Card>
      <div className="flex justify-end">
        <button
          onClick={onHelp}
          className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-brand-violet"
        >
          <Headphones className="w-3.5 h-3.5" /> Soporte
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 mt-2 mb-4">
        <span className="text-ink font-black text-2xl tracking-tight">
          Monetiza<span className="text-brand-violet">Lab</span>
        </span>
      </div>
      <h1 className="text-center text-3xl font-black text-ink mb-2">
        ¡Bienvenido{name ? `, ${name}` : ''}! 👋
      </h1>
      <p className="text-center text-ink-soft text-sm mb-1">
        Estás a pasos de comenzar a monetizar tu comunidad.
      </p>
      <p className="text-center text-ink-soft text-sm mb-6">
        Te guiaremos paso a paso para dejar tu perfil listo.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-2">
        <HowStep icon={<Users className="w-4 h-4" />} text="Los usuarios te encuentran por tu enlace." />
        <HowStep icon={<MessageCircle className="w-4 h-4" />} text="Te escriben, te llaman o piden contenido." />
        <HowStep icon={<DollarSign className="w-4 h-4" />} text="Ganas dinero por cada interacción o venta." />
        <HowStep icon={<TrendingUp className="w-4 h-4" />} text="Haces crecer tu comunidad y tus ingresos." />
      </div>

      <PrimaryButton onClick={onStart}>Comenzar</PrimaryButton>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-600">
        <Check className="w-3.5 h-3.5" /> Es rápido, fácil y 100% seguro
      </p>
    </Card>
  );
}
