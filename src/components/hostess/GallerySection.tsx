'use client';

import { GalleryImage } from '@/lib/hostessService';
import Image from 'next/image';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import ImageViewer from './ImageViewer';

interface GallerySectionProps {
  profile: { name: string; id: string };
  images: GalleryImage[];
  username: string;
}

export default function GallerySection({ profile, images, username }: GallerySectionProps) {
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const publicImages = images.filter((img) => !img.isPremium || img.isUnlockedByViewer);
  const privateImages = images.filter((img) => img.isPremium && !img.isUnlockedByViewer);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Public Gallery */}
        {publicImages.length > 0 && (
          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-6 hover:border-gray-800 transition flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Galería Pública</h3>
              <p className="text-gray-500 text-sm mb-4">Álbum público</p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {publicImages.slice(0, 6).map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setViewingImage(img.imageUrl)}
                    className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition duration-300 relative"
                  >
                    <Image
                      src={img.imageUrl}
                      alt="Gallery"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <Link
              href={`/anfitrionas/${username}/album`}
              className="w-full text-center border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 px-4 py-3 rounded-full font-bold transition"
            >
              Ver Álbum
            </Link>
          </div>
        )}

        {/* Exclusive Gallery */}
        {privateImages.length > 0 && (
          <div className="bg-gray-950 border border-gray-900 rounded-2xl p-6 hover:border-gray-800 transition flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Galería Exclusiva</h3>
              <p className="text-gray-500 text-sm mb-4">Álbum privado</p>

              <div className="aspect-square rounded-lg overflow-hidden relative mb-4 bg-black flex items-center justify-center">
                <Image
                  src={privateImages[0].imageUrl}
                  alt="Exclusive"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover opacity-20 blur-sm"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                  <Lock size={32} className="text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">
                    {privateImages.length} foto{privateImages.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/anfitrionas/${username}/desbloquear`}
              className="w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full font-bold transition"
            >
              Ver Álbum Exclusivo
            </Link>
          </div>
        )}
      </div>

      {viewingImage && <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />}
    </>
  );
}
