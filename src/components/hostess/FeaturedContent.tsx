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
        <h3 className="text-ink font-bold text-xl">Contenido destacado</h3>
        <Link href={`/anfitrionas/${username}/desbloquear`} className="text-brand hover:text-brand-strong text-sm font-semibold transition">
          Ver toda
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {exclusiveImages.slice(0, isMobile ? 2 : 4).map((img) => (
          <Link
            href={`/anfitrionas/${username}/desbloquear`}
            key={img.id}
            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
          >
            <Image
              src={img.imageUrl}
              alt="Contenido exclusivo"
              width={300}
              height={300}
              className="w-full h-full object-cover blur-xl scale-125 select-none pointer-events-none"
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 group-hover:bg-black/50 transition">
              <Lock size={30} className="text-white" />
              {img.unlockCredits ? (
                <span className="text-white text-xs font-semibold">{img.unlockCredits} cr</span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
