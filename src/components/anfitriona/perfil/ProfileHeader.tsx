import Image from 'next/image';
import { MyProfileData } from '@/types/perfil';

interface ProfileHeaderProps {
  profile: MyProfileData | null;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const profileName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.username
    : '...';

  return (
    <div className="flex items-center gap-4">
      {/* Avatar con borde animado */}
      <div className="relative flex-shrink-0">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-canvas flex items-center justify-center">
            {profile?.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profileName}
                width={112}
                height={112}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-3xl">👤</div>
            )}
          </div>
        </div>
        {/* Indicador online */}
        <div
          className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-black ${
            profile?.isOnline ? 'bg-green-500' : 'bg-gray-500'
          }`}
        />
      </div>

      {/* Nombre y stats */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-ink">{profileName}</h2>
        <div className="flex items-center gap-3 mt-2 text-sm text-ink/55">
          <span>0 clientes</span>
          <span>{profile?.likesCount ?? 0} 💎</span>
        </div>
      </div>
    </div>
  );
}
