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
            box-shadow: 0 0 20px rgba(240, 62, 179, 0.6), 0 0 40px rgba(168, 68, 242, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(240, 62, 179, 0.8), 0 0 60px rgba(168, 68, 242, 0.5);
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
      </button>

      <div className="px-4 sm:px-6 lg:px-8 -mt-16 mb-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-start">
            <button
              onClick={() => profile.avatar && setViewingImage(profile.avatar)}
              className="relative flex-shrink-0 group"
            >
              <div
                className={`relative rounded-full overflow-hidden border-4 shadow-2xl group-hover:scale-110 transition duration-300 ${
                  profile.isOnline
                    ? 'border-pink-500 avatar-glow'
                    : 'border-gray-600'
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
                className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-3 border-black shadow-lg flex items-center justify-center ${
                  profile.isOnline ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                {profile.isOnline && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </div>
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-3xl font-bold text-white">
                  {profile.name}
                </h1>
                {profile.isOnline && (
                  <CheckCircle size={20} className="text-pink-500 flex-shrink-0" />
                )}
              </div>

              <p className="text-gray-400 text-xs sm:text-sm mb-2">@{profile.username}</p>

              <span
                className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition ${
                  profile.isOnline
                    ? 'bg-linear-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-600/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${profile.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                {profile.isOnline ? 'En línea' : 'Desconectada'}
              </span>

              {profile.introMessage && (
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mt-2">
                  {profile.introMessage}
                </p>
              )}

              <div className="flex flex-wrap gap-4 sm:gap-6 mt-3 text-xs sm:text-sm">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base sm:text-lg">
                    {profile.likesCount?.toLocaleString() || '0'}
                  </span>
                  <span className="text-gray-400 text-xs">Seguidores</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base sm:text-lg">
                    {profile.likesCount?.toLocaleString() || '0'}
                  </span>
                  <span className="text-gray-400 text-xs">Me gusta</span>
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
