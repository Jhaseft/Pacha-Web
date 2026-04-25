import { Clock, CheckCircle, XCircle, CreditCard, Wallet } from "lucide-react";
import { WithdrawalRequest, WithdrawalStatus } from "@/types/withdrawalRequest";

const statusConfig: Record<WithdrawalStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  PENDING:  { label: "Pendiente", bg: "bg-yellow-500/10", text: "text-yellow-400", icon: <Clock       size={13} /> },
  APPROVED: { label: "Aprobado",  bg: "bg-green-500/10",  text: "text-green-400",  icon: <CheckCircle size={13} /> },
  REJECTED: { label: "Rechazado", bg: "bg-red-500/10",    text: "text-red-400",    icon: <XCircle     size={13} /> },
};

export function WithdrawalHistoryItem({ item }: { item: WithdrawalRequest }) {
  const config = statusConfig[item.status];
  const currencySymbol = item.payoutCurrency === "USD" ? "$" : "S/";
  const currencyLabel = item.payoutCurrency === "USD" ? "USD" : "Soles";

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors mb-2">
      {/* Main row */}
      <div className="px-4 py-3.5 flex items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/10 flex items-center justify-center shrink-0">
          <CreditCard size={18} className="text-pink-400" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-sm truncate">
            {item.anfitriona.firstName} {item.anfitriona.lastName ?? ""}
          </p>
          <p className="text-white/40 text-xs mt-0.5">
            {new Date(item.updatedAt).toLocaleDateString("es-ES", {
              day: "2-digit", month: "2-digit", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>

        {/* Status badge */}
        <span className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
          {config.icon}
          {config.label}
        </span>
      </div>

      {/* Bottom bar — amount on mobile */}
      <div className="flex items-center gap-2 bg-white/2 border-t border-white/5 px-4 py-2">
        <Wallet size={13} className="text-white/20 shrink-0" />
        <span className="text-white/25 text-[11px]">Monto:</span>
        <span className="text-green-400 text-xs font-bold">{currencySymbol}{item.payoutAmount.toFixed(2)} {currencyLabel}</span>
        <span className="text-white/25 text-[11px]">·</span>
        <span className="text-red-400 text-[11px] font-semibold">{item.credits.toFixed(0)} créditos</span>
      </div>
    </div>
  );
}
