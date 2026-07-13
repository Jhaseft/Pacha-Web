'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Banknote, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiGetMyWithdrawalRequests } from '@/lib/anfitriona';
import type { MyWithdrawalRequest } from '@/types/anfitriona';
import PageHeader from '@/components/common/PageHeader';
import { WithdrawalRequestCard } from '@/components/anfitriona/WithdrawalRequestCard';

export default function WithdrawalRequestsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();

  const [requests, setRequests] = useState<MyWithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ANFITRIONA') {
      router.push('/dashboard');
    }
  }, [isHydrated, isAuthenticated, user?.role, router]);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      setRequests(await apiGetMyWithdrawalRequests());
      setError('');
    } catch {
      setError('No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pending = requests.filter((r) => r.status === 'PENDING');
  const rest = requests.filter((r) => r.status !== 'PENDING');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <div className="w-full max-w-lg mx-auto px-4 sm:px-5 py-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <PageHeader
            title="Mis solicitudes"
            description="Estado de tus retiros"
            onBack={() => router.push('/dashboard/earnings')}
          />
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            aria-label="Actualizar solicitudes"
            className="shrink-0 mt-1 p-2 rounded-lg text-ink-faint hover:bg-canvas-alt hover:text-ink transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-20">
            <Banknote size={52} className="text-ink-faint/40" />
            <p className="text-ink-faint text-sm">Aún no has hecho solicitudes de retiro.</p>
            <Link
              href="/dashboard/anfitriona/retiro"
              className="rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold text-sm px-6 py-3 hover:shadow-lg transition-all"
            >
              Solicitar un retiro
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.length > 0 && (
              <>
                <h2 className="text-ink-faint text-xs font-semibold uppercase tracking-widest">
                  En proceso
                </h2>
                {pending.map((r) => (
                  <WithdrawalRequestCard key={r.id} req={r} />
                ))}
              </>
            )}

            {rest.length > 0 && (
              <>
                <h2 className="text-ink-faint text-xs font-semibold uppercase tracking-widest mt-3">
                  Historial
                </h2>
                {rest.map((r) => (
                  <WithdrawalRequestCard key={r.id} req={r} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
