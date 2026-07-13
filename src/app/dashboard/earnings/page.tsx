'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  apiGetMyEarnings,
  apiGetMyReferrals,
} from '@/lib/anfitriona';
import type { EarningsData, MyReferralsResponse } from '@/types/anfitriona';
import { TrendingUp, Copy, ClipboardList } from 'lucide-react';
import { AnimatedBorderCard } from '@/components/anfitriona/AnimatedBorderCard';
import { TransactionItem } from '@/components/anfitriona/TransactionItem';

function formatUSD(credits: number): string {
  const usd = credits / 10;
  return `$${usd.toFixed(2)}`;
}

export default function EarningsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [referrals, setReferrals] = useState<MyReferralsResponse | null>(null);
  const [referralsError, setReferralsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      const [earningsResult, referralsResult] = await Promise.allSettled([
        apiGetMyEarnings(),
        apiGetMyReferrals(),
      ]);

      if (earningsResult.status === 'fulfilled') {
        setEarnings(earningsResult.value);
      } else {
        throw earningsResult.reason;
      }

      if (referralsResult.status === 'fulfilled') {
        setReferrals(referralsResult.value);
        setReferralsError(null);
      } else {
        setReferrals(null);
        setReferralsError(
          referralsResult.reason instanceof Error
            ? referralsResult.reason.message
            : 'No se pudo cargar la información de referidos'
        );
      }
    } catch (error: any) {
      if (error.response?.status === 401 || error.message?.includes('401')) {
        router.push('/login');
      } else {
        console.error('Error loading data:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyReferralCode = async () => {
    if (!referrals?.referralCode) return;
    await navigator.clipboard.writeText(referrals.referralCode);
    alert('Código de referido copiado al portapapeles');
  };

  const agreedPercent = (() => {
    const contracts = referrals?.referrals ?? [];
    if (!contracts.length) return 0;
    const active = contracts.find((item) => item.status === 'ACTIVE');
    return Number((active ?? contracts[0]).percent ?? 0);
  })();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-5 py-6">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-1">
            Mis ganancias
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Resumen de tus ingresos</p>
        </div>

        {/* Total Card */}
        <AnimatedBorderCard>
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 rounded-3xl px-6 md:px-10 py-3 md:py-7 mb-4 border border-purple-500/20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
              <div>
                <p className="text-purple-200 text-xs md:text-xs mb-2 opacity-80 font-medium tracking-wide">
                  TOTAL ACUMULADO
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-yellow-300 text-5xl md:text-4xl font-black tracking-tight">
                    {earnings?.total ?? 0}
                  </p>
                  <p className="text-purple-200 text-lg md:text-base font-semibold">cr</p>
                </div>
                <p className="text-yellow-300/80 text-sm md:text-xs font-semibold mt-2">
                  ≈ {formatUSD(earnings?.total ?? 0)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 md:gap-8 w-full md:w-auto">
                <div className="md:text-right">
                  <p className="text-purple-200 text-xs opacity-75 font-medium tracking-wide mb-1">
                    HOY
                  </p>
                  <p className="text-yellow-300 text-2xl md:text-xl font-black">
                    {earnings?.today ?? 0}
                  </p>
                  <p className="text-yellow-300/70 text-xs font-medium mt-1">
                    ≈ {formatUSD(earnings?.today ?? 0)}
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-purple-200 text-xs opacity-75 font-medium tracking-wide mb-1">
                    ESTA SEMANA
                  </p>
                  <p className="text-yellow-300 text-2xl md:text-xl font-black">
                    {earnings?.thisWeek ?? 0}
                  </p>
                  <p className="text-yellow-300/70 text-xs font-medium mt-1">
                    ≈ {formatUSD(earnings?.thisWeek ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedBorderCard>

        {/* Referral Card */}
        <AnimatedBorderCard>
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl px-6 md:px-10 py-6 md:py-7 mb-4 border border-blue-500/20">
            <p className="text-blue-200 text-xs opacity-80 font-medium tracking-wide mb-2">
              CÓDIGO DE REFERIDO
            </p>
            <p className="text-white text-sm md:text-sm mb-4 leading-relaxed">
              Como creador de contenido, comparte tu código con otros creadores. Si el administrador activa un contrato de referido, ganarás un porcentaje sobre sus ganancias reales.
            </p>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-black/30 rounded-2xl px-4 md:px-5 py-4 md:py-3 mb-6 border border-purple-500/30">
              <div className="mb-4 md:mb-0">
                <p className="text-blue-200 text-xs opacity-75 font-medium mb-1">Código de referido</p>
                <p className="text-yellow-300 text-3xl md:text-2xl font-black tracking-widest">
                  {referrals?.referralCode || '—'}
                </p>
              </div>
              {referrals?.referralCode && (
                <button
                  onClick={handleCopyReferralCode}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-lg flex items-center justify-center md:justify-start gap-2 hover:opacity-90 transition font-semibold text-sm"
                >
                  <Copy size={16} />
                  <span>Copiar</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 md:gap-4">
              <div className="flex-1 text-center">
                <p className="text-blue-200 text-xs opacity-75 font-medium tracking-wide mb-2">
                  PORCENTAJE ACORDADO
                </p>
                <p className="text-yellow-300 text-2xl md:text-xl font-black">
                  {agreedPercent}%
                </p>
              </div>
              <div className="w-px h-12 bg-blue-500/30" />
              <div className="flex-1 text-center">
                <p className="text-blue-200 text-xs opacity-75 font-medium tracking-wide mb-2">
                  CREADORES REFERIDOS
                </p>
                <p className="text-yellow-300 text-2xl md:text-xl font-black">
                  {referrals?.totalReferrals ?? 0}
                </p>
              </div>
              <div className="w-px h-12 bg-blue-500/30" />
              <div className="flex-1 text-center">
                <p className="text-blue-200 text-xs opacity-75 font-medium tracking-wide mb-2">
                  GANANCIAS POR REFERIDOS
                </p>
                <p className="text-yellow-300 text-2xl md:text-xl font-black">
                  {Number(referrals?.totalRewardAmount ?? 0).toFixed(2)} cr
                </p>
              </div>
            </div>

            {referralsError && (
              <p className="text-orange-500 text-xs mt-4 font-medium">{referralsError}</p>
            )}
          </div>
        </AnimatedBorderCard>

        {/* Action Buttons */}
        <div className="mb-6">
          <AnimatedBorderCard>
            <button
              onClick={() => router.push('/dashboard/anfitriona/retiro')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition"
            >
              Retirar dinero
            </button>
          </AnimatedBorderCard>

          <button
            onClick={() => router.push('/dashboard/anfitriona/withdrawal-requests')}
            className="w-full flex items-center justify-center gap-2 bg-blue-900 text-gray-300 font-semibold py-3 rounded-2xl hover:bg-blue-800 transition mt-3"
          >
            <ClipboardList size={18} />
            Mis retiros
          </button>
        </div>

        {/* Transaction History */}
        <h2 className="text-black font-bold text-lg md:text-xl mb-2">
          Historial de transacciones
        </h2>

        {!earnings?.transactions || earnings.transactions.length === 0 ? (
          <div className="bg-blue-900 rounded-4xl p-8 text-center">
            <TrendingUp size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm md:text-base">
              Aún no tienes ganancias registradas.
              <br />
              ¡Empieza a enviar mensajes bloqueados!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:gap-4">
            {earnings.transactions.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} formatUSD={formatUSD} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
