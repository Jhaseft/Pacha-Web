'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPublicHostessProfileByUsername, AnfitrioneProfileDetail } from '@/lib/hostessService';
import Image from 'next/image';
import { ArrowLeft, Loader2, AlertCircle, ImageIcon } from 'lucide-react';
import ImageViewer from '@/components/hostess/ImageViewer';

interface AlbumPageProps {
  params: Promise<{ username: string }>;
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [profile, setProfile] = useState<AnfitrioneProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

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
      const data = await getPublicHostessProfileByUsername(username);
      setProfile(data);
    } catch {
      setError('No se pudo cargar el álbum.');
    } finally {
      setLoading(false);
    }
  };

  const publicImages = profile?.galleryImages.filter(
    (img) => !img.isPremium || img.isUnlockedByViewer
  ) ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 size={36} className="text-secondary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <AlertCircle size={48} className="text-white/40 mb-4" />
        <p className="text-white text-center mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-linear-to-r from-secondary to-purple hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold transition"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface/85 backdrop-blur-md border-b border-surface-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition shrink-0"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>

          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/15 shrink-0">
            <Image
              src={profile?.avatar || profile?.coverImage || '/no_image.svg'}
              alt={profile?.name || ''}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold truncate">{profile?.name}</h1>
            <p className="text-white/50 text-xs flex items-center gap-1">
              <ImageIcon size={11} className="text-secondary" />
              Galería pública · {publicImages.length} foto{publicImages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {publicImages.length === 0 ? (
          <div className="text-center py-24 px-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <ImageIcon size={24} className="text-white/40" />
            </div>
            <p className="text-white/50 text-sm">Aún no hay fotos públicas.</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {publicImages.map((img) => (
              <button
                key={img.id}
                onClick={() => setViewingImage(img.imageUrl)}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-surface-border bg-surface-card"
              >
                <Image
                  src={img.imageUrl}
                  alt="Galería"
                  fill
                  sizes="(max-width: 640px) 50vw, 256px"
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {viewingImage && <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />}
    </div>
  );
}
