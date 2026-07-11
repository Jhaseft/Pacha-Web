'use client';

import { useState, useEffect } from 'react';
import { BankAccount } from '@/types/anfitriona';
import {
  apiGetBankAccounts,
  apiDeleteBankAccount,
  apiCreateWithdrawalRequest,
} from '@/lib/anfitriona';
import { X, Plus, Trash2 } from 'lucide-react';
import { AddBankAccountModal } from './AddBankAccountModal';

const MIN_WITHDRAWAL_USD = 5;
const CREDITS_PER_USD = 10;
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

export function WithdrawalModal(
  {
    visible,
    balance,
    creditRate,
    onClose,
    onSuccess,
  }: {
    visible: boolean;
    balance: number;
    creditRate: number;
    onClose: () => void;
    onSuccess: () => void;
  }
) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [credits, setCredits] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);

  const creditsNum = parseFloat(credits) || 0;
  const isPaypal = selectedAccount?.type === 'PAYPAL';
  const isUsd = selectedAccount ? ['PAYPAL', 'BYBIT', 'BINANCE'].includes(selectedAccount.type) : false;
  const solesAmount = (creditsNum * creditRate).toFixed(2);
  const usdAmount = CREDITS_PER_USD > 0 ? (creditsNum / CREDITS_PER_USD).toFixed(2) : '0.00';
  const minSoles = (MIN_WITHDRAWAL_CREDITS * creditRate).toFixed(2);
  const minUsd = CREDITS_PER_USD > 0 ? (MIN_WITHDRAWAL_CREDITS / CREDITS_PER_USD).toFixed(2) : '0.00';
  const belowMinimum = creditsNum > 0 && creditsNum < MIN_WITHDRAWAL_CREDITS;

  const loadAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const data = await apiGetBankAccounts();
      setAccounts(data);
    } catch {
      alert('No se pudieron cargar las cuentas');
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setCredits('');
      setSelectedAccount(null);
      loadAccounts();
    }
  }, [visible]);

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar esta cuenta?')) {
      await apiDeleteBankAccount(id).catch(() => { });
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      if (selectedAccount?.id === id) setSelectedAccount(null);
    }
  };

  const handleSubmit = async () => {
    if (!credits || creditsNum <= 0) return alert('Ingresa un monto válido');
    if (creditsNum > balance) return alert(`Solo tienes Cred/ ${balance} disponibles`);
    if (!selectedAccount) return alert('Selecciona una cuenta bancaria');

    setLoading(true);
    try {
      await apiCreateWithdrawalRequest({
        credits: creditsNum,
        bankAccountId: selectedAccount.id,
      });
      alert(
        `Solicitud enviada\n\nTu solicitud de retiro de S/ ${solesAmount} (USD ${usdAmount}) fue enviada. El equipo la procesará en 1-3 días hábiles.`
      );
      onClose();
      onSuccess();
    } catch {
      alert('No se pudo enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Mobile: Bottom Sheet | Desktop: Centered Dialog */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center pointer-events-none">
        <div className="w-full md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl px-6 pt-5 pb-8 md:pb-6 max-h-[85vh] md:max-h-[90vh] overflow-y-auto pointer-events-auto md:mx-4 md:mr-0">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-black text-lg md:text-xl font-bold">Solicitar pago</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition">
              <X size={22} />
            </button>
          </div>

          {/* Balance */}
          <div className="bg-gray-100 rounded-xl px-4 py-3 mb-5 flex justify-between">
            <span className="text-gray-600 text-sm">Saldo disponible</span>
            <span className="text-black font-bold text-sm">Cred/ {balance}</span>
          </div>

          {/* Credits input */}
          <label className="text-black text-xs mb-1 block">
            Monto a retirar (créditos)
          </label>
          <p className="text-gray-500 text-xs mb-2">
            Mín. USD {MIN_WITHDRAWAL_USD} · {MIN_WITHDRAWAL_CREDITS} cr.
          </p>
          {isPaypal && (
            <p className="text-blue-600 text-xs mb-2">
              💡 PayPal: 1 crédito = USD {(1 / CREDITS_PER_USD).toFixed(2)}
            </p>
          )}
          <input
            type="number"
            placeholder={`Mín. ${MIN_WITHDRAWAL_CREDITS} créditos`}
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="w-full bg-gray-100 text-gray-800 rounded-xl px-4 py-3 text-lg font-bold mb-3 border border-gray-300 focus:border-purple-500 focus:outline-none transition"
          />

          {/* Aviso mínimo */}
          {belowMinimum && (
            <div className="rounded-xl px-4 py-2 mb-3 bg-pink-100 border border-pink-300">
              <p className="text-pink-700 text-xs">
                El mínimo de retiro es USD {MIN_WITHDRAWAL_USD} ({MIN_WITHDRAWAL_CREDITS} créditos · S/ {minSoles} / USD {minUsd})
              </p>
            </div>
          )}

          {/* Payout conversion */}
          <div className="rounded-xl px-4 py-3 mb-6 bg-purple-100 border border-purple-300">
            <p className="text-gray-700 text-xs mb-2">Recibirás</p>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Soles</p>
                <p className={`font-black text-xl ${isUsd ? 'text-gray-600' : 'text-purple-600'}`}>
                  S/ {solesAmount}
                </p>
              </div>
              <div className="w-px h-9 bg-purple-300 mx-4" />
              <div className="text-center flex-1">
                <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">USD</p>
                <p className={`font-black text-xl ${isUsd ? 'text-purple-600' : 'text-gray-600'}`}>
                  USD {usdAmount}
                </p>
              </div>
            </div>
          </div>

          {/* Bank accounts */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-black font-semibold">Cuenta de destino</h3>
            <button
              onClick={() => setShowAddAccount(true)}
              className="flex items-center gap-1 text-purple-600 text-xs font-semibold hover:text-purple-700 transition"
            >
              <Plus size={14} />
              Agregar
            </button>
          </div>

          {loadingAccounts ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-purple-600"></div>
            </div>
          ) : accounts.length === 0 ? (
            <button
              onClick={() => setShowAddAccount(true)}
              className="w-full bg-gray-100 rounded-xl py-5 text-center mb-6 border border-dashed border-gray-400 hover:border-gray-500 transition"
            >
              <Plus size={20} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Agrega una cuenta bancaria</p>
            </button>
          ) : (
            <div className="mb-6 max-h-48 overflow-y-auto">
              {accounts.map((acc) => {
                const selected = selectedAccount?.id === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc)}
                    className={`w-full flex items-center rounded-xl px-4 py-3 mb-2 cursor-pointer transition-all ${selected
                        ? 'bg-purple-100 border border-purple-500'
                        : 'bg-gray-100 border border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${selected ? 'border-purple-600' : 'border-gray-400'
                        }`}
                    >
                      {selected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      )}
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <p className="text-black font-semibold text-sm truncate">
                        {accountLabel(acc)}
                      </p>
                      <p className="text-gray-600 text-xs truncate">
                        {accountDetail(acc)}
                      </p>
                      {acc.accountHolderName && (
                        <p className="text-gray-500 text-xs truncate">
                          {acc.accountHolderName}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(acc.id);
                      }}
                      className="text-gray-500 hover:text-red-600 transition flex-shrink-0 ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-gray-500 text-xs text-center mb-5">
            1 crédito = S/ 0.90 · El pago se procesa en 1-3 días hábiles
          </p>

          <button
            onClick={handleSubmit}
            disabled={loading || belowMinimum}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg transition-all ${belowMinimum || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
          >
            {loading ? 'Procesando...' : `Solicitar S/ ${solesAmount} · USD ${usdAmount}`}
          </button>
        </div>
      </div>

      <AddBankAccountModal
        visible={showAddAccount}
        onClose={() => setShowAddAccount(false)}
        onAdded={(acc) => {
          setAccounts((prev) => [acc, ...prev]);
          setSelectedAccount(acc);
        }}
      />
    </>
  );
}
