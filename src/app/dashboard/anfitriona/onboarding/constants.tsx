import type { ReactNode } from 'react';
import { MessageCircle, Phone, Video } from 'lucide-react';

export const WHATSAPP_SUPPORT = '51987654321';

/** Mínimo de fotos obligatorias en la galería pública. */
export const MIN_GALLERY_IMAGES = 5;

/** Mínimo de fotos exclusivas (premium) obligatorias. */
export const MIN_PREMIUM_IMAGES = 2;

export type Step =
  | 'welcome'
  | 'profile'
  | 'services'
  | 'prices'
  | 'link'
  | 'share'
  | 'done'
  | 'help';

export type ServiceKey = 'MESSAGE_SEND' | 'CALL' | 'VIDEO_CALL';

/** Metas con su número y % de avance (como en el mockup). */
export const META: Record<string, { n: number; pct: number }> = {
  profile: { n: 1, pct: 20 },
  services: { n: 2, pct: 40 },
  prices: { n: 3, pct: 60 },
  link: { n: 4, pct: 80 },
  share: { n: 5, pct: 100 },
};

export const SERVICES: {
  key: ServiceKey;
  title: string;
  subtitle: string;
  unit: string;
  icon: ReactNode;
  color: string;
}[] = [
  {
    key: 'MESSAGE_SEND',
    title: 'Chat privado',
    subtitle: 'Chatea con tus seguidores',
    unit: 'por mensaje',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'from-brand-violet to-brand',
  },
  {
    key: 'CALL',
    title: 'Llamadas',
    subtitle: 'Llamadas de voz',
    unit: 'por minuto',
    icon: <Phone className="w-5 h-5" />,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    key: 'VIDEO_CALL',
    title: 'Videollamadas',
    subtitle: 'Videollamadas en vivo',
    unit: 'por minuto',
    icon: <Video className="w-5 h-5" />,
    color: 'from-secondary to-pink-600',
  },
];
