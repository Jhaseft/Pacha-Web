'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPublicHostessProfileByUsername, AnfitrioneProfileDetail } from '@/lib/hostessService';
import Image from 'next/image';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Loader2 size={32} className="text-brand animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4">
        <AlertCircle size={48} className="text-ink-faint mb-4" />
        <p className="text-ink text-center mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand text-white px-6 py-2 rounded-full font-bold transition"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* El sidebar (PC) y el bottom-nav (móvil) los aporta el layout raíz.
          Aquí el contenido va en columna tipo vista teléfono. */}
      <div className="max-w-lg mx-auto">
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-line px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-canvas-alt rounded-full transition"
          >
            <ArrowLeft size={22} className="text-ink" />
          </button>
          <div>
            <h1 className="text-ink font-bold">{profile?.name}</h1>
            <p className="text-ink-faint text-xs">Galería Pública</p>
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-2">
          {publicImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setViewingImage(img.imageUrl)}
              className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition"
            >
              <Image
                src={img.imageUrl}
                alt="Gallery"
                fill
                sizes="(max-width: 512px) 50vw, 256px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {viewingImage && <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />}
    </div>
  );
}
