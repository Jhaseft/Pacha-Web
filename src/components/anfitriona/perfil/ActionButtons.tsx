import Link from 'next/link';
import { ChevronLeft, Settings, Eye, LogOut, Flame, Bell, Share2, Crown, Link as LinkIcon } from 'lucide-react';
import { MyProfileData } from '@/types/perfil';

interface ActionButtonsProps {
  profile: MyProfileData | null;
  isOnline: boolean;
  notificationsEnabled: boolean | null;
  onToggleOnline: () => void;
  onLogout: () => void;
  onNotifications: () => void;
  onShare: () => void;
}

export function ActionButtons({
  profile,
  isOnline,
  notificationsEnabled,
  onToggleOnline,
  onLogout,
  onNotifications,
  onShare,
}: ActionButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/dashboard/anfitriona/editar-perfil"
          className="bg-gradient-to-r from-brand to-pink-500 hover:shadow-lg hover:shadow-brand/50 text-white rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition shadow-md"
        >
          <Settings size={18} />
          Editar perfil
        </Link>
        {profile?.username ? (
          <Link
            href={`/anfitrionas/${profile.username}?preview=1`}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300 border border-blue-500/50 rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition shadow-md backdrop-blur-sm"
          >
            <Eye size={18} />
            Ver mi perfil
          </Link>
        ) : (
          <div
            title="Configura tu nombre de usuario para ver tu perfil público"
            className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 text-blue-300/50 border border-blue-500/30 rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-not-allowed backdrop-blur-sm"
          >
            <Eye size={18} />
            Ver mi perfil
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onToggleOnline}
          className={`relative rounded-xl overflow-hidden p-0.5 transition shadow-md ${
            isOnline
              ? 'bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg hover:shadow-pink-500/50'
              : 'bg-gradient-to-r from-pink-500/60 to-pink-600/60 hover:shadow-lg hover:shadow-pink-500/30'
          }`}
        >
          <div className={`w-full rounded-lg py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition ${
            isOnline
              ? 'bg-pink-900/50 text-pink-200'
              : 'bg-pink-900/40 text-pink-300'
          }`}>
            <Flame size={18} />
            {isOnline ? 'En línea' : 'Estar en línea'}
          </div>
        </button>
        <button
          onClick={onLogout}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300 border border-blue-500/50 rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition shadow-md backdrop-blur-sm hover:shadow-lg"
        >
          <LogOut size={18} />
          Salir
        </button>
      </div>

      {/* Notifications */}
      <button
        onClick={onNotifications}
        aria-pressed={!!notificationsEnabled}
        className="w-full relative rounded-xl overflow-hidden p-0.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/50 transition shadow-md"
      >
        <div className="w-full rounded-lg py-3 px-4 bg-blue-900/50 hover:bg-blue-900/60 flex items-center gap-3 transition">
          <Bell size={18} className={notificationsEnabled ? 'text-white' : 'text-blue-300'} />

          <span className="flex-1 min-w-0 text-left">
            <span className="block text-white font-bold text-sm">Notificaciones</span>
            <span className="block text-white/60 text-xs font-normal mt-0.5">
              {notificationsEnabled ? 'Activadas en este dispositivo' : 'Actívalas para no perderte nada'}
            </span>
          </span>

          <span
            className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${
              notificationsEnabled ? 'bg-blue-400' : 'bg-white/20'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                notificationsEnabled ? 'left-5.5' : 'left-0.5'
              }`}
            />
          </span>
        </div>
      </button>

      {/* Share Profile */}
      <button
        onClick={onShare}
        className="w-full relative rounded-xl overflow-hidden p-0.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg hover:shadow-pink-500/50 transition shadow-md"
      >
        <div className="w-full bg-pink-900/50 hover:bg-pink-900/60 text-pink-200 rounded-lg py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition">
          <Share2 size={18} />
          Compartir mi perfil
        </div>
      </button>

      {/* Subscriptions */}
      <Link
        href="/dashboard/anfitriona/subscription"
        className="w-full relative rounded-xl overflow-hidden p-0.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition shadow-md block"
      >
        <div className="w-full bg-purple-900/50 hover:bg-purple-900/60 text-purple-200 rounded-lg py-4 px-4 font-bold text-sm flex items-center justify-between transition">
          <div className="flex items-center gap-3">
            <Crown size={20} />
            <div className="text-left">
              <div className="text-white">Suscripciones</div>
              <div className="text-xs text-white/50 font-normal">Gestiona tu plan</div>
            </div>
          </div>
          <ChevronLeft size={20} className="rotate-180 text-purple-300" />
        </div>
      </Link>

      {/* Social Networks */}
      <Link
        href={`/dashboard/anfitriona/socialNetwork?userId=${profile?.id || ''}`}
        className="w-full relative rounded-xl overflow-hidden p-0.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg hover:shadow-pink-500/50 transition shadow-md block"
      >
        <div className="w-full bg-pink-900/50 hover:bg-pink-900/60 text-pink-200 rounded-lg py-4 px-4 font-bold text-sm flex items-center justify-between transition">
          <div className="flex items-center gap-3">
            <LinkIcon size={20} />
            <div className="text-left">
              <div className="text-white">Redes Sociales</div>
              <div className="text-xs text-white/50 font-normal">Conecta tus perfiles</div>
            </div>
          </div>
          <ChevronLeft size={20} className="rotate-180 text-pink-300" />
        </div>
      </Link>
    </div>
  );
}
