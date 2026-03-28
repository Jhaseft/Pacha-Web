import Image from "next/image";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { WithdrawalRequest, WithdrawalStatus } from "@/types/withdrawalRequest";

const statusConfig: Record<WithdrawalStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:  { label: "Pendiente", color: "#fbbf24", icon: <Clock className="w-3.5 h-3.5" /> },
  APPROVED: { label: "Aprobado",  color: "#00ff88", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  REJECTED: { label: "Rechazado", color: "#ff3b5c", icon: <XCircle className="w-3.5 h-3.5" /> },
};

interface Props {
  item: WithdrawalRequest;
  onPress?: () => void;
}

export function AnfitrionaRequestItem({ item, onPress }: Props) {
  const config = statusConfig[item.status];

  return (
    <div
      onClick={onPress}
      className="bg-[#460202] rounded-[22px] p-4 mb-3 border border-red-600 flex items-center justify-between cursor-pointer hover:brightness-110 transition-all shadow-[0_6px_20px_rgba(225,29,72,0.3)]"
    >
      <div className="flex items-center flex-1 pr-3 gap-3">
        <div className="w-14 h-14 rounded-full border-2 border-[#ff3b5c] shrink-0 overflow-hidden">
          <Image
            src={item.anfitriona.anfitrionaProfile?.avatarUrl ?? "/placeholder.png"}
            alt={item.anfitriona.firstName ?? ""}
            width={56}
            height={56}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-base leading-5 tracking-tight truncate">
            {item.anfitriona.firstName} {item.anfitriona.lastName ?? ""}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-bold text-lg text-[#4ade80] drop-shadow-[0_0_8px_#22c55e]">
              ${item.soles.toFixed(2)}
            </span>
            <span className="font-medium text-sm text-[#f87171] drop-shadow-[0_0_6px_#ef4444]">
              {item.credits.toFixed(0)} Cred
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1 font-medium">
            {new Date(item.createdAt).toLocaleDateString("es-ES", {
              day: "2-digit", month: "2-digit", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border shrink-0"
        style={{ backgroundColor: config.color + "15", borderColor: config.color + "50", color: config.color }}
      >
        {config.icon}
        <span className="text-xs font-bold uppercase tracking-wider">{config.label}</span>
      </div>
    </div>
  );
}
