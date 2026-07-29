'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiUpdateProfileWithImages } from '@/lib/editar-perfil';
import { apiCreateGalleryImage, apiUpsertServicePrice } from '@/lib/perfil';
import {
  loadOnboardingData,
  computeCompletion,
} from '@/lib/onboarding';
import type { MyProfileData } from '@/types/perfil';
import {
  ArrowLeft,
  Check,
  Camera,
  ImageIcon,
  Plus,
  MessageCircle,
  Phone,
  Video,
  Lock,
  Loader2,
  Link2,
  Copy,
  Share2,
  PartyPopper,
  Headphones,
  BookOpen,
  ChevronRight,
  Sparkles,
  Users,
  DollarSign,
  TrendingUp,
  Zap,
} from 'lucide-react';

const WHATSAPP_SUPPORT = '51987654321';

type Step =
  | 'welcome'
  | 'profile'
  | 'services'
  | 'prices'
  | 'link'
  | 'share'
  | 'done'
  | 'help';

// Metas con su número y % de avance (como en el mockup).
const META: Record<string, { n: number; pct: number }> = {
  profile: { n: 1, pct: 20 },
  services: { n: 2, pct: 40 },
  prices: { n: 3, pct: 60 },
  link: { n: 4, pct: 80 },
  share: { n: 5, pct: 100 },
};

type ServiceKey = 'MESSAGE_SEND' | 'CALL' | 'VIDEO_CALL';

const SERVICES: {
  key: ServiceKey;
  title: string;
  subtitle: string;
  unit: string;
  icon: React.ReactNode;
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
    if (!bio.trim()) return setError('Escribe una breve información sobre ti.');
    // Las fotos son opcionales: la anfitriona puede completar su galería más tarde.
    const unlock = Number(premiumUnlock);
    if (premiumFiles.length > 0 && (!unlock || unlock <= 0))
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

          {/* ─────────── Bienvenida ─────────── */}
          {step === 'welcome' && (
            <Welcome
              name={firstName || user?.firstName || ''}
              onStart={() => setStep(firstStep())}
              onHelp={goHelp}
            />
          )}

          {/* ─────────── Meta 1: Perfil ─────────── */}
          {step === 'profile' && (
            <Card>
              <StepTitle
                title="Completa tu perfil"
                subtitle="Tu perfil debe ser atractivo para que los usuarios quieran conocerte."
              />

              {/* Foto de perfil */}
              <FieldRow
                index={1}
                title="Foto de perfil"
                hint="Una foto clara donde se vea tu rostro."
                done={!!(avatarPreview || profile?.avatarUrl)}
              >
                <ImagePicker
                  round
                  preview={avatarPreview || profile?.avatarUrl || null}
                  onPick={setAvatarFile}
                />
              </FieldRow>

              {/* Foto de portada */}
              <FieldRow
                index={2}
                title="Foto de portada"
                hint="Una imagen llamativa que represente tu estilo."
                done={!!(coverPreview || profile?.coverUrl)}
              >
                <ImagePicker
                  wide
                  preview={coverPreview || profile?.coverUrl || null}
                  onPick={setCoverFile}
                />
              </FieldRow>

              {/* Galería pública */}
              <FieldRow
                index={3}
                title="Galería de fotos (opcional)"
                hint="Muestra tu mejor contenido. Puedes agregarlas ahora o más tarde."
                done={totalPublic > 0}
              >
                <MultiImagePicker files={publicFiles} onChange={setPublicFiles} />
                <p className="mt-1 text-xs font-semibold text-brand-violet">
                  {totalPublic} foto{totalPublic === 1 ? '' : 's'} subida{totalPublic === 1 ? '' : 's'}
                </p>
              </FieldRow>

              {/* Fotos exclusivas */}
              <FieldRow
                index={4}
                title="Fotos exclusivas (opcional)"
                hint="Fotos que solo verán tus clientes que paguen por ellas."
                done={totalPremium > 0}
              >
                <MultiImagePicker files={premiumFiles} onChange={setPremiumFiles} premium />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-ink-soft">Desbloqueo:</span>
                  <input
                    type="number"
                    min={1}
                    value={premiumUnlock}
                    onChange={(e) => setPremiumUnlock(e.target.value)}
                    className="w-20 rounded-lg border border-line px-2 py-1 text-sm text-ink outline-none focus:border-brand-violet"
                  />
                  <span className="text-xs text-ink-soft">créditos c/u</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-brand-violet">
                  {totalPremium} foto{totalPremium === 1 ? '' : 's'} exclusiva{totalPremium === 1 ? '' : 's'}
                </p>
              </FieldRow>

              {/* Información básica */}
              <FieldRow
                index={5}
                title="Información básica"
                hint="Completa tu información para que te encuentren fácilmente."
                done={!!bio.trim()}
                last
              >
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    placeholder="Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-brand-violet"
                  />
                  <input
                    placeholder="Apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-brand-violet"
                  />
                </div>
                <textarea
                  placeholder="Cuéntales algo sobre ti…"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-brand-violet resize-none"
                />
              </FieldRow>

              <PrimaryButton onClick={saveProfile} loading={saving} error={error}>
                Continuar
              </PrimaryButton>
            </Card>
          )}

          {/* ─────────── Meta 2: Servicios ─────────── */}
          {step === 'services' && (
            <Card>
              <StepTitle
                title="Activa tus servicios"
                subtitle="Elige los servicios que ofrecerás a tus clientes."
              />
              <div className="space-y-3">
                {SERVICES.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${s.color} text-white`}
                    >
                      {s.icon}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-ink text-sm">{s.title}</p>
                      <p className="text-ink-faint text-xs">{s.subtitle}</p>
                    </div>
                    <Toggle
                      on={enabled[s.key]}
                      disabled={s.key === 'MESSAGE_SEND'}
                      onToggle={() =>
                        setEnabled((e) => ({ ...e, [s.key]: !e[s.key] }))
                      }
                    />
                  </div>
                ))}
              </div>
              <PrimaryButton onClick={() => setStep('prices')}>Continuar</PrimaryButton>
            </Card>
          )}

          {/* ─────────── Meta 3: Precios ─────────── */}
          {step === 'prices' && (
            <Card>
              <StepTitle
                title="Configura tus precios"
                subtitle="Define cuánto cobrarás por cada servicio."
              />
              <div className="space-y-3">
                {SERVICES.filter((s) => enabled[s.key]).map((s) => (
                  <div
                    key={s.key}
                    className="rounded-2xl border border-line bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br ${s.color} text-white`}
                      >
                        {s.icon}
                      </span>
                      <p className="font-bold text-ink text-sm">{s.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-ink-soft text-sm font-semibold">Cr</span>
                      <input
                        type="number"
                        min={0}
                        value={prices[s.key]}
                        onChange={(e) =>
                          setPrices((p) => ({ ...p, [s.key]: e.target.value }))
                        }
                        placeholder="0.00"
                        className="flex-1 rounded-lg border border-line px-3 py-2 text-ink outline-none focus:border-brand-violet font-semibold"
                      />
                      <span className="text-ink-faint text-xs w-20 text-right">
                        {s.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-soft/60 px-3 py-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-brand-violet mt-0.5" />
                <p className="text-xs text-ink-soft">
                  Puedes cambiar estos precios cuando quieras.
                </p>
              </div>
              <PrimaryButton onClick={savePrices} loading={saving} error={error}>
                Continuar
              </PrimaryButton>
            </Card>
          )}

          {/* ─────────── Meta 4: Enlace ─────────── */}
          {step === 'link' && (
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
              <PrimaryButton onClick={() => setStep('share')}>Continuar</PrimaryButton>
            </Card>
          )}

          {/* ─────────── Meta 5: Compartir ─────────── */}
          {step === 'share' && (
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
              <PrimaryButton onClick={() => setStep('done')}>Continuar</PrimaryButton>
            </Card>
          )}

          {/* ─────────── ¡Felicidades! ─────────── */}
          {step === 'done' && (
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
              <PrimaryButton onClick={() => router.replace('/dashboard/anfitriona')}>
                Ir a mi panel
              </PrimaryButton>
            </Card>
          )}

          {/* ─────────── Ayuda ─────────── */}
          {step === 'help' && (
            <Card>
              <div className="mb-4">
                <button
                  onClick={() => setStep(helpReturn)}
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
                    <p className="text-ink-faint text-xs">
                      Te atenderemos por WhatsApp en minutos.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-ink-faint" />
                </a>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-soft/50 px-3 py-2.5 text-xs text-ink-soft">
                <Sparkles className="w-4 h-4 text-brand-violet" />
                No te preocupes, tu progreso está guardado.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Subcomponentes ───────────────────────── */

function firstStep(): Step {
  return 'profile';
}

function back(step: Step, setStep: (s: Step) => void) {
  const order: Step[] = ['profile', 'services', 'prices', 'link', 'share'];
  const i = order.indexOf(step);
  if (i <= 0) setStep('welcome');
  else setStep(order[i - 1]);
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Enlace copiado');
  } catch {
    /* noop */
  }
}

async function share(text: string) {
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

function Header({
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

function Welcome({
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
        ¡Bienvenida{name ? `, ${name}` : ''}! 👋
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

function HowStep({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-brand-soft/40 px-3 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card text-brand-violet">
        {icon}
      </span>
      <p className="text-sm text-ink-soft">{text}</p>
    </div>
  );
}

function Card({
  children,
  center,
}: {
  children: React.ReactNode;
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

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-black text-ink mb-1">{title}</h1>
      <p className="text-ink-soft text-sm">{subtitle}</p>
    </div>
  );
}

function FieldRow({
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
  children: React.ReactNode;
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

function ImagePicker({
  preview,
  onPick,
  round,
  wide,
}: {
  preview: string | null;
  onPick: (f: File) => void;
  round?: boolean;
  wide?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      className={`relative overflow-hidden border-2 border-dashed border-line bg-brand-soft/30 flex items-center justify-center text-brand-violet ${
        round ? 'w-20 h-20 rounded-full' : wide ? 'w-full h-28 rounded-2xl' : 'w-full h-28 rounded-2xl'
      }`}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
      ) : round ? (
        <Camera className="w-6 h-6" />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <ImageIcon className="w-6 h-6" />
          <span className="text-xs font-semibold">Subir imagen</span>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
    </button>
  );
}

function MultiImagePicker({
  files,
  onChange,
  premium,
}: {
  files: File[];
  onChange: (f: File[]) => void;
  premium?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const next = files.map((f) => URL.createObjectURL(f));
    setUrls(next);
    return () => next.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);
  return (
    <div className="grid grid-cols-4 gap-2">
      {files.map((_, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urls[i]} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(files.filter((_, idx) => idx !== i))}
            className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white text-xs"
          >
            ×
          </button>
          {premium && (
            <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 p-0.5 text-white">
              <Lock className="w-3 h-3" />
            </span>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-line bg-brand-soft/30 text-brand-violet"
      >
        <Plus className="w-6 h-6" />
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []);
          if (picked.length) onChange([...files, ...picked]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function Toggle({
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

function ShareBtn({
  label,
  color,
  href,
  onClick,
}: {
  label: string;
  color: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${color}`}>
        <Zap className="w-5 h-5" />
      </span>
      <span className="text-[11px] text-ink-soft">{label}</span>
    </>
  );
  const cls = 'flex flex-col items-center gap-1.5';
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
  loading,
  error,
}: {
  children: React.ReactNode;
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
