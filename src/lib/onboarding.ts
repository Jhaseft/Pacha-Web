import { apiGetMyProfile, apiGetMyGallery, apiGetMyServicePrices } from './perfil';
import type { MyProfileData, GalleryItem, ServicePrice } from '@/types/perfil';

// Mínimos que el onboarding exige (el backend no los valida; son de producto).
export const MIN_PUBLIC_PHOTOS = 5;
export const MIN_PREMIUM_PHOTOS = 2;

export interface OnboardingData {
  profile: MyProfileData;
  gallery: GalleryItem[];
  prices: ServicePrice[];
}

export interface OnboardingCompletion {
  publicCount: number;
  premiumCount: number;
  priceOf: (serviceType: string) => number;
  /** Meta 1: perfil (avatar, portada, bio y fotos mínimas). */
  profileOk: boolean;
  /** Metas 2-3: al menos el chat tiene precio (> 0). */
  servicesOk: boolean;
  /** El perfil está listo para operar. */
  complete: boolean;
}

/**
 * Carga en paralelo todo lo necesario para conocer el estado del onboarding.
 * La galería y los precios pueden fallar sin romper el flujo (perfil recién
 * creado): se devuelven vacíos.
 */
export async function loadOnboardingData(): Promise<OnboardingData> {
  const [profile, gallery, prices] = await Promise.all([
    apiGetMyProfile(),
    apiGetMyGallery().catch(() => [] as GalleryItem[]),
    apiGetMyServicePrices().catch(() => [] as ServicePrice[]),
  ]);
  return { profile, gallery, prices };
}

/**
 * Deriva el avance del onboarding del estado REAL del perfil, no de un flag
 * aparte. Así el progreso "se guarda" solo: al volver, se recalcula.
 */
export function computeCompletion({
  profile,
  gallery,
  prices,
}: OnboardingData): OnboardingCompletion {
  const publicCount = gallery.filter((g) => !g.isPremium).length;
  const premiumCount = gallery.filter((g) => g.isPremium).length;
  const priceOf = (serviceType: string) =>
    prices.find((p) => p.serviceType === serviceType)?.price ?? 0;

  const profileOk =
    !!profile.avatarUrl &&
    !!profile.coverUrl &&
    !!profile.bio?.trim() &&
    publicCount >= MIN_PUBLIC_PHOTOS &&
    premiumCount >= MIN_PREMIUM_PHOTOS;

  const servicesOk = priceOf('MESSAGE_SEND') > 0;

  return {
    publicCount,
    premiumCount,
    priceOf,
    profileOk,
    servicesOk,
    complete: profileOk && servicesOk,
  };
}
