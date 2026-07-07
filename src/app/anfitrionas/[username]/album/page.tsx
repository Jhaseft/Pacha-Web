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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={32} className="text-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <AlertCircle size={48} className="text-gray-500 mb-4" />
        <p className="text-white text-center mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-gray-900 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-900 rounded-full transition"
        >
          <ArrowLeft size={22} className="text-white" />
        </button>
        <div>
          <h1 className="text-white font-bold">{profile?.name}</h1>
          <p className="text-gray-400 text-xs">Galería Pública</p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-2">
        {publicImages.map((img) => (
          <button
            key={img.id}
            onClick={() => setViewingImage(img.imageUrl)}
            className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition"
          >
            <Image
              src={img.imageUrl}
              alt="Gallery"
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {viewingImage && <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />}
    </div>
  );
}
