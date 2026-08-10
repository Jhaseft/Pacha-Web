import { Check, PartyPopper } from 'lucide-react';
import { Card, PrimaryButton } from '../components/ui';

export function DoneStep({ onFinish }: { onFinish: () => void }) {
  return (
    <Card center>
      <PartyPopper className="mx-auto mb-3 w-14 h-14 text-secondary" />
      <h1 className="text-2xl font-black text-ink mb-1">¡Felicidades! 🎉</h1>
      <p className="text-ink-soft text-sm mb-5">
        Tu perfil está listo y tu enlace ya está activo.
      </p>
      <ul className="mx-auto mb-5 max-w-xs space-y-2 text-left">
        {['Perfil completo', 'Servicios activados', 'Precios configurados', 'Enlace generado'].map(
          (t) => (
            <li key={t} className="flex items-center gap-2 text-sm text-ink">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="w-3.5 h-3.5" />
              </span>
              {t}
            </li>
          ),
        )}
      </ul>
      <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        Ahora empieza a compartir tu enlace y recibe tus primeros clientes.
      </div>
      <PrimaryButton onClick={onFinish}>Ir a mi panel</PrimaryButton>
    </Card>
  );
}
