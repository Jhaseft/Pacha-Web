'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import {
  ProfileHeader,
  EarningsSection,
  PricesSection,
  ActionButtons,
  StoriesSection,
  GallerySection,
  CreateHistoryModal,
  PublishGalleryModal,
  StoryViewerModal,
  GalleryItemViewer,
} from '@/components/anfitriona/perfil';
import {
  apiGetMyProfile,
  apiUpdateMyProfile,
  apiGetMyEarnings,
  apiGetMyServicePrices,
  apiGetMyStories,
  apiCreateHistory,
  apiDeleteHistory,
  apiGetMyGallery,
  apiCreateGalleryImage,
  apiDeleteGalleryImage,
  apiSetFeaturedGalleryImage,
} from '@/lib/perfil';
import {
  MyProfileData,
  EarningsData,
  ServicePrice,
  HistoryItem,
  GalleryItem,
  PublishGalleryForm,
} from '@/types/perfil';

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

  // El estado real lo manda el permiso del navegador, no un flag nuestro.
  const push = usePushNotifications();

  // Subida de historias: el "+" abre el selector de archivos y, al elegir, el modal.
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storyPreviewUrl, setStoryPreviewUrl] = useState<string | null>(null);
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [storyCredits, setStoryCredits] = useState('0');
  const [uploadingStory, setUploadingStory] = useState(false);
  const [storyError, setStoryError] = useState('');

  // Subida a la galería: mismo patrón que las historias, pero solo imágenes.
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState<string | null>(null);
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [galleryForm, setGalleryForm] = useState<PublishGalleryForm>({
    isPremium: false,
    unlockCredits: '',
  });
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState('');

  // Visores a pantalla completa.
  const [viewingStory, setViewingStory] = useState<HistoryItem | null>(null);
  const [viewingImage, setViewingImage] = useState<GalleryItem | null>(null);

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
    if (!confirm('¿Estás segura de que quieres salir?')) return;

    // Antes de cerrar sesión: si no, este navegador seguiría recibiendo sus push.
    await push.disable().catch(() => {});
    logout();
    router.replace('/');
  };

  const handleNotifications = async () => {
    if (!push.isSupported) {
      alert('Este navegador no admite notificaciones. En iPhone, añade la web a tu pantalla de inicio.');
      return;
    }

    if (push.isEnabled) {
      await push.disable();
      return;
    }

    const ok = await push.enable();
    if (!ok && push.permission === 'denied') {
      alert('Bloqueaste las notificaciones. Habilítalas desde el candado 🔒 de la barra de direcciones.');
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
    setStoryError('');
    fileInputRef.current?.click();
  };

  const handleStoryFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Permite volver a elegir el mismo archivo si se cancela y se reintenta.
    e.target.value = '';
    if (!file) return;

    setStoryFile(file);
    setStoryPreviewUrl(URL.createObjectURL(file));
    setStoryCredits('0');
    setStoryModalVisible(true);
  };

  const closeStoryModal = () => {
    if (storyPreviewUrl) URL.revokeObjectURL(storyPreviewUrl);
    setStoryModalVisible(false);
    setStoryFile(null);
    setStoryPreviewUrl(null);
    setStoryCredits('0');
    setStoryError('');
  };

  const handlePublishStory = async () => {
    if (!storyFile) return;
    setUploadingStory(true);
    setStoryError('');
    try {
      await apiCreateHistory({ priceCredits: parseInt(storyCredits, 10) || 0 }, storyFile);
      closeStoryModal();
      const fresh = await apiGetMyStories();
      setStories(fresh);
    } catch (error) {
      setStoryError(error instanceof Error ? error.message : 'Error al subir la historia');
    } finally {
      setUploadingStory(false);
    }
  };

  const handleViewStory = (story: HistoryItem) => {
    setViewingStory(story);
  };

  const handleDeleteStory = async (storyId: string) => {
    if (confirm('¿Estás segura de que quieres borrar esta historia permanentemente?')) {
      try {
        await apiDeleteHistory(storyId);
        setStories((prev) => prev.filter((s) => s.id !== storyId));
        setViewingStory(null);
      } catch (error) {
        alert('Error al eliminar la historia');
        console.error(error);
      }
    }
  };

  const handleAddImage = () => {
    setGalleryError('');
    galleryInputRef.current?.click();
  };

  const handleGalleryFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setGalleryFile(file);
    setGalleryPreviewUrl(URL.createObjectURL(file));
    setGalleryForm({ isPremium: false, unlockCredits: '' });
    setGalleryModalVisible(true);
  };

  const closeGalleryModal = () => {
    if (galleryPreviewUrl) URL.revokeObjectURL(galleryPreviewUrl);
    setGalleryModalVisible(false);
    setGalleryFile(null);
    setGalleryPreviewUrl(null);
    setGalleryForm({ isPremium: false, unlockCredits: '' });
    setGalleryError('');
  };

  const handlePublishGallery = async () => {
    if (!galleryFile) return;

    const credits = parseFloat(galleryForm.unlockCredits);
    if (galleryForm.isPremium && (!galleryForm.unlockCredits || isNaN(credits) || credits <= 0)) {
      setGalleryError('Las fotos exclusivas necesitan un precio en créditos mayor a 0.');
      return;
    }

    setUploadingGallery(true);
    setGalleryError('');
    try {
      await apiCreateGalleryImage(
        {
          isPremium: galleryForm.isPremium,
          unlockCredits: galleryForm.isPremium ? credits : undefined,
        },
        galleryFile
      );
      closeGalleryModal();
      const fresh = await apiGetMyGallery();
      setGallery(fresh);
    } catch (error) {
      setGalleryError(error instanceof Error ? error.message : 'Error al publicar la foto');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleSelectImage = (item: GalleryItem) => {
    setViewingImage(item);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm('¿Estás segura de que quieres borrar esta foto permanentemente?')) {
      try {
        await apiDeleteGalleryImage(imageId);
        setGallery((prev) => prev.filter((img) => img.id !== imageId));
        setViewingImage(null);
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
      <div className="w-full max-w-lg mx-auto px-5 py-6 flex-1 flex flex-col">
        <div className="mt-6">
          <ProfileHeader profile={profile} />
        </div>

        <div className="space-y-4 mt-6 flex-1">
          <EarningsSection earnings={earnings} />

          <PricesSection profile={profile} servicePrices={servicePrices} />

          <ActionButtons
            profile={profile}
            isOnline={profile?.isOnline ?? false}
            notificationsEnabled={push.isEnabled}
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleStoryFileSelected}
        className="hidden"
      />

      <CreateHistoryModal
        visible={storyModalVisible}
        file={storyFile}
        previewUrl={storyPreviewUrl}
        credits={storyCredits}
        uploading={uploadingStory}
        error={storyError}
        onChangeCredits={setStoryCredits}
        onClose={closeStoryModal}
        onPublish={handlePublishStory}
      />

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleGalleryFileSelected}
        className="hidden"
      />

      <PublishGalleryModal
        visible={galleryModalVisible}
        previewUrl={galleryPreviewUrl}
        form={galleryForm}
        uploading={uploadingGallery}
        error={galleryError}
        onChangeForm={(patch) => setGalleryForm((prev) => ({ ...prev, ...patch }))}
        onClose={closeGalleryModal}
        onPublish={handlePublishGallery}
      />

      <StoryViewerModal
        story={viewingStory}
        onClose={() => setViewingStory(null)}
        onDelete={handleDeleteStory}
      />

      <GalleryItemViewer
        item={viewingImage}
        onClose={() => setViewingImage(null)}
        onDelete={handleDeleteImage}
        onSetFeatured={handleSetFeatured}
      />
    </div>
  );
}
