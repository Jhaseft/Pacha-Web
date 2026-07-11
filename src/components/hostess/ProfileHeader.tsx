'use client';

import { AnfitrioneProfileDetail } from '@/lib/hostessService';
import Image from 'next/image';
import { useState } from 'react';
import ImageViewer from './ImageViewer';
import { CheckCircle } from 'lucide-react';

const COVER_HEIGHT = 280;
const AVATAR_SIZE = 100;

interface ProfileHeaderProps {
  profile: AnfitrioneProfileDetail;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(109, 94, 252, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(109, 94, 252, 0.7), 0 0 60px rgba(168, 85, 247, 0.5);
          }
        }
        
        .avatar-glow {
          animation: glow 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Cover Image */}
      <button
        onClick={() => profile.coverImage && setViewingImage(profile.coverImage)}
        className="w-full relative overflow-hidden group"
        style={{ height: COVER_HEIGHT }}
      >
        <Image
          src={profile.coverImage || '/no_image.svg'}
          alt="Cover"
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-canvas" />
      </button>

      <div className="px-4 sm:px-6 lg:px-8 -mt-16 mb-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-start">
            <button
              onClick={() => profile.avatar && setViewingImage(profile.avatar)}
              className="relative shrink-0 group"
            >
              <div
                className={`relative rounded-full overflow-hidden border-4 shadow-2xl group-hover:scale-110 transition duration-300 ${
                  profile.isOnline
                    ? 'border-brand avatar-glow'
                    : 'border-line'
                }`}
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              >
                <Image
                  src={profile.avatar || '/no_image.svg'}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div
                className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-3 border-card shadow-lg flex items-center justify-center ${
                  profile.isOnline ? 'bg-green-500' : 'bg-ink-faint'
                }`}
              >
                {profile.isOnline && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </div>
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-3xl font-bold text-ink">
                  {profile.name}
                </h1>
                {profile.isOnline && (
                  <CheckCircle size={20} className="text-brand shrink-0" />
                )}
              </div>

              <p className="text-ink-faint text-xs sm:text-sm mb-2">@{profile.username}</p>

              <span
                className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition ${
                  profile.isOnline
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-canvas-alt text-ink-faint border border-line'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${profile.isOnline ? 'bg-green-500' : 'bg-ink-faint'}`} />
                {profile.isOnline ? 'En línea' : 'Desconectada'}
              </span>

              {profile.introMessage && (
                <p className="text-ink-soft text-xs sm:text-sm leading-relaxed mt-2">
                  {profile.introMessage}
                </p>
              )}

              <div className="flex flex-wrap gap-4 sm:gap-6 mt-3 text-xs sm:text-sm">
                <div className="flex flex-col">
                  <span className="text-ink font-bold text-base sm:text-lg">
                    {profile.likesCount?.toLocaleString() || '0'}
                  </span>
                  <span className="text-ink-faint text-xs">Seguidores</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-ink font-bold text-base sm:text-lg">
                    {profile.likesCount?.toLocaleString() || '0'}
                  </span>
                  <span className="text-ink-faint text-xs">Me gusta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewingImage && <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />}
    </>
  );
}
