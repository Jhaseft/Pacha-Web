'use client';

import { AnfitrioneProfileDetail } from '@/lib/hostessService';
import Image from 'next/image';
import { useState } from 'react';
import ImageViewer from './ImageViewer';

const COVER_HEIGHT = 270;
const AVATAR_SIZE = 90;

interface ProfileHeaderProps {
  profile: AnfitrioneProfileDetail;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  return (
    <>
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      </button>

      {/* Profile Info Container */}
      <div className="px-4 sm:px-6 lg:px-8 -mt-14 mb-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end">
            {/* Avatar */}
            <button
              onClick={() => profile.avatar && setViewingImage(profile.avatar)}
              className="relative flex-shrink-0 group"
            >
              <div
                className="relative rounded-2xl overflow-hidden border-4 border-yellow-500 shadow-2xl group-hover:scale-105 transition duration-300"
                style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
              >
                <Image
                  src={profile.avatar || '/no_image.svg'}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
                {/* Online Status */}
                <div
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-3 border-black shadow-lg ${
                    profile.isOnline ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                />
              </div>
            </button>

            {/* Name & Status */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{profile.name}</h1>
              <div className="flex flex-wrap gap-3 items-center mb-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    profile.isOnline
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {profile.isOnline ? '● En línea ahora' : '● Desconectada'}
                </span>
              </div>
              {profile.introMessage && (
                <p className="text-gray-400 text-sm">✨ {profile.introMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewingImage && <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />}
    </>
  );
}
