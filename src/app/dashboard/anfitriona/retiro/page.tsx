'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2, CheckCircle2, ClipboardList, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BankAccount } from '@/types/anfitriona';
import {
  apiGetMyEarnings,
  apiGetBankAccounts,
  apiDeleteBankAccount,
  apiCreateWithdrawalRequest,
} from '@/lib/anfitriona';
import { apiGetConfig } from '@/lib/config';
import PageHeader from '@/components/common/PageHeader';
import { AddBankAccountModal } from '@/components/anfitriona/AddBankAccountModal';

// Mismos valores que la app móvil y que valida el backend (50 USD × 4 = 200 cr).
// El fallback evita que un .env incompleto deje la pantalla con NaN.
const num = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const MIN_WITHDRAWAL_USD = num(process.env.NEXT_PUBLIC_MIN_WITHDRAWAL_USD, 50);
const CREDITS_PER_USD = num(process.env.NEXT_PUBLIC_CREDITS_PER_USD, 4);
const MIN_WITHDRAWAL_CREDITS = MIN_WITHDRAWAL_USD * CREDITS_PER_USD;

function accountLabel(acc: BankAccount): string {
  if (acc.type === 'BYBIT') return 'Bybit';
  if (acc.type === 'BINANCE') return 'Binance';
  if (acc.type === 'PAYPAL') return 'PayPal';
  return acc.bankName ?? acc.type;
}

function accountDetail(acc: BankAccount): string {
  if (acc.type === 'PAYPAL') return acc.paypalEmail ?? '';
  if (acc.type === 'BYBIT' || acc.type === 'BINANCE') return `ID: ${acc.accountNumber ?? ''}`;
  if (acc.type === 'OTHER_BANK') return `CCI: ${acc.accountNumber ?? ''}`;
  return acc.accountNumber ?? '';
}

export default function RetiroPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();

  const [balance, setBalance] = useState(0);
  // Tasa crédito→soles del backend (creditToSolesRate), como hace el móvil.
  const [creditRate, setCreditRate] = useState(1);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [credits, setCredits] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [submitted, setSubmitted] = useState<{ soles: string; usd: string } | null>(null);

  const creditsNum = parseFloat(credits) || 0;
  const isPaypal = selectedAccount?.type === 'PAYPAL';
  const isUsd = selectedAccount
    ? ['PAYPAL', 'BYBIT', 'BINANCE'].includes(selectedAccount.type)
    : false;
  const solesAmount = (creditsNum * creditRate).toFixed(2);
  const usdAmount = (creditsNum / CREDITS_PER_USD).toFixed(2);
  const minSoles = (MIN_WITHDRAWAL_CREDITS * creditRate).toFixed(2);
  const minUsd = (MIN_WITHDRAWAL_CREDITS / CREDITS_PER_USD).toFixed(2);
  const belowMinimum = creditsNum > 0 && creditsNum < MIN_WITHDRAWAL_CREDITS;
  const exceedsBalance = creditsNum > balance;
  const canSubmit =
    !submitting && creditsNum >= MIN_WITHDRAWAL_CREDITS && !exceedsBalance && !!selectedAccount;

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

  const loadData = useCallback(async () => {
    try {
      const [earnings, bankAccounts, config] = await Promise.all([
        apiGetMyEarnings(),
        apiGetBankAccounts(),
        apiGetConfig(),
      ]);
      setBalance(Number(earnings?.balance ?? 0));
      setAccounts(bankAccounts);
      setCreditRate(config.creditToSolesRate);
    } catch {
      setError('No se pudieron cargar tus datos de retiro.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta cuenta?')) return;
    try {
      await apiDeleteBankAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      if (selectedAccount?.id === id) setSelectedAccount(null);
    } catch {
      setError('No se pudo eliminar la cuenta.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedAccount) {
      setError('Selecciona una cuenta de destino.');
      return;
    }
    if (exceedsBalance) {
      setError(`Solo tienes ${balance} créditos disponibles.`);
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await apiCreateWithdrawalRequest({
        credits: creditsNum,
        bankAccountId: selectedAccount.id,
      });
      setSubmitted({ soles: solesAmount, usd: usdAmount });
    } catch {
      setError('No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500" />
      </div>
    );
  }

  // Confirmación: sustituye al alert() del modal anterior.
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
        <div className="w-full max-w-lg mx-auto px-4 sm:px-5 py-6 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={34} className="text-green-600" />
            </div>
            <h1 className="text-ink text-xl font-bold">Solicitud enviada</h1>
            <p className="text-ink-faint text-sm max-w-xs">
              Tu retiro de <span className="font-bold text-ink">S/ {submitted.soles}</span> (USD{' '}
              {submitted.usd}) fue enviado. El equipo lo procesará en 1 a 3 días hábiles.
            </p>

            <div className="w-full flex flex-col gap-2.5 mt-2">
              <Link
                href="/dashboard/anfitriona/withdrawal-requests"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 hover:shadow-lg transition-all"
              >
                <ClipboardList size={18} />
                Ver mis retiros
              </Link>
              <Link
                href="/dashboard/earnings"
                className="w-full rounded-xl border border-line bg-card text-ink font-semibold py-3.5 hover:bg-canvas-alt transition-colors"
              >
                Volver a ganancias
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <div className="w-full max-w-lg mx-auto px-4 sm:px-5 py-6 flex-1 flex flex-col">
        <PageHeader
          title="Solicitar pago"
          description="Retira tus ganancias a tu cuenta"
          onBack={() => router.push('/dashboard/earnings')}
        />

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-4">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Saldo */}
        <div className="bg-canvas-alt rounded-xl px-4 py-3 mb-5 flex items-center justify-between gap-2">
          <span className="text-ink-faint text-sm">Saldo disponible</span>
          <span className="text-ink font-bold text-sm whitespace-nowrap">Cred/ {balance}</span>
        </div>

        {/* Monto */}
        <label htmlFor="credits" className="text-ink text-xs font-semibold mb-1 block">
          Monto a retirar (créditos)
        </label>
        <p className="text-ink-faint text-xs mb-2">
          Mín. USD {MIN_WITHDRAWAL_USD} · {MIN_WITHDRAWAL_CREDITS} cr.
        </p>
        {isPaypal && (
          <p className="text-blue-600 text-xs mb-2">
            💡 PayPal: 1 crédito = USD {(1 / CREDITS_PER_USD).toFixed(2)}
          </p>
        )}
        <input
          id="credits"
          type="number"
          min={MIN_WITHDRAWAL_CREDITS}
          inputMode="numeric"
          placeholder={`Mín. ${MIN_WITHDRAWAL_CREDITS} créditos`}
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          className="w-full min-w-0 bg-canvas-alt text-ink rounded-xl px-4 py-3 text-lg font-bold mb-3 border border-line focus:border-purple-500 focus:outline-none transition"
        />

        {belowMinimum && (
          <div className="rounded-xl px-4 py-2 mb-3 bg-pink-50 border border-pink-200">
            <p className="text-pink-700 text-xs">
              El mínimo de retiro es USD {MIN_WITHDRAWAL_USD} ({MIN_WITHDRAWAL_CREDITS} créditos · S/{' '}
              {minSoles} / USD {minUsd})
            </p>
          </div>
        )}

        {exceedsBalance && (
          <div className="rounded-xl px-4 py-2 mb-3 bg-red-50 border border-red-200">
            <p className="text-red-700 text-xs">
              No puedes retirar más de tus {balance} créditos disponibles.
            </p>
          </div>
        )}

        {/* Conversión */}
        <div className="rounded-xl px-4 py-3 mb-6 bg-purple-50 border border-purple-200">
          <p className="text-ink-soft text-xs mb-2">Recibirás</p>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1 min-w-0">
              <p className="text-ink-faint text-[10px] uppercase tracking-widest mb-1">Soles</p>
              <p className={`font-black text-xl ${isUsd ? 'text-ink-faint' : 'text-purple-600'}`}>
                S/ {solesAmount}
              </p>
            </div>
            <div className="w-px h-9 bg-purple-200 mx-4" />
            <div className="text-center flex-1 min-w-0">
              <p className="text-ink-faint text-[10px] uppercase tracking-widest mb-1">USD</p>
              <p className={`font-black text-xl ${isUsd ? 'text-purple-600' : 'text-ink-faint'}`}>
                USD {usdAmount}
              </p>
            </div>
          </div>
        </div>

        {/* Cuentas */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-ink font-semibold">Cuenta de destino</h2>
          <button
            onClick={() => setShowAddAccount(true)}
            className="flex items-center gap-1 text-purple-600 text-xs font-semibold hover:text-purple-700 transition shrink-0"
          >
            <Plus size={14} />
            Agregar
          </button>
        </div>

        {accounts.length === 0 ? (
          <button
            onClick={() => setShowAddAccount(true)}
            className="w-full bg-canvas-alt rounded-xl py-5 text-center mb-6 border border-dashed border-line hover:border-purple-400 transition"
          >
            <Plus size={20} className="text-ink-faint mx-auto mb-2" />
            <p className="text-ink-faint text-sm">Agrega una cuenta bancaria</p>
          </button>
        ) : (
          <div className="mb-6 flex flex-col gap-2">
            {accounts.map((acc) => {
              const selected = selectedAccount?.id === acc.id;
              return (
                <label
                  key={acc.id}
                  className={`w-full flex items-center rounded-xl px-4 py-3 cursor-pointer transition-all ${
                    selected
                      ? 'bg-purple-50 border border-purple-500'
                      : 'bg-canvas-alt border border-line hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="bankAccount"
                    checked={selected}
                    onChange={() => setSelectedAccount(acc)}
                    className="sr-only"
                  />
                  <span
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center shrink-0 ${
                      selected ? 'border-purple-600' : 'border-gray-400'
                    }`}
                  >
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                  </span>

                  <span className="flex-1 text-left min-w-0">
                    <span className="block text-ink font-semibold text-sm truncate">
                      {accountLabel(acc)}
                    </span>
                    <span className="block text-ink-faint text-xs truncate">
                      {accountDetail(acc)}
                    </span>
                    {acc.accountHolderName && (
                      <span className="block text-ink-faint text-xs truncate">
                        {acc.accountHolderName}
                      </span>
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAccount(acc.id);
                    }}
                    aria-label={`Eliminar cuenta ${accountLabel(acc)}`}
                    className="text-ink-faint hover:text-red-600 transition shrink-0 ml-2 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </label>
              );
            })}
          </div>
        )}

        <p className="text-ink-faint text-xs text-center mb-5">
          1 crédito = S/ {creditRate.toFixed(2)} · El pago se procesa en 1-3 días hábiles
        </p>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-90 flex items-center justify-center"
        >
          {submitting ? (
            <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : (
            `Solicitar S/ ${solesAmount} · USD ${usdAmount}`
          )}
        </button>
      </div>

      <AddBankAccountModal
        visible={showAddAccount}
        onClose={() => setShowAddAccount(false)}
        onAdded={(acc) => {
          setAccounts((prev) => [acc, ...prev]);
          setSelectedAccount(acc);
          setShowAddAccount(false);
        }}
      />
    </div>
  );
}
