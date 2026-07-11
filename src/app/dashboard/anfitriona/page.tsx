'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiGetMyEarnings, getChats } from '@/lib/anfitriona';
import type { EarningsData, ChatData } from '@/types/anfitriona';
import {
  MessageCircle,
  DollarSign,
  Settings,
  Phone,
  Video,
  Images,
} from 'lucide-react';
import { SubscriptionBanner } from '@/components/anfitriona/SubscriptionBanner';
import './anfitriona.css';

function getServiceIcon(service: string) {
  const s = service.toLowerCase();
  if (s.includes('llamada') || s.includes('call')) return Phone;
  if (s.includes('video')) return Video;
  if (s.includes('foto') || s.includes('imagen') || s.includes('image'))
    return Images;
  return MessageCircle;
}

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  return 'Ayer';
}

export default function AnfitrianaPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ANFITRIONA') {
      router.push('/dashboard');
      return;
    }
  }, [isHydrated, isAuthenticated, user?.role, router]);

  const loadData = useCallback(async () => {
    try {
      const [earningsData, chatsData] = await Promise.all([
        apiGetMyEarnings(),
        user?.id ? getChats(user.id) : Promise.resolve([]),
      ]);
      setEarnings(earningsData);
      setChats(chatsData);
      const total = chatsData.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
      setUnreadCount(total);
    } catch (error: any) {
      if (error.response?.status === 401 || error.message?.includes('401')) {
        router.push('/login');
      } else {
        console.error('Error loading data:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-5 md:px-12 lg:px-16 py-6 md:py-8">
        
        {/* Header con resumen */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-1">
            👋 Hola {user?.firstName ?? 'Anfitriona'}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Aquí está tu resumen de hoy</p>
        </div>

        {/* Earnings Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="bg-blue-900 rounded-4xl h-24 md:h-28 flex items-center justify-center"
              >
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4 mb-4">
            {/* Hoy - AnimatedBorderCard */}
            <div className="">
              <div className=" bg-gradient-to-br from-pink-500 to-blue-900 rounded-2xl px-5 md:px-6 py-5 md:py-6">
                <p className="text-pink-500 text-xs md:text-sm mb-2">Hoy</p>
                <p className="text-yellow-300 text-2xl md:text-3xl font-black">{earnings?.today ?? 0} cr</p>
                <p className="text-yellow-300 text-xs md:text-sm font-semibold opacity-70 mt-1">≈ ${earnings?.today ?? 0}</p>
              </div>
            </div>

            {/* Esta semana - GlowingCard */}
            <div className="glowing-card">
              <div className="glowing-card-inner bg-gradient-to-br from-purple-900 to-purple-600 rounded-2xl px-5 md:px-6 py-5 md:py-6">
                <p className="text-purple-200 text-xs md:text-sm mb-2 opacity-85">Esta semana</p>
                <p className="text-yellow-300 text-2xl md:text-3xl font-black">{earnings?.thisWeek ?? 0} cr</p>
                <p className="text-yellow-300 text-xs md:text-sm font-semibold opacity-70 mt-1">≈ ${earnings?.thisWeek ?? 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Access Buttons */}
        <h2 className="text-black font-bold text-lg md:text-xl mb-2">Accesos rápidos</h2>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6 mb-4">
          {/* Mensajes */}
          <button
            onClick={() => router.push('/dashboard/messages')}
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl md:rounded-3xl py-4 md:py-5 px-3 md:px-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
          >
            <MessageCircle size={32} className="text-white mb-3" />
            <span className="text-white font-bold text-xs md:text-sm">Mensajes</span>
            {unreadCount > 0 && (
              <div className="bg-pink-500 rounded-full px-2 py-0.5 mt-2">
                <span className="text-white text-xs font-bold">{unreadCount}</span>
              </div>
            )}
          </button>

          {/* Ganancias */}
          <button
            onClick={() => router.push('/dashboard/earnings')}
            className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl py-4 md:py-5 px-3 md:px-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
          >
            <DollarSign size={32} className="text-white mb-3" />
            <span className="text-white font-bold text-xs md:text-sm">Ganancias</span>
            {earnings && (
              <span className="text-yellow-300 text-xs font-black mt-2">{earnings.today} cr</span>
            )}
          </button>

          {/* Mis precios */}
          <button
            onClick={() => router.push('/dashboard/anfitriona/precios')}
            className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl md:rounded-3xl py-4 md:py-5 px-3 md:px-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
          >
            <Settings size={32} className="text-white mb-3" />
            <span className="text-white font-bold text-xs md:text-sm">Mis precios</span>
          </button>
        </div>

        {/* Subscription Banner */}
        <SubscriptionBanner />

        {/* Recent Activity */}
        <h2 className="text-black font-bold text-lg md:text-xl mb-2">Actividad reciente</h2>

        {!earnings?.transactions || earnings.transactions.length === 0 ? (
          <div className="bg-card border border-line rounded-2xl p-8 text-center">
            <p className="text-ink-faint text-sm md:text-base">Sin actividad reciente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:gap-4">
            {earnings.transactions.map((tx) => {
              const IconComponent = getServiceIcon(tx.service);
              return (
                <div key={tx.id} className="bg-gradient-to-r from-purple to-secondary rounded-2xl p-3 md:p-4 flex items-center gap-3 hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <IconComponent size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-xs md:text-sm">{tx.service}</p>
                    <p className="text-white/70 text-xs md:text-xs mt-0.5">{formatRelativeTime(tx.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-xs md:text-sm font-bold">{tx.amount} cr</p>
                    <p className="text-white/70 text-xs md:text-xs font-semibold mt-0.5">≈ ${tx.amount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
