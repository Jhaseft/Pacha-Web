"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import {
  getMyReferrals,
  type CreatorReferralStatus,
  type MyReferralsResponse,
} from "../../../lib/referrals";

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-PE");
}

function formatMoney(value: number) {
  return value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercent(value: number) {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
}

function statusLabel(status?: CreatorReferralStatus) {
  if (status === "PENDING") return "Pendiente de activación";
  if (status === "ACTIVE") return "Activo";
  if (status === "DISABLED") return "Desactivado";
  return "Sin estado";
}

function statusClassName(status?: CreatorReferralStatus) {
  if (status === "PENDING") return "text-amber-400 font-semibold";
  if (status === "ACTIVE") return "text-green-400 font-semibold";
  if (status === "DISABLED") return "text-red-400 font-semibold";
  return "text-white/60";
}

export default function DashboardReferralsPage() {
  const { user, token, isHydrated } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<MyReferralsResponse | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copiar");

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "ANFITRIONA") {
      router.replace("/dashboard");
      return;
    }
    if (!token) return;

    setLoading(true);
    setError("");
    getMyReferrals(token)
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "No se pudo cargar la informacion de referidos."),
      )
      .finally(() => setLoading(false));
  }, [isHydrated, user, token, router]);

  async function handleCopy() {
    if (!data?.referralCode) return;
    try {
      await navigator.clipboard.writeText(data.referralCode);
      setCopyLabel("Copiado");
      setTimeout(() => setCopyLabel("Copiar"), 1300);
    } catch {
      setCopyLabel("No disponible");
      setTimeout(() => setCopyLabel("Copiar"), 1300);
    }
  }

  if (!isHydrated || !user || user.role !== "ANFITRIONA") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-5 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-white text-3xl font-black tracking-tight">Creadores referidos</h1>
            <p className="text-white/40 text-sm mt-1">
              Revisa tus contratos de referido y las comisiones generadas por cada creadora de contenido.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Volver
          </Link>
        </div>

        {loading ? (
          <div className="bg-[#111] border border-white/5 rounded-2xl h-36 animate-pulse" />
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <div className="md:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-widest">Codigo de referido</p>
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-white text-2xl font-black tracking-wide">{data?.referralCode || "-"}</p>
                  <button
                    onClick={handleCopy}
                    disabled={!data?.referralCode}
                    className="bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    {copyLabel}
                  </button>
                </div>
              </div>
              <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-widest">Creadores referidos</p>
                <p className="text-white text-2xl font-black mt-2">{data?.totalReferrals ?? 0}</p>
              </div>
              <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-widest">Ganancias por referidos</p>
                <p className="text-green-400 text-2xl font-black mt-2">Bs {formatMoney(Number(data?.totalRewardAmount ?? 0))}</p>
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-white font-semibold">Detalle por contrato</p>
              </div>
              {data?.referrals?.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-white/40 text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 text-left">Creador referido</th>
                        <th className="px-4 py-3 text-left">Porcentaje acordado</th>
                        <th className="px-4 py-3 text-left">Estado</th>
                        <th className="px-4 py-3 text-left">Total generado</th>
                        <th className="px-4 py-3 text-left">Comision generada</th>
                        <th className="px-4 py-3 text-left">Eventos</th>
                        <th className="px-4 py-3 text-left">Vinculado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.referrals.map((row, index) => {
                        const key = row.referralId || row.referredCreatorId || row.referredUserId || String(index);
                        return (
                          <tr key={key} className="border-t border-white/5">
                            <td className="px-4 py-3 text-white">
                              <p>{row.name || "Sin nombre"}</p>
                              <p className="text-xs text-white/50">{row.email || row.referredCreatorId || "Sin email"}</p>
                            </td>
                            <td className="px-4 py-3 text-white/80">{formatPercent(row.percent)}%</td>
                            <td className={`px-4 py-3 ${statusClassName(row.status)}`}>
                              {statusLabel(row.status)}
                            </td>
                            <td className="px-4 py-3 text-white/80">Bs {formatMoney(row.totalGenerated)}</td>
                            <td className="px-4 py-3">
                              {row.status === "PENDING" ? (
                                <span className="text-amber-300 font-semibold">
                                  Pendiente de activación
                                </span>
                              ) : (
                                <span className="text-green-400 font-semibold">
                                  Bs {formatMoney(row.totalRewardAmount)}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-white/80">{row.rewardEventsCount}</td>
                            <td className="px-4 py-3 text-white/70">{formatDate(row.qualifiedAt || row.createdAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-4 py-10 text-center text-white/30 text-sm">
                  Todavia no tienes creadores referidos vinculados.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
