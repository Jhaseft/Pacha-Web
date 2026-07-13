'use client';

import { Clock, CheckCircle, XCircle, Banknote, FileText, ExternalLink } from 'lucide-react';
import type { MyWithdrawalRequest } from '@/types/anfitriona';

const STATUS = {
  PENDING: { label: 'Pendiente', className: 'bg-amber-50 text-amber-600', Icon: Clock },
  APPROVED: { label: 'Aprobado', className: 'bg-green-50 text-green-600', Icon: CheckCircle },
  REJECTED: { label: 'Rechazado', className: 'bg-red-50 text-red-600', Icon: XCircle },
} as const;

function destinationDetail(req: MyWithdrawalRequest): { label: string; value: string } | null {
  if (req.methodType === 'PAYPAL') {
    return { label: 'PayPal:', value: req.paypalEmail ?? '' };
  }
  if (req.methodType === 'BYBIT' || req.methodType === 'BINANCE') {
    const name = req.methodType === 'BYBIT' ? 'Bybit' : 'Binance';
    return { label: `${name} ID:`, value: req.accountNumber ?? '' };
  }
  return {
    label: `${req.bankName ?? 'Banco'} ·`,
    value: `${req.methodType === 'OTHER_BANK' ? 'CCI: ' : ''}${req.accountNumber ?? ''}`,
  };
}

export function WithdrawalRequestCard({ req }: { req: MyWithdrawalRequest }) {
  const { label, className, Icon } = STATUS[req.status];
  const detail = destinationDetail(req);
  const date = new Date(req.createdAt).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-card border border-line rounded-2xl px-4 py-4 shadow-sm">
      {/* Cabecera */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shrink-0">
            <Banknote size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-ink font-semibold text-sm truncate">
              {req.bankName ?? req.methodType}
            </p>
            <p className="text-ink-faint text-xs truncate">
              {req.paypalEmail ?? req.accountNumber ?? ''}
            </p>
          </div>
        </div>

        <span
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold shrink-0 ${className}`}
        >
          <Icon size={12} />
          {label}
        </span>
      </div>

      {/* Importes */}
      <div className="flex justify-between items-end gap-2">
        <div className="min-w-0">
          <p className="text-ink-faint text-xs mb-0.5">Créditos</p>
          <p className="text-ink font-bold">Cred/ {req.credits}</p>
        </div>
        <div className="text-right min-w-0">
          <p className="text-ink-faint text-xs mb-0.5">A recibir</p>
          <p className="text-green-600 font-black text-lg whitespace-nowrap">
            {req.payoutCurrency === 'USD' ? 'USD' : 'S/'} {req.payoutAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Destino */}
      {detail && detail.value && (
        <p className="mt-2 text-xs flex flex-wrap items-center gap-1">
          <span className="text-ink-faint">{detail.label}</span>
          <span className="text-ink-soft break-all">{detail.value}</span>
        </p>
      )}

      {/* Motivo del rechazo */}
      {req.status === 'REJECTED' && req.rejectionReason && (
        <div className="mt-3 rounded-xl px-3 py-2 bg-red-50 border border-red-200">
          <p className="text-red-600 text-xs font-semibold mb-0.5">Motivo del rechazo</p>
          <p className="text-ink-soft text-xs leading-4">{req.rejectionReason}</p>
        </div>
      )}

      {/* Comprobante */}
      {req.status === 'APPROVED' && req.receiptUrl && (
        <a
          href={req.receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
        >
          <FileText size={14} className="shrink-0" />
          Ver comprobante de pago
          <ExternalLink size={12} className="ml-auto shrink-0" />
        </a>
      )}

      <p className="text-ink-faint text-xs mt-3">{date}</p>
    </div>
  );
}
