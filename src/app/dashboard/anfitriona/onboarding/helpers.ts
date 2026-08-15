import type { Step } from './constants';

export function firstStep(): Step {
  return 'profile';
}

export function back(step: Step, setStep: (s: Step) => void) {
  const order: Step[] = ['profile', 'services', 'prices', 'link', 'share'];
  const i = order.indexOf(step);
  if (i <= 0) setStep('welcome');
  else setStep(order[i - 1]);
}

export async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Enlace copiado');
  } catch {
    /* noop */
  }
}

export async function share(text: string) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: 'Mi enlace de MonetizaLab', url: text });
      return;
    } catch {
      /* cancelado */
    }
  }
  copy(text);
}
