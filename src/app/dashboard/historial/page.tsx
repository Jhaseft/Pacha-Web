"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  WalletMinimal,
  MessageSquareText,
  ImageIcon,
  Phone,
  Coins,
  History,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { apiGetExpenseHistory, type ExpenseHistoryItem } from "../../../lib/userProfile";

const tipoConfig: Record<
  string,
  { Icon: typeof WalletMinimal; bg: string; color: string }
> = {
  DEPOSIT: { Icon: WalletMinimal, bg: "bg-emerald-500/10", color: "#10b981" },
  MESSAGE_UNLOCK: { Icon: MessageSquareText, bg: "bg-blue-500/10", color: "#3b82f6" },
  IMAGE_UNLOCK: { Icon: ImageIcon, bg: "bg-purple-500/10", color: "#a855f7" },
  CALL_PAYMENT: { Icon: Phone, bg: "bg-orange-500/10", color: "#f97316" },
  EARNING: { Icon: Coins, bg: "bg-yellow-500/10", color: "#eab308" },
};

function parseMonto(raw: number | string): number {
  if (typeof raw === "number") return raw;
  const n = parseFloat(String(raw ?? 0));
  return isNaN(n) ? 0 : n;
}

export default function HistorialPage() {
  const { user, isHydrated } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<ExpenseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  useEffect(() => {
    if (!user) return;
    apiGetExpenseHistory()
      .then((res) => {
        if (res.success) setHistory(res.data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-lg mx-auto px-4">
        <header className="pt-8 pb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-canvas-alt flex items-center justify-center text-ink"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-ink font-black text-2xl">Historial</h1>
        </header>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-[22px] bg-canvas-alt animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <History size={64} className="text-line" />
            <p className="text-ink-faint text-lg mt-4 px-10">
              Aún no tienes movimientos en tu cuenta.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-ink text-lg font-black tracking-wide mb-4">
              Historial de entradas y salidas
            </h2>
            <div className="flex flex-col gap-3 pb-10">
              {history.map((item) => {
                const isDeposit = item.tipo === "DEPOSIT";
                const monto = parseMonto(item.monto);
                const config = tipoConfig[item.tipo] ?? {
                  Icon: Coins,
                  bg: "bg-canvas-alt",
                  color: "#a1a1aa",
                };
                const { Icon } = config;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-5 rounded-[22px] bg-card border border-line shadow-sm"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                        <Icon size={24} color={config.color} />
                      </div>
                      <div className="ml-4 min-w-0">
                        <p className="text-ink font-semibold text-sm truncate">{item.detalle}</p>
                        <p className="text-ink-faint text-xs mt-1">
                          {new Date(item.fecha).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-3 shrink-0">
                      <p className={`font-black text-lg ${isDeposit ? "text-emerald-500" : "text-red-500"}`}>
                        {isDeposit ? "+" : "-"}
                        {monto.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-green-700 uppercase font-bold tracking-widest">
                        créditos
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
