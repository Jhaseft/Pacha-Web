'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import ProfileHeader from '@/components/hostess/ProfileHeader';
import SocialNetwork from '@/components/hostess/SocialNetwork';
import ActionPills from '@/components/hostess/ActionPills';
import FeaturedContent from '@/components/hostess/FeaturedContent';
import GallerySection from '@/components/hostess/GallerySection';
import { AlertCircle, Loader2, ArrowLeft, Download } from 'lucide-react';
import Footer from '@/components/hostess/Footer';
import BackButton from '@/components/navigation/BackButton';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [profile, setProfile] = useState<AnfitrioneProfileDetail | null>(null);
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const [subPlan, setSubPlan] = useState<SubscriptionPlan | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setUsername(p.username));
  }, [params]);

  useEffect(() => {
    if (!username) return;
    loadProfile();
  }, [username]);

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
    } catch {
      setError('No se pudo cargar el perfil. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (callType: 'CALL' | 'VIDEO_CALL') => {
    if (!profile) return;
    const price = servicePrices.find((p) => p.serviceType === callType)?.price;
    if (price === undefined) return;
    const params = new URLSearchParams({
      anfitrionaId: profile.id,
      anfitrionaName: profile.name,
      anfitrionaAvatar: profile.avatar ?? '',
      callType,
      pricePerMinute: String(price),
    });
    router.push(`/call?${params.toString()}`);
  };

  const handleChat = () => {
    if (!profile) return;
    const params = new URLSearchParams({
      otherUserId: profile.id,
      name: profile.name,
      avatar: profile.avatar ?? '',
    });
    router.push(`/dashboard/chats/new?${params.toString()}`);
  };

  const handleSubscribe = async () => {
    if (!profile) return;
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
        router.push('/credito');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Loader2 size={40} className="text-brand animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4">
        <AlertCircle size={56} className="text-ink-faint mb-4" />
        <p className="text-ink text-center mb-8 text-lg">{error}</p>
        <button
          onClick={loadProfile}
          className="bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand text-white px-8 py-3 rounded-full font-bold transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-ink-faint text-lg">Anfitriona no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <BackButton/>

      <ProfileHeader profile={profile} />

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">

          <ActionPills
            profile={profile}
            servicePrices={servicePrices}
            subPlan={subPlan}
            subStatus={subStatus}
            onChat={handleChat}
            onCall={handleCall}
            onSubscribe={handleSubscribe}
          />

          <button
            onClick={() => router.push('/app')}
            className="w-full bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-brand/25">
            <Download size={20} />
            Abrir en la app
          </button>

          <p className="text-center text-ink-faint text-sm">
            ¿No tienes la app? {' '}
            <a
              href="https://play.google.com/store/apps/details?id=com.sanamente.appoficial"
              target='_blank'
              className="text-brand hover:text-brand-strong font-semibold cursor-pointer">
              Descárgala gratis
            </a>
          </p>

          {profile.galleryImages.length > 0 && (
            <FeaturedContent profile={profile} images={profile.galleryImages} username={username} />
          )}

          {profile.galleryImages.length > 0 && (
            <GallerySection profile={profile} images={profile.galleryImages} username={username} />
          )}

          

        </div>
              <SocialNetwork profile={profile} />

      </div>

      <div className="h-8" />
      <Footer />

    </div>
  );
}
