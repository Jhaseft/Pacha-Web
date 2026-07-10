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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="w-full px-5 md:px-12 lg:px-16 py-6 md:py-8">
        
        {/* Header con resumen */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            👋 Hola {user?.firstName ?? 'Anfitriona'}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Aquí está tu resumen de hoy</p>
        </div>

        {/* Earnings Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mb-8">
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
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            {/* Hoy - AnimatedBorderCard */}
            <div className="animated-border-card">
              <div className="animated-border-card-inner bg-gradient-to-br from-pink-500 to-blue-900 rounded-3xl px-5 md:px-6 py-5 md:py-6">
                <p className="text-pink-500 text-xs md:text-sm mb-2">Hoy</p>
                <p className="text-yellow-300 text-2xl md:text-3xl font-black">{earnings?.today ?? 0} cr</p>
                <p className="text-yellow-300 text-xs md:text-sm font-semibold opacity-70 mt-1">≈ ${earnings?.today ?? 0}</p>
              </div>
            </div>

            {/* Esta semana - GlowingCard */}
            <div className="glowing-card">
              <div className="glowing-card-inner bg-gradient-to-br from-purple-900 to-purple-600 rounded-3xl px-5 md:px-6 py-5 md:py-6">
                <p className="text-purple-200 text-xs md:text-sm mb-2 opacity-85">Esta semana</p>
                <p className="text-yellow-300 text-2xl md:text-3xl font-black">{earnings?.thisWeek ?? 0} cr</p>
                <p className="text-yellow-300 text-xs md:text-sm font-semibold opacity-70 mt-1">≈ ${earnings?.thisWeek ?? 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Access Buttons */}
        <h2 className="text-white font-bold text-base md:text-lg mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 mb-8">
          {/* Mensajes */}
          <button
            onClick={() => router.push('/dashboard/messages')}
            className="bg-blue-900 rounded-3xl py-4 md:py-5 flex flex-col items-center hover:bg-blue-800 transition"
          >
            <MessageCircle size={28} className="text-white mb-2" />
            <span className="text-white font-semibold text-xs md:text-xs">Mensajes</span>
            {unreadCount > 0 && (
              <div className="bg-pink-500 rounded-full px-2 py-0.5 mt-1.5">
                <span className="text-white text-xs font-bold">{unreadCount}</span>
              </div>
            )}
          </button>

          {/* Ganancias */}
          <div className="glowing-card">
            <button
              onClick={() => router.push('/dashboard/earnings')}
              className="glowing-card-inner bg-gradient-to-br from-blue-900 via-purple-600 to-pink-500 rounded-2xl py-4 md:py-5 w-full flex flex-col items-center"
            >
              <DollarSign size={28} className="text-white mb-2" />
              <span className="text-white font-bold text-xs md:text-xs">Ganancias</span>
              {earnings && (
                <span className="text-yellow-300 text-xs font-black mt-1">{earnings.today} cr</span>
              )}
            </button>
          </div>

          {/* Mis precios */}
          <button
            onClick={() => router.push('/dashboard/prices')}
            className="bg-blue-900 rounded-3xl py-4 md:py-5 flex flex-col items-center hover:bg-blue-800 transition"
          >
            <Settings size={28} className="text-white mb-2" />
            <span className="text-white font-semibold text-xs md:text-xs">Mis precios</span>
          </button>
        </div>

        {/* Subscription Banner */}
        <SubscriptionBanner />

        {/* Recent Activity */}
        <h2 className="text-white font-bold text-base md:text-lg mb-4">Actividad reciente</h2>

        {!earnings?.transactions || earnings.transactions.length === 0 ? (
          <div className="bg-blue-900 rounded-4xl p-8 text-center">
            <p className="text-gray-500 text-sm md:text-base">Sin actividad reciente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {earnings.transactions.map((tx) => {
              const IconComponent = getServiceIcon(tx.service);
              return (
                <div key={tx.id} className="animated-border-card">
                  <div className="animated-border-card-inner bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-4xl p-5 md:p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-3xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <IconComponent size={24} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm md:text-base">{tx.service}</p>
                        <p className="text-gray-400 text-xs md:text-sm mt-1">{formatRelativeTime(tx.createdAt)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-yellow-300 text-sm md:text-base font-black">{tx.amount} cr</p>
                        <p className="text-yellow-300 text-xs md:text-sm font-semibold opacity-70 mt-1">≈ ${tx.amount}</p>
                      </div>
                    </div>
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
