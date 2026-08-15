'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiUpdateProfileWithImages } from '@/lib/editar-perfil';
import { apiCreateGalleryImage, apiUpsertServicePrice } from '@/lib/perfil';
import { loadOnboardingData, computeCompletion } from '@/lib/onboarding';
import type { MyProfileData } from '@/types/perfil';
import { Loader2 } from 'lucide-react';

import {
  META,
  MIN_GALLERY_IMAGES,
  MIN_PREMIUM_IMAGES,
  SERVICES,
  type ServiceKey,
  type Step,
} from './constants';
import { back, firstStep } from './helpers';
import { Header } from './components/ui';
import { WelcomeStep } from './steps/WelcomeStep';
import { ProfileStep } from './steps/ProfileStep';
import { ServicesStep } from './steps/ServicesStep';
import { PricesStep } from './steps/PricesStep';
import { LinkStep } from './steps/LinkStep';
import { ShareStep } from './steps/ShareStep';
import { DoneStep } from './steps/DoneStep';
import { HelpStep } from './steps/HelpStep';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();

  const [step, setStep] = useState<Step>('welcome');
  const [helpReturn, setHelpReturn] = useState<Step>('welcome');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Datos del perfil ya guardados.
  const [profile, setProfile] = useState<MyProfileData | null>(null);
  const [existingPublic, setExistingPublic] = useState(0);
  const [existingPremium, setExistingPremium] = useState(0);

  // Meta 1 — perfil.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [publicFiles, setPublicFiles] = useState<File[]>([]);
  const [premiumFiles, setPremiumFiles] = useState<File[]>([]);
  const [premiumUnlock, setPremiumUnlock] = useState('10');

  // Metas 2-3 — servicios y precios.
  const [enabled, setEnabled] = useState<Record<ServiceKey, boolean>>({
    MESSAGE_SEND: true,
    CALL: true,
    VIDEO_CALL: true,
  });
  const [prices, setPrices] = useState<Record<ServiceKey, string>>({
    MESSAGE_SEND: '',
    CALL: '',
    VIDEO_CALL: '',
  });

  // ── Carga inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role !== 'ANFITRIONA') {
      router.replace('/dashboard');
      return;
    }
    (async () => {
      try {
        const data = await loadOnboardingData();
        const c = computeCompletion(data);
        setProfile(data.profile);
        setFirstName(data.profile.firstName ?? '');
        setLastName(data.profile.lastName ?? '');
        setBio(data.profile.bio ?? '');
        setExistingPublic(c.publicCount);
        setExistingPremium(c.premiumCount);
        const priceStr = (k: ServiceKey) => {
          const v = c.priceOf(k);
          return v == null ? '' : String(v);
        };
        setPrices({
          MESSAGE_SEND: priceStr('MESSAGE_SEND'),
          CALL: priceStr('CALL'),
          VIDEO_CALL: priceStr('VIDEO_CALL'),
        });
      } catch {
        setError('No se pudo cargar tu perfil. Reintenta.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, isAuthenticated, user?.role]);

  // Previews de avatar/portada.
  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);
  useEffect(() => {
    if (!coverFile) return;
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const goHelp = () => {
    setHelpReturn(step);
    setStep('help');
  };

  const totalPublic = existingPublic + publicFiles.length;
  const totalPremium = existingPremium + premiumFiles.length;

  // ── Guardado Meta 1 ────────────────────────────────────────────────────────
  const saveProfile = async () => {
    setError('');
    if (!profile) return;
    if (!avatarFile && !profile.avatarUrl) return setError('Sube tu foto de perfil.');
    if (!coverFile && !profile.coverUrl) return setError('Sube tu foto de portada.');
    if (totalPublic < MIN_GALLERY_IMAGES)
      return setError(
        `Sube al menos ${MIN_GALLERY_IMAGES} fotos a tu galería (llevas ${totalPublic}).`,
      );
    if (totalPremium < MIN_PREMIUM_IMAGES)
      return setError(
        `Sube al menos ${MIN_PREMIUM_IMAGES} fotos exclusivas (llevas ${totalPremium}).`,
      );
    if (!bio.trim()) return setError('Escribe una breve información sobre ti.');
    const unlock = Number(premiumUnlock);
    if (!unlock || unlock <= 0)
      return setError('Define cuántos créditos cuesta desbloquear tus fotos exclusivas.');

    try {
      setSaving(true);
      await apiUpdateProfileWithImages({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: profile.username,
        bio: bio.trim(),
        avatarFile: avatarFile ?? undefined,
        coverFile: coverFile ?? undefined,
      });

      for (const file of publicFiles) {
        await apiCreateGalleryImage({ isPremium: false }, file);
      }
      for (const file of premiumFiles) {
        await apiCreateGalleryImage({ isPremium: true, unlockCredits: unlock }, file);
      }

      // Consolidamos lo subido como "existente" por si vuelve al paso.
      setExistingPublic((n) => n + publicFiles.length);
      setExistingPremium((n) => n + premiumFiles.length);
      setPublicFiles([]);
      setPremiumFiles([]);
      setAvatarFile(null);
      setCoverFile(null);
      setStep('services');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar tu perfil.');
    } finally {
      setSaving(false);
    }
  };

  // ── Guardado Metas 2-3 ─────────────────────────────────────────────────────
  const savePrices = async () => {
    setError('');
    const active = SERVICES.filter((s) => enabled[s.key]);
    if (active.length === 0) return setError('Activa al menos un servicio.');
    if (!enabled.MESSAGE_SEND) return setError('El chat privado es obligatorio.');
    for (const s of active) {
      const n = Number(prices[s.key]);
      if (prices[s.key].trim() === '' || isNaN(n) || n < 0)
        return setError(`Define un precio válido para "${s.title}" (0 = gratis).`);
    }
    try {
      setSaving(true);
      await Promise.all(
        active.map((s) => apiUpsertServicePrice(s.key, Number(prices[s.key]))),
      );
      setStep('link');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudieron guardar los precios.');
    } finally {
      setSaving(false);
    }
  };

  const publicLink =
    typeof window !== 'undefined' && profile
      ? `${window.location.origin}/@${profile.username}`
      : profile
        ? `monetizalab.com/@${profile.username}`
        : '';

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas">
        <Loader2 className="w-9 h-9 animate-spin text-brand-violet" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-linear-to-b from-canvas via-brand-soft/30 to-canvas">
      <div className="min-h-full flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-xl">
          {step !== 'welcome' && step !== 'done' && step !== 'help' && (
            <Header
              meta={META[step]}
              onBack={() => back(step, setStep)}
              onHelp={goHelp}
            />
          )}

          {step === 'welcome' && (
            <WelcomeStep
              name={firstName || user?.firstName || ''}
              onStart={() => setStep(firstStep())}
              onHelp={goHelp}
            />
          )}

          {step === 'profile' && (
            <ProfileStep
              profile={profile}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              bio={bio}
              setBio={setBio}
              avatarPreview={avatarPreview}
              onPickAvatar={setAvatarFile}
              coverPreview={coverPreview}
              onPickCover={setCoverFile}
              publicFiles={publicFiles}
              setPublicFiles={setPublicFiles}
              totalPublic={totalPublic}
              premiumFiles={premiumFiles}
              setPremiumFiles={setPremiumFiles}
              totalPremium={totalPremium}
              premiumUnlock={premiumUnlock}
              setPremiumUnlock={setPremiumUnlock}
              saving={saving}
              error={error}
              onSubmit={saveProfile}
            />
          )}

          {step === 'services' && (
            <ServicesStep
              enabled={enabled}
              setEnabled={setEnabled}
              onContinue={() => setStep('prices')}
            />
          )}

          {step === 'prices' && (
            <PricesStep
              enabled={enabled}
              prices={prices}
              setPrices={setPrices}
              saving={saving}
              error={error}
              onSubmit={savePrices}
            />
          )}

          {step === 'link' && (
            <LinkStep publicLink={publicLink} onContinue={() => setStep('share')} />
          )}

          {step === 'share' && (
            <ShareStep publicLink={publicLink} onContinue={() => setStep('done')} />
          )}

          {step === 'done' && (
            <DoneStep onFinish={() => router.replace('/dashboard/anfitriona')} />
          )}

          {step === 'help' && <HelpStep onBack={() => setStep(helpReturn)} />}
        </div>
      </div>
    </div>
  );
}
