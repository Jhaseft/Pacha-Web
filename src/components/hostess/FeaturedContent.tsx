'use client';

import { GalleryImage } from '@/lib/hostessService';
import Image from 'next/image';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FeaturedContentProps {
  profile: { name: string; id: string };
  images: GalleryImage[];
  username: string;
}

export default function FeaturedContent({ profile, images, username }: FeaturedContentProps) {
  const exclusiveImages = images.filter((img) => img.isPremium);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (exclusiveImages.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-xl">Contenido destacado</h3>
        <Link href={`/anfitrionas/${username}/desbloquear`} className="text-pink-500 hover:text-pink-400 text-sm font-semibold transition">
          Ver toda
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {exclusiveImages.slice(0, isMobile ? 2 : 4).map((img) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
          >
            <Image
              src={img.imageUrl}
              alt="Featured"
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />

            <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition">
              <Lock size={32} className="text-white" />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
