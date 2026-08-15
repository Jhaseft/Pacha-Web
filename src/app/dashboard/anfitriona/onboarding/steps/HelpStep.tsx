import { ArrowLeft, BookOpen, ChevronRight, Headphones, Sparkles } from 'lucide-react';
import { Card } from '../components/ui';
import { WHATSAPP_SUPPORT } from '../constants';

export function HelpStep({ onBack }: { onBack: () => void }) {
  return (
    <Card>
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-ink-soft text-sm hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>
      <Headphones className="mx-auto mb-3 w-12 h-12 text-brand-violet" />
      <h1 className="text-center text-2xl font-black text-ink mb-1">¿Necesitas ayuda?</h1>
      <p className="text-center text-ink-soft text-sm mb-5">
        Estamos aquí para apoyarte en lo que necesites.
      </p>
      <div className="space-y-3">
        <a
          href="/soy-nuevo"
          className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-violet">
            <BookOpen className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <p className="font-bold text-ink text-sm">Centro de ayuda</p>
            <p className="text-ink-faint text-xs">
              Resuelve tus dudas con nuestras preguntas frecuentes y guías.
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-faint" />
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_SUPPORT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Headphones className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <p className="font-bold text-ink text-sm">Hablar con un asesor</p>
            <p className="text-ink-faint text-xs">Te atenderemos por WhatsApp en minutos.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-faint" />
        </a>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-soft/50 px-3 py-2.5 text-xs text-ink-soft">
        <Sparkles className="w-4 h-4 text-brand-violet" />
        No te preocupes, tu progreso está guardado.
      </div>
    </Card>
  );
}
