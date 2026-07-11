'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ProfileHeader,
  EarningsSection,
  PricesSection,
  ActionButtons,
  StoriesSection,
  GallerySection,
} from '@/components/anfitriona/perfil';
import {
  apiGetMyProfile,
  apiUpdateMyProfile,
  apiGetMyEarnings,
  apiGetMyServicePrices,
  apiGetMyStories,
  apiDeleteHistory,
  apiGetMyGallery,
  apiDeleteGalleryImage,
  apiSetFeaturedGalleryImage,
} from '@/lib/perfil';
import { MyProfileData, EarningsData, ServicePrice, HistoryItem, GalleryItem } from '@/types/perfil';

export default function PerfilPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const [profile, setProfile] = useState<MyProfileData | null>(null);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const [stories, setStories] = useState<HistoryItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [togglingOnline, setTogglingOnline] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null);

  const loadAll = useCallback(async () => {
    try {
      const [profileData, earningsData, pricesData, storiesData, galleryData] = await Promise.allSettled([
        apiGetMyProfile(),
        apiGetMyEarnings(),
        apiGetMyServicePrices(),
        apiGetMyStories(),
        apiGetMyGallery(),
      ]);

      if (profileData.status === 'fulfilled') setProfile(profileData.value);
      if (earningsData.status === 'fulfilled') setEarnings(earningsData.value);
      if (pricesData.status === 'fulfilled') setServicePrices(pricesData.value);
      if (storiesData.status === 'fulfilled') setStories(storiesData.value);
      if (galleryData.status === 'fulfilled') setGallery(galleryData.value);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const checkNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === 'granted');
      } catch {
        setNotificationsEnabled(false);
      }
    };
    checkNotifications();
  }, [loadAll]);

  const handleToggleOnline = async () => {
    if (!profile || togglingOnline) return;
    const next = !profile.isOnline;
    setTogglingOnline(true);
    setProfile((prev) => (prev ? { ...prev, isOnline: next } : prev));
    try {
      await apiUpdateMyProfile({ isOnline: next });
    } catch (error) {
      setProfile((prev) => (prev ? { ...prev, isOnline: !next } : prev));
      console.error('Error toggling online status:', error);
    } finally {
      setTogglingOnline(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('¿Estás segura de que quieres salir?')) {
      await logout();
      router.replace('/auth/choose-access');
    }
  };

  const handleNotifications = () => {
    if (notificationsEnabled) {
      alert('¿Quieres desactivar las notificaciones?');
    } else {
      alert('Las notificaciones están desactivadas. ¿Quieres activarlas?');
    }
  };

  const handleShare = async () => {
    if (!profile?.username) {
      alert('Error: No se pudo obtener tu username');
      return;
    }
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Perfil de ${profile.firstName || profile.username}`,
          text: `¡Hola! Mira mi perfil en Monetiza Lab`,
          url: `https://monetizalab.vip/@${profile.username}`,
        });
      } else {
        const url = `https://monetizalab.vip/@${profile.username}`;
        await navigator.clipboard.writeText(url);
        alert('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  const handleAddStory = () => {
    router.push('/dashboard/anfitriona/crear-historia');
  };

  const handleViewStory = (story: HistoryItem) => {
    router.push(`/dashboard/anfitriona/historia/${story.id}`);
  };

  const handleDeleteStory = async (storyId: string) => {
    if (confirm('¿Estás segura de que quieres borrar esta historia permanentemente?')) {
      try {
        await apiDeleteHistory(storyId);
        setStories((prev) => prev.filter((s) => s.id !== storyId));
        alert('La historia ha sido borrada.');
      } catch (error) {
        alert('Error al eliminar la historia');
        console.error(error);
      }
    }
  };

  const handleAddImage = () => {
    router.push('/dashboard/anfitriona/agregar-galeria');
  };

  const handleSelectImage = (item: GalleryItem) => {
    router.push(`/dashboard/anfitriona/galeria/${item.id}`);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm('¿Estás segura de que quieres borrar esta foto permanentemente?')) {
      try {
        await apiDeleteGalleryImage(imageId);
        setGallery((prev) => prev.filter((img) => img.id !== imageId));
        alert('La foto ha sido borrada.');
      } catch (error) {
        alert('Error al eliminar la foto');
        console.error(error);
      }
    }
  };

  const handleSetFeatured = async (imageId: string) => {
    try {
      await apiSetFeaturedGalleryImage(imageId);
      setGallery((prev) =>
        prev.map((img) => ({
          ...img,
          sortOrder: img.id === imageId ? 0 : 1,
        }))
      );
      alert('¡Listo! Esta foto aparecerá primero en el feed.');
    } catch (error) {
      alert('Error al establecer foto destacada');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full px-5 md:px-12 lg:px-16 py-6 md:py-8 flex-1 flex flex-col">
        <div className="mt-6">
          <ProfileHeader profile={profile} />
        </div>

        <div className="space-y-4 mt-6 flex-1">
          <EarningsSection earnings={earnings} />

          <PricesSection profile={profile} servicePrices={servicePrices} />

          <ActionButtons
            profile={profile}
            isOnline={profile?.isOnline ?? false}
            notificationsEnabled={notificationsEnabled}
            onToggleOnline={handleToggleOnline}
            onLogout={handleLogout}
            onNotifications={handleNotifications}
            onShare={handleShare}
          />

          <StoriesSection
            stories={stories}
            onAddStory={handleAddStory}
            onViewStory={handleViewStory}
          />

          <GallerySection
            gallery={gallery}
            onAddImage={handleAddImage}
            onSelectImage={handleSelectImage}
          />
        </div>
      </div>
    </div>
  );
}
