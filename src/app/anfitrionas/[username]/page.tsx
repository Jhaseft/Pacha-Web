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
import ActionPills from '@/components/hostess/ActionPills';
import SubscriptionCard from '@/components/hostess/SubscriptionCard';
import GallerySection from '@/components/hostess/GallerySection';
import { AlertCircle, Loader2, ArrowLeft, MessageCircle } from 'lucide-react';

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
    router.push(`/call?anfitrionaId=${profile.id}&callType=${callType}&price=${price}`);
  };

  const handleChat = () => {
    if (!profile) return;
    router.push(`/chat?otherUserId=${profile.id}&otherUserName=${profile.name}`);
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
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black flex items-center justify-center">
        <Loader2 size={40} className="text-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black flex flex-col items-center justify-center px-4">
        <AlertCircle size={56} className="text-gray-500 mb-4" />
        <p className="text-white text-center mb-8 text-lg">{error}</p>
        <button
          onClick={loadProfile}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black flex items-center justify-center">
        <p className="text-gray-400 text-lg">Anfitriona no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-20 bg-black/60 hover:bg-black/80 p-2.5 rounded-full transition backdrop-blur-sm"
      >
        <ArrowLeft size={20} className="text-white" />
      </button>

      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Action Pills */}
          <div className="overflow-x-auto">
            <ActionPills
              profile={profile}
              servicePrices={servicePrices}
              onCall={handleCall}
              onViewStories={() => {}}
            />
          </div>

          {/* Subscription Card */}
          {subPlan && (
            <SubscriptionCard
              profile={profile}
              plan={subPlan}
              status={subStatus}
              onSubscribe={handleSubscribe}
            />
          )}

          {/* Message Button */}
          <button
            onClick={handleChat}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 text-lg"
          >
            <MessageCircle size={20} />
            Enviar Mensaje
          </button>

          {/* Gallery Section */}
          <div>
            <GallerySection profile={profile} images={profile.galleryImages} username={username} />
          </div>

        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-8" />
    </div>
  );
}
