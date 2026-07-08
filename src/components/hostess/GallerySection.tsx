'use client';

import { GalleryImage } from '@/lib/hostessService';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ImageViewer from './ImageViewer';

interface GallerySectionProps {
  profile: { name: string; id: string };
  images: GalleryImage[];
  username: string;
}

export default function GallerySection({ profile, images, username }: GallerySectionProps) {
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const publicImages = images.filter((img) => !img.isPremium || img.isUnlockedByViewer);

  if (publicImages.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-xl">Contenido normal</h3>
          <Link href={`/anfitrionas/${username}/album`} className="text-pink-500 hover:text-pink-400 text-sm font-semibold transition">
            Ver todo
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {publicImages.slice(0, isMobile ? 2 : 4).map((img) => (
            <button
              key={img.id}
              onClick={() => setViewingImage(img.imageUrl)}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={img.imageUrl}
                alt="Gallery"
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
            </button>
          ))}
        </div>
      </div>

      {viewingImage && <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />}
    </>
  );
}
