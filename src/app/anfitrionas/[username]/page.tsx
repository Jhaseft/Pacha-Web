'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  getPublicHostessProfileByUsername,
  getPublicServicePrices,
  getPublicPlan,
  getSubscriptionStatus,
  buySubscription,
  AnfitrioneProfileDetail,
  ServicePrice,
  SubscriptionPlan,
  SubscriptionStatus,
} from '@/lib/hostessService';
import { apiGetAllPackages } from '@/lib/packages';
import { apiGetMyWallet } from '@/lib/flow';
import { getPublicHostesses, type Anfitriona } from '@/lib/hostesses';
import type { PackageData } from '@/types/package';
import { useCurrency } from '@/hooks/useCurrency';
import { useAuth } from '@/context/AuthContext';
import SocialNetwork from '@/components/hostess/SocialNetwork';
import ImageViewer from '@/components/hostess/ImageViewer';
import BackButton from '@/components/navigation/BackButton';
import { ApkLink } from '@/components/ApkLink';
import {
  AlertCircle,
  Loader2,
  Lock,
  MessageCircle,
  Phone,
  Video,
  Crown,
  Shield,
  BadgeCheck,
  Headphones,
  Star,
  Heart,
  ChevronRight,
  Zap,
  CreditCard,
  Search,
} from 'lucide-react';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

const EXCLUSIVE_LABELS = ['Fotos privadas', 'Videos exclusivos', 'Contenido VIP', 'Backstage', 'Y mucho más'];

// Logo MonetizaLab (misma fuente que el componente Brand).
const LOGO_SRC =
  'https://res.cloudinary.com/dnbklbswg/image/upload/v1783607654/1000040485-removebg-preview_glnmou.png';

function ProfilePageContent({ params }: ProfilePageProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [profile, setProfile] = useState<AnfitrioneProfileDetail | null>(null);
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const [subPlan, setSubPlan] = useState<SubscriptionPlan | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [otherCreators, setOtherCreators] = useState<Anfitriona[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const { symbol, rate } = useCurrency();
  const { user, token } = useAuth();
  const searchParams = useSearchParams();

  // Vista previa: se activa SOLO cuando se entra con ?preview=1 (botón
  // "Ver mi perfil" de la anfitriona).
  const isPreview = searchParams.get('preview') === '1';
  // Las acciones de usuario (chat, llamada, etc.) son solo para clientes.
  const isCreatorOrAdmin = user?.role === 'ANFITRIONA' || user?.role === 'ADMIN';

  // Muestra un aviso flotante que se oculta solo.
  const notify = (msg: string) => setToast(msg);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Avisa y redirige a login como cliente, recordando el destino al que
  // continuar automáticamente tras iniciar sesión como usuario.
  const proceedToLogin = (destination: string, firstMsg: string) => {
    notify(firstMsg);
    setTimeout(() => notify('Redirigiendo a inicio de sesión…'), 1300);
    setTimeout(() => {
      // Contexto "creador": el login muestra la pantalla directa de Google
      // (sin elegir Usuario/Creador) y vuelve aquí tras iniciar sesión.
      const params = new URLSearchParams({ redirect: destination, ctx: 'creator' });
      if (profile?.name) params.set('name', profile.name);
      router.push(`/login?${params.toString()}`);
    }, 2200);
  };

  // Puerta de acceso a las acciones de cliente. `destination` es la ruta a la
  // que se continuará automáticamente tras iniciar sesión como usuario.
  const gate = (destination: string): boolean => {
    if (isPreview) {
      notify('Vista previa: no puedes usar esta acción');
      return false;
    }
    if (isCreatorOrAdmin) {
      proceedToLogin(destination, 'Para realizar esta acción inicia sesión como usuario');
      return false;
    }
    if (!user) {
      proceedToLogin(destination, 'Inicia sesión para continuar');
      return false;
    }
    return true;
  };

  // Verifica que el saldo alcance el mínimo necesario; si no, manda a comprar.
  // Si el saldo aún no cargó (null) deja pasar: la pantalla destino revalida.
  const requireCredits = (needed: number) => {
    if (needed > 0 && balance !== null && balance < needed) {
      router.push('/dashboard/creditos');
      return false;
    }
    return true;
  };

  const handleBuyCredits = () => {
    if (!gate('/dashboard/creditos')) return;
    router.push('/dashboard/creditos');
  };

  useEffect(() => {
    params.then((p) => setUsername(p.username));
  }, [params]);

  useEffect(() => {
    if (!username) return;
    loadProfile();
  }, [username]);

  useEffect(() => {
    apiGetAllPackages()
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => setPackages([]));
  }, []);

  // Otras creadoras para los avatares decorativos del hero.
  useEffect(() => {
    getPublicHostesses(1, 12)
      .then((res) => setOtherCreators(res.anfitrionas.filter((a) => a.avatar)))
      .catch(() => setOtherCreators([]));
  }, []);

  // Saldo del usuario autenticado (para saber si le alcanza antes de conectar).
  useEffect(() => {
    if (!token || isPreview) {
      setBalance(null);
      return;
    }
    apiGetMyWallet(token)
      .then((w) => setBalance(Number(w.balance)))
      .catch(() => setBalance(null));
  }, [token, isPreview]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await getPublicHostessProfileByUsername(username);
      setProfile(profileData);

      const [prices] = await Promise.all([
        getPublicServicePrices(profileData.id).catch(() => [] as ServicePrice[]),
      ]);

      setServicePrices(prices);

      const [plan, status] = await Promise.allSettled([
        getPublicPlan(profileData.id),
        getSubscriptionStatus(profileData.id),
      ]);

      if (plan.status === 'fulfilled') setSubPlan(plan.value);
      if (status.status === 'fulfilled') setSubStatus(status.value);
    } catch (e: any) {
      // 404 = el username no existe → dejamos error en null para mostrar
      // la vista "no encontrada". Cualquier otro fallo = problema de conexión.
      if (e?.response?.status === 404) {
        setError(null);
        setProfile(null);
      } else {
        setError('No se pudo cargar el perfil. Verifica tu conexión.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (type: ServicePrice['serviceType']) =>
    servicePrices.find((p) => p.serviceType === type)?.price ?? null;

  const callPrice = getPrice('CALL');
  const videoPrice = getPrice('VIDEO_CALL');
  const chatPrice = getPrice('MESSAGE_SEND');
  const subPrice = subPlan?.price ?? null;

  const handleCall = (callType: 'CALL' | 'VIDEO_CALL') => {
    if (!profile) return;
    const price = servicePrices.find((p) => p.serviceType === callType)?.price;
    if (price === undefined) return;
    const search = new URLSearchParams({
      anfitrionaId: profile.id,
      anfitrionaName: profile.name,
      anfitrionaAvatar: profile.avatar ?? '',
      callType,
      pricePerMinute: String(price),
      returnTo: `/anfitrionas/${username}`,
    });
    const destination = `/call?${search.toString()}`;
    if (!gate(destination)) return;
    if (!requireCredits(price)) return;
    router.push(destination);
  };

  const handleChat = () => {
    if (!profile) return;
    const search = new URLSearchParams({
      otherUserId: profile.id,
      name: profile.name,
      avatar: profile.avatar ?? '',
    });
    const destination = `/dashboard/chats/new?${search.toString()}`;
    if (!gate(destination)) return;
    if (!requireCredits(chatPrice ?? 0)) return;
    router.push(destination);
  };

  const handleSubscribe = async () => {
    if (!profile || !subPlan) return;
    if (!gate(`/anfitrionas/${username}`)) return;
    try {
      const res = await buySubscription(profile.id);
      setSubStatus({ isSubscribed: true, expiresAt: res.expiresAt });
      await loadProfile();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? '';
      const isInsufficient =
        msg.toLowerCase().includes('credit') ||
        msg.toLowerCase().includes('saldo') ||
        msg.toLowerCase().includes('insuf');

      if (isInsufficient) {
        router.push('/dashboard/creditos');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 size={40} className="text-secondary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <AlertCircle size={56} className="text-white/40 mb-4" />
        <p className="text-white text-center mb-8 text-lg">{error}</p>
        <button
          onClick={loadProfile}
          className="bg-linear-to-r from-secondary to-purple hover:opacity-90 text-white px-8 py-3 rounded-full font-bold transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Search size={30} className="text-white/40" />
        </div>
        <h1 className="text-white text-xl font-bold mb-1">Perfil no encontrado</h1>
        <p className="text-white/50 mb-8 max-w-xs">
          No existe ningún creador de contenido con el usuario <span className="text-white/80 font-semibold">@{username}</span>.
        </p>
        <button
          onClick={() => router.push('/creadores')}
          className="bg-linear-to-r from-secondary to-purple hover:opacity-90 text-white px-8 py-3 rounded-full font-bold transition"
        >
          Ver otros creadores
        </button>
      </div>
    );
  }

  const exclusiveImages = profile.galleryImages.filter((img) => img.isPremium);
  const publicImages = profile.galleryImages.filter((img) => !img.isPremium || img.isUnlockedByViewer);
  const activePackages = packages
    .filter((p) => p.isActive !== false)
    .sort((a, b) => a.credits - b.credits);

  return (
    <div className="min-h-screen bg-surface text-white">
      <BackButton />

      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Fondo oscuro con destellos de color */}
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple/25 blur-[110px]" />
        <div className="absolute top-32 -right-16 w-[26rem] h-[26rem] rounded-full bg-secondary/25 blur-[130px]" />

        {/* Cuerpo del hero: dos columnas */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-10 pt-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-6 items-start">

            {/* ── IZQUIERDA: contenido ── */}
            <div className="order-2 lg:order-1 space-y-5 lg:pt-8">
              {/* Logo MonetizaLab */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="flex items-center gap-2.5">
                <img src={LOGO_SRC} alt="MonetizaLab" className="w-9 h-9 object-contain" />
                <span className="text-xl font-black tracking-tight text-white">
                  Monetiza<span className="text-secondary">Lab</span>
                </span>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${profile.isOnline
                  ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-300'
                  : 'bg-white/10 border border-white/15 text-white/70'
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${profile.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-white/50'
                    }`}
                />
                {profile.isOnline ? 'EN LÍNEA AHORA' : 'DESCONECTADA'}
              </span>

              {/* Foto de perfil en círculo + nombre */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0 rounded-full p-[3px] bg-linear-to-br from-secondary to-purple shadow-lg shadow-secondary/30">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-surface">
                    <Image
                      src={profile.avatar || profile.coverImage || '/no_image.svg'}
                      alt={profile.name}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                  {profile.isOnline && (
                    <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface" />
                  )}
                </div>
                <h1 className="flex items-center gap-2 text-4xl sm:text-6xl font-extrabold tracking-tight leading-none">
                  {profile.name}
                  <Heart size={30} className="text-secondary fill-secondary shrink-0" />
                </h1>
              </div>

              {profile.introMessage && (
                <p className="text-lg sm:text-xl text-white/85 max-w-md leading-snug">
                  {profile.introMessage}
                </p>
              )}

              {/* Responde personalmente */}
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-white">
                <Star size={15} className="text-emerald-400 fill-emerald-400" />
                Responde personalmente
              </span>

              {/* Píldoras de características */}
              <div className="flex flex-wrap gap-4">
                <FeaturePill icon={<MessageCircle size={16} />} label={<>Responde<br />rápido</>} />
                <FeaturePill icon={<BadgeCheck size={16} />} label={<>Perfil<br />verificado</>} />
                <FeaturePill icon={<Lock size={16} />} label={<>Pago<br />seguro</>} />
              </div>

              {/* CTA principal */}
              <div>
                <button
                  onClick={handleChat}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-linear-to-r from-secondary to-purple hover:opacity-90 text-white px-8 py-4 rounded-2xl font-extrabold text-lg sm:text-xl shadow-lg shadow-secondary/40 transition"
                >
                  <span className="rounded-full bg-white/20 p-1.5">
                    <MessageCircle size={20} className="fill-white" />
                  </span>
                  CHATEAR CON {profile.name.toUpperCase()}
                </button>
                <p className="mt-2 text-sm text-white/60">
                  {chatPrice !== null && chatPrice > 0
                    ? `Empieza a hablar desde ${chatPrice} créditos`
                    : 'Empieza a hablar gratis'}
                </p>
              </div>

              {/* Rating con stack de avatares */}
              <div className="flex items-center gap-3">
                <AvatarStack
                  creators={otherCreators.filter((c) => c.id !== profile.id)}
                  count={5}
                  sizeClass="w-11 h-11"
                  overlapClass="-space-x-3"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <Star size={15} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-white">4.9</span>
                  </div>
                  <p className="text-xs text-white/60">
                    {profile.likesCount?.toLocaleString() || '0'} me gusta
                  </p>
                </div>
              </div>
            </div>

            {/* ── DERECHA: foto destacada ── */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-secondary/20 w-full max-w-md ml-auto aspect-[4/5]">
                <Image
                  src={profile.coverImage || profile.avatar || '/no_image.svg'}
                  alt={profile.name}
                  fill
                  priority
                  className="object-cover"
                />
                {/* Sombreado izquierdo para fundir con el fondo (como el mockup) */}
                <div className="absolute inset-0 bg-linear-to-r from-surface via-surface/25 to-transparent" />
                {/* Sombreado inferior (para que los botones se lean sobre la foto) */}
                <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/50 to-transparent" />

                {/* Corazón neón decorativo */}
                <Heart
                  size={52}
                  className="absolute top-1/3 right-3 text-secondary drop-shadow-[0_0_12px_rgba(240,62,179,0.8)] z-10"
                  strokeWidth={2.5}
                />

                {/* Badge de pago seguro (sobre la imagen) */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5">
                  <Shield size={16} className="text-emerald-400" />
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-white">Pago 100% seguro</p>
                    <p className="text-[10px] text-white/60">Tus datos protegidos</p>
                  </div>
                </div>

                {/* Apilado inferior: está en línea + explorar */}
                <div className="absolute bottom-3 left-3 right-3 z-20 space-y-2">
                  <div className="ml-auto w-fit max-w-full flex items-center gap-2 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 px-3 py-2">
                    <Heart size={18} className="text-secondary fill-secondary shrink-0" />
                    <div className="leading-tight">
                      <p className="text-xs font-bold text-white">
                        {profile.name} {profile.isOnline ? 'está en línea' : 'desconectada'}
                      </p>
                      <p className="text-[10px] text-white/60">
                        {profile.isOnline ? 'Responde en menos de 2 minutos' : 'Suele responder pronto'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/explorar"
                    className="group flex items-center gap-2 rounded-2xl border border-purple/50 bg-black/40 backdrop-blur-md px-4 py-3 hover:bg-black/55 transition shadow-lg shadow-purple/20"
                  >
                    <Zap size={16} className="text-secondary shrink-0" />
                    <span className="text-xs font-bold text-white tracking-wide">EXPLORAR OTRAS CREADORAS</span>
                    <AvatarStack
                      creators={otherCreators.filter((c) => c.id !== profile.id)}
                      count={3}
                      sizeClass="w-8 h-8"
                      overlapClass="-space-x-2.5 ml-auto"
                    />
                    <ChevronRight size={18} className="text-white group-hover:translate-x-0.5 transition" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">

          {/* ─────────────── CONTENIDO EXCLUSIVO ─────────────── */}
          {exclusiveImages.length > 0 && (
            <section>
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  Contenido <span className="text-secondary">exclusivo</span> que no verás en redes
                  <span className="ml-1">🔥</span>
                </h2>
                <p className="text-white/60 mt-1 text-sm">Fotos, videos y más contenido solo para ti</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {exclusiveImages.slice(0, 5).map((img, idx) => (
                  <Link
                    href={`/anfitrionas/${username}/desbloquear`}
                    key={img.id}
                    className={`group relative aspect-square rounded-2xl overflow-hidden border border-surface-border ${idx >= 3 ? 'hidden sm:block' : ''
                      }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt="Contenido exclusivo"
                      fill
                      className="object-cover blur-md scale-110 select-none pointer-events-none"
                    />
                    {/* Capa oscura ligera para que se vea la foto borrosa */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition" />
                    {/* Degradado inferior para legibilidad del texto */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/65 to-transparent" />
                    {/* Candado centrado */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black/40 backdrop-blur-sm p-2.5">
                        <Lock size={18} className="text-white" />
                      </div>
                    </div>
                    {/* Etiqueta abajo */}
                    <div className="absolute inset-x-0 bottom-0 p-2 text-center">
                      <span className="block text-[10px] sm:text-xs font-semibold text-white leading-tight drop-shadow">
                        {EXCLUSIVE_LABELS[idx] ?? 'Contenido'}
                      </span>
                      {img.unlockCredits ? (
                        <span className="text-[10px] text-secondary font-bold">{img.unlockCredits} cr</span>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-5">
                <Link
                  href={`/anfitrionas/${username}/desbloquear`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-secondary/50 bg-secondary/10 px-5 py-2.5 text-sm font-bold text-secondary hover:bg-secondary/20 transition"
                >
                  Ver todo el contenido
                  <ChevronRight size={16} />
                </Link>
              </div>
            </section>
          )}

          {/* ─────────────── GALERÍA PÚBLICA ─────────────── */}
          {publicImages.length > 0 && (
            <section>
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  Galería <span className="text-secondary">pública</span>
                  <span className="ml-1">📸</span>
                </h2>
                <p className="text-white/60 mt-1 text-sm">Fotos y momentos de {profile.name}</p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {publicImages.slice(0, 5).map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setViewingImage(img.imageUrl)}
                    className={`group relative aspect-square rounded-2xl overflow-hidden border border-surface-border ${idx >= 3 ? 'hidden sm:block' : ''
                      }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt="Galería"
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                  </button>
                ))}
              </div>

              <div className="text-center mt-5">
                <Link
                  href={`/anfitrionas/${username}/album`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-secondary/50 bg-secondary/10 px-5 py-2.5 text-sm font-bold text-secondary hover:bg-secondary/20 transition"
                >
                  Ver toda la galería
                  <ChevronRight size={16} />
                </Link>
              </div>
            </section>
          )}

          {/* ─────────────── ELIGE CÓMO CONECTAR ─────────────── */}
          <section>
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold mb-6">
              Elige cómo quieres <span className="text-purple">conectar</span>
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <ConnectCard
                icon={<MessageCircle size={22} />}
                iconBg="from-secondary to-pink-600"
                glow="shadow-secondary/50"
                title="Chat"
                subtitle={chatPrice !== null ? `Desde ${chatPrice} cr` : 'Enviar mensaje'}
                caption={chatPrice !== null ? 'por mensaje' : ''}
                onClick={handleChat}
                enabled
              />
              <ConnectCard
                icon={<Phone size={22} />}
                iconBg="from-purple to-purple-700"
                glow="shadow-purple/50"
                title="Llamada de voz"
                subtitle={callPrice !== null ? `Desde ${callPrice} cr` : 'No disponible'}
                caption={callPrice !== null ? 'por minuto' : ''}
                onClick={() => handleCall('CALL')}
                enabled={callPrice !== null}
              />
              <ConnectCard
                icon={<Video size={22} />}
                iconBg="from-blue-500 to-blue-700"
                glow="shadow-blue-500/50"
                title="Videollamada"
                subtitle={videoPrice !== null ? `Desde ${videoPrice} cr` : 'No disponible'}
                caption={videoPrice !== null ? 'por minuto' : ''}
                onClick={() => handleCall('VIDEO_CALL')}
                enabled={videoPrice !== null}
              />
              <ConnectCard
                icon={<Crown size={22} />}
                iconBg="from-amber-300 to-amber-500"
                glow="shadow-amber-400/60"
                title={subStatus?.isSubscribed ? 'Suscrito' : 'Suscripción VIP'}
                subtitle={
                  subStatus?.isSubscribed
                    ? 'Acceso completo'
                    : subPrice !== null
                      ? `Desde ${subPrice} cr`
                      : 'No disponible'
                }
                caption={subStatus?.isSubscribed ? '' : subPrice !== null ? 'contenido exclusivo' : ''}
                onClick={handleSubscribe}
                enabled={!!subPlan && !subStatus?.isSubscribed}
                highlight
              />
            </div>
          </section>

          {/* ─────────────── REDES SOCIALES ─────────────── */}
          <SocialNetwork profile={profile} />

          {/* ─────────────── BADGES DE CONFIANZA ─────────────── */}
          <section className="rounded-2xl bg-surface-card border border-surface-border shadow-lg shadow-black/30 p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
              <TrustBadge
                icon={<Shield size={22} className="text-emerald-400" />}
                title="Pago 100% seguro"
                text="Tus pagos están protegidos con tecnología SSL"
              />
              <TrustBadge
                icon={<CreditCard size={22} className="text-blue-400" />}
                title="Métodos de pago"
                text="Tarjetas, Yape, Plin y más"
                divider
              >
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-black italic text-blue-700">VISA</span>
                  <span className="flex items-center rounded bg-white px-1.5 py-1">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90 -ml-1.5" />
                  </span>
                  <span className="rounded bg-[#742384] px-1.5 py-0.5 text-[9px] font-bold text-white">Yape</span>
                  <span className="rounded bg-[#0bb7c4] px-1.5 py-0.5 text-[9px] font-bold text-white">Plin</span>
                  <span className="text-white/40 text-xs font-bold">…</span>
                </div>
              </TrustBadge>
              <TrustBadge
                icon={<BadgeCheck size={22} className="text-purple" />}
                title={
                  <span className="bg-linear-to-r from-secondary to-purple bg-clip-text text-transparent">
                    Creador verificado
                  </span>
                }
                text="Perfil autenticado por MonetizaLab"
                divider
              />
              <TrustBadge
                icon={<Headphones size={22} className="text-secondary" />}
                title="Soporte 24/7"
                text="Estamos aquí para ayudarte siempre"
                divider
              />
            </div>
          </section>

          {/* ─────────────── COMPRA DE CRÉDITOS ─────────────── */}
          <section className="rounded-3xl bg-linear-to-r from-[#9e1563] via-[#6d0f48] to-[#3a0725] border border-secondary/30 shadow-xl shadow-black/40 p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-5">
              {/* Izquierda: monedas + texto */}
              <div className="flex items-center gap-3 lg:w-52 shrink-0">
                <CoinStack />
                <p className="text-white font-bold text-sm leading-snug">
                  Compra créditos y empieza a chatear con {profile.name} ahora
                </p>
              </div>

              {/* Centro: paquetes reales de la base de datos (solo visuales) */}
              {activePackages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
                  {activePackages.map((pack) => (
                    <div
                      key={pack.id ?? pack.credits}
                      className="relative rounded-xl bg-black/25 border border-white/10 px-2 py-3 text-center"
                    >
                      <p className="text-[11px] text-white/70 mt-1">
                        {pack.credits.toLocaleString()} créditos
                      </p>
                      <p className="text-lg font-extrabold text-white mt-0.5">
                        {symbol} {(pack.credits * rate).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Derecha: botón de compra */}
              <div className="shrink-0 w-full lg:w-auto">
                <button
                  onClick={handleBuyCredits}
                  className="w-full rounded-2xl bg-white hover:bg-white/90 text-[#a01568] font-extrabold px-6 py-4 text-sm tracking-wide shadow-lg transition"
                >
                  COMPRAR CRÉDITOS
                </button>
              </div>
            </div>
          </section>

          {/* ─────────────── DESCARGA APP ─────────────── */}
          <section className="text-center">
            <p className="text-white/50 text-sm">
              ¿No tienes la app?{' '}
              <ApkLink
                event="APK_Cliente"
                className="text-secondary hover:text-purple font-semibold"
              >
                Descárgala gratis
              </ApkLink>
            </p>
          </section>
        </div>
      </div>

      {/* ─────────────── FOOTER ─────────────── */}
      <footer className="border-t border-surface-border py-6">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-white/40 text-xs">© 2026 MonetizaLab. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <Link href="/terminos" className="hover:text-white transition">Términos de uso</Link>
            <Link href="/politica-devoluciones" className="hover:text-white transition">Privacidad</Link>
            <Link href="/soy-nuevo" className="hover:text-white transition">Contacto</Link>
          </div>
        </div>
      </footer>

      {/* Botón flotante: Chatea ahora */}
      <button
        onClick={handleChat}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-secondary to-purple text-white font-extrabold px-5 py-3.5 shadow-lg shadow-secondary/40 hover:opacity-90 hover:scale-105 transition"
      >
        <MessageCircle size={20} className="fill-white" />
        Chatea ahora
      </button>

      {/* Toast: avisos flotantes */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-black/85 backdrop-blur border border-white/15 px-4 py-2.5 text-sm font-semibold text-white shadow-xl max-w-[90vw] text-center">
          <Lock size={15} className="text-secondary shrink-0" />
          {toast}
        </div>
      )}

      {viewingImage && <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />}
    </div>
  );
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <Loader2 size={40} className="text-secondary animate-spin" />
        </div>
      }
    >
      <ProfilePageContent params={params} />
    </Suspense>
  );
}

/* ───────────────────────── Subcomponentes ───────────────────────── */

function AvatarStack({
  creators,
  count,
  sizeClass,
  overlapClass,
}: {
  creators: Anfitriona[];
  count: number;
  sizeClass: string;
  overlapClass: string;
}) {
  const list = creators.slice(0, count);
  // Si aún no hay creadoras cargadas, mostramos placeholders con degradado.
  const items: (Anfitriona | null)[] =
    list.length > 0 ? list : Array.from({ length: count }, () => null);

  return (
    <div className={`flex ${overlapClass}`}>
      {items.map((c, i) =>
        c?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={c.id}
            src={c.avatar}
            alt=""
            className={`${sizeClass} rounded-full border-2 border-surface object-cover bg-surface-card`}
          />
        ) : (
          <span
            key={i}
            className={`${sizeClass} rounded-full border-2 border-surface bg-linear-to-br from-secondary/70 to-purple/70`}
          />
        ),
      )}
    </div>
  );
}

function CoinStack() {
  // Pila de monedas doradas 3D construida con CSS
  return (
    <div className="relative w-16 h-14 shrink-0" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-1 right-1 h-6 rounded-[50%] border border-amber-200/70"
          style={{
            bottom: i * 11,
            background: 'radial-gradient(ellipse at 50% 30%, #fef3c7 0%, #fbcf3d 45%, #d9911a 100%)',
            boxShadow: '0 3px 0 #a86a12, 0 5px 7px rgba(0,0,0,0.45)',
          }}
        />
      ))}
    </div>
  );
}

function FeaturePill({ icon, label }: { icon: React.ReactNode; label: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-secondary/20 p-2 text-secondary shrink-0">{icon}</div>
      <span className="text-xs font-semibold text-white leading-tight">{label}</span>
    </div>
  );
}

function ConnectCard({
  icon,
  iconBg,
  glow,
  title,
  subtitle,
  caption,
  onClick,
  enabled,
  highlight = false,
}: {
  icon: React.ReactNode;
  iconBg: string;
  glow: string;
  title: string;
  subtitle: string;
  caption: string;
  onClick: () => void;
  enabled: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      className={`relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition ${highlight
        ? 'border-amber-400/60 bg-linear-to-br from-amber-500/15 to-surface-card shadow-lg shadow-amber-500/30 ring-1 ring-amber-400/30 hover:shadow-amber-500/50'
        : 'border-surface-border bg-surface-card shadow-lg shadow-black/40 hover:border-white/30'
        } ${enabled ? 'hover:-translate-y-0.5 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
    >
      {highlight && (
        <span className="absolute top-2 right-2 rounded-full bg-linear-to-r from-amber-300 to-amber-500 px-2 py-0.5 text-[9px] font-extrabold text-black shadow shadow-amber-400/50">
          VIP
        </span>
      )}
      <div className={`rounded-xl bg-linear-to-br ${iconBg} p-2.5 text-white shadow-lg ${glow}`}>{icon}</div>
      <div>
        <p className="font-bold text-white text-sm">{title}</p>
        <p className={`text-xs font-semibold mt-0.5 ${highlight ? 'text-amber-300' : 'text-secondary'}`}>{subtitle}</p>
        {caption ? <p className="text-[11px] text-white/40">{caption}</p> : null}
      </div>
    </button>
  );
}

function TrustBadge({
  icon,
  title,
  text,
  divider = false,
  children,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  text: string;
  divider?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`flex items-start gap-3 lg:px-5 ${divider ? 'lg:border-l lg:border-surface-border' : ''}`}>
      <div className="rounded-xl bg-white/5 border border-white/5 p-2.5 shrink-0">{icon}</div>
      <div>
        <h3 className="text-white font-bold text-sm">{title}</h3>
        <p className="text-white/50 text-xs leading-snug">{text}</p>
        {children}
      </div>
    </div>
  );
}
