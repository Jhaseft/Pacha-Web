'use client';

import { useState, useEffect } from 'react';
import { BankAccount, Bank } from '@/types/anfitriona';
import { apiGetBanks, apiAddBankAccount } from '@/lib/anfitriona';
import { X, ChevronDown, CheckCircle } from 'lucide-react';

type MethodType = 'BCP' | 'OTHER_BANK' | 'PAYPAL' | 'BYBIT' | 'BINANCE';

export function AddBankAccountModal({
  visible,
  onClose,
  onAdded,
}: {
  visible: boolean;
  onClose: () => void;
  onAdded: (account: BankAccount) => void;
}) {
  const [methodType, setMethodType] = useState<MethodType>('BCP');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [holderName, setHolderName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      apiGetBanks().then(setBanks).catch(() => {});
      setMethodType('BCP');
      setSelectedBank(null);
      setAccountNumber('');
      setPaypalEmail('');
      setHolderName('');
    }
  }, [visible]);

  const handleSave = async () => {
    if (methodType === 'PAYPAL') {
      if (!paypalEmail.trim()) return alert('Ingresa tu email de PayPal');
    } else if (methodType === 'OTHER_BANK') {
      if (!selectedBank) return alert('Selecciona un banco');
      if (!accountNumber.trim()) return alert('Ingresa el CCI');
    } else if (methodType === 'BYBIT' || methodType === 'BINANCE') {
      if (!accountNumber.trim()) return alert(`Ingresa tu ID de ${methodType === 'BYBIT' ? 'Bybit' : 'Binance'}`);
    } else {
      if (!accountNumber.trim()) return alert('Ingresa el número de cuenta BCP');
    }

    setLoading(true);
    try {
      const account = await apiAddBankAccount({
        type: methodType,
        bankId: methodType === 'OTHER_BANK' ? selectedBank!.id : undefined,
        accountNumber: methodType !== 'PAYPAL' ? accountNumber.trim() : undefined,
        paypalEmail: methodType === 'PAYPAL' ? paypalEmail.trim() : undefined,
        accountHolderName: holderName.trim() || undefined,
      });
      onAdded(account);
      onClose();
    } catch {
      alert('No se pudo agregar el método de pago');
    } finally {
      setLoading(false);
    }
  };

  const methodOptions: { key: MethodType; label: string; sub: string }[] = [
    { key: 'BCP', label: 'BCP', sub: 'N° de cuenta' },
    { key: 'OTHER_BANK', label: 'Otro banco', sub: 'CCI' },
    { key: 'PAYPAL', label: 'PayPal', sub: 'USD' },
    { key: 'BYBIT', label: 'Bybit', sub: 'ID cuenta' },
    { key: 'BINANCE', label: 'Binance', sub: 'ID cuenta' },
  ];

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Mobile: Bottom Sheet | Desktop: Centered Dialog */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center pointer-events-none">
        <div className="w-full md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl px-6 pt-5 pb-8 md:pb-6 max-h-[90vh] md:max-h-[95vh] overflow-y-auto pointer-events-auto md:mx-4 md:mr-0 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-black text-lg md:text-xl font-bold">Agregar método de pago</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black transition">
              <X size={22} />
            </button>
          </div>

          <p className="text-gray-600 text-xs mb-3 font-medium">Tipo de método</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {methodOptions.map((opt) => {
              const active = methodType === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    setMethodType(opt.key);
                    setSelectedBank(null);
                    setAccountNumber('');
                  }}
                  className={`rounded-lg p-3 text-center transition-all ${
                    active
                      ? 'bg-purple-50 border border-purple-500'
                      : 'bg-gray-100 border border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <p className={`font-bold text-sm ${active ? 'text-purple-700' : 'text-black'}`}>
                    {opt.label}
                  </p>
                  <p className={`text-xs mt-1 ${active ? 'text-purple-600' : 'text-gray-500'}`}>
                    {opt.sub}
                  </p>
                </button>
              );
            })}
          </div>

          {methodType === 'BCP' && (
            <>
              <label className="text-gray-600 text-xs mb-1 block font-medium">Número de cuenta BCP</label>
              <input
                type="text"
                placeholder="Ej: 1234567890123"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-gray-100 text-black placeholder:text-gray-400 rounded-xl px-4 py-3 mb-4 border border-gray-300 focus:border-purple-500 focus:outline-none transition"
              />
            </>
          )}

          {methodType === 'OTHER_BANK' && (
            <>
              <label className="text-gray-600 text-xs mb-1 block font-medium">Banco</label>
              <button
                onClick={() => setShowBankPicker(true)}
                className="w-full flex items-center justify-between bg-gray-100 rounded-xl px-4 py-3 mb-4 text-gray-500 border border-gray-300 hover:border-gray-400 transition"
              >
                <span className={selectedBank ? 'text-black' : ''}>{selectedBank ? selectedBank.name : 'Seleccionar banco'}</span>
                <ChevronDown size={18} />
              </button>

              <label className="text-gray-600 text-xs mb-1 block font-medium">CCI (código interbancario)</label>
              <input
                type="text"
                placeholder="Ej: 00212312300012345678"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-gray-100 text-black placeholder:text-gray-400 rounded-xl px-4 py-3 mb-4 border border-gray-300 focus:border-purple-500 focus:outline-none transition"
              />
            </>
          )}

          {methodType === 'PAYPAL' && (
            <>
              <label className="text-gray-600 text-xs mb-1 block font-medium">Email de PayPal</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="w-full bg-gray-100 text-black placeholder:text-gray-400 rounded-xl px-4 py-3 mb-4 border border-gray-300 focus:border-purple-500 focus:outline-none transition"
              />
            </>
          )}

          {(methodType === 'BYBIT' || methodType === 'BINANCE') && (
            <>
              <label className="text-gray-600 text-xs mb-1 block font-medium">
                ID de {methodType === 'BYBIT' ? 'Bybit' : 'Binance'}
              </label>
              <input
                type="text"
                placeholder="Ej: 123456789"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-gray-100 text-black placeholder:text-gray-400 rounded-xl px-4 py-3 mb-4 border border-gray-300 focus:border-purple-500 focus:outline-none transition"
              />
            </>
          )}

          <label className="text-gray-600 text-xs mb-1 block font-medium">Titular (opcional)</label>
          <input
            type="text"
            placeholder="Nombre del titular"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
            className="w-full bg-gray-100 text-black placeholder:text-gray-400 rounded-xl px-4 py-3 mb-6 border border-gray-300 focus:border-purple-500 focus:outline-none transition"
          />

          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-lg transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {loading ? 'Guardando...' : 'Guardar método'}
          </button>

          {showBankPicker && (
            <>
              <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowBankPicker(false)} />
              <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="bg-white rounded-2xl w-80 max-h-96 overflow-y-auto pointer-events-auto border border-gray-200 shadow-2xl">
                  {banks.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-500 text-sm">No hay bancos disponibles</p>
                    </div>
                  ) : (
                    banks.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => {
                          setSelectedBank(bank);
                          setShowBankPicker(false);
                        }}
                        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-200 hover:bg-gray-100 transition text-black"
                      >
                        <span>{bank.name}</span>
                        {selectedBank?.id === bank.id && <CheckCircle size={18} className="text-purple-500" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
