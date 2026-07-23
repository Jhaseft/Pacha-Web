"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAdminStats, type AdminStats } from "../../lib/adminStats";

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, valueColor = "text-white", iconBg, icon,
}: {
  label: string; value: number | string; sub?: string;
  valueColor?: string; iconBg: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-black tracking-tight ${valueColor}`}>{value}</p>
      <p className="text-white/50 text-sm mt-1">{label}</p>
      {sub && <p className="text-white/25 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{children}</p>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/5 mb-4" />
      <div className="h-8 w-14 bg-white/5 rounded-lg mb-2" />
      <div className="h-3 w-20 bg-white/5 rounded" />
    </div>
  );
}

// ── Alert badge ───────────────────────────────────────────────────────────────
function AlertBadge({ count, label, sub }: { count: number; label: string; sub?: string }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        <div>
          <p className="text-yellow-300 text-sm font-bold">{label}</p>
          {sub && <p className="text-yellow-400/50 text-xs">{sub}</p>}
        </div>
      </div>
      <span className="bg-yellow-400 text-black text-xs font-black px-2.5 py-1 rounded-full">{count}</span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = (showRefresh = false) => {
    if (!token) return;
    if (showRefresh) setRefreshing(true);
    getAdminStats(token)
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { load(); }, [token]); // eslint-disable-line

  const hasPending = (stats?.deposits.pending ?? 0) + (stats?.withdrawals.pending ?? 0) > 0;

  return (
    <div className="p-8">

      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-white text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Resumen general de la plataforma</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Revenue hero ── */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#A11213] via-[#8B0000] to-[#5a0000] rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-black/10 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-red-200/80 text-sm font-semibold uppercase tracking-widest mb-2">Ingresos totales acumulados</p>
            {loading ? (
              <div className="h-14 w-44 bg-white/10 rounded-2xl animate-pulse" />
            ) : (
              <p className="text-green-300 text-6xl font-black tracking-tight">
                Soles {stats?.deposits.totalRevenue.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00"}
              </p>
            )}
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="self-start sm:self-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {/* ── Alerts ── */}
      {!loading && hasPending && (
        <div className="mb-8">
          <SectionLabel>Requieren atención</SectionLabel>
          <div className="flex flex-col gap-2">
            <AlertBadge count={stats?.deposits.pending ?? 0} label="Recargas pendientes de aprobación" sub="Clientes esperando acreditación" />
            <AlertBadge count={stats?.withdrawals.pending ?? 0} label="Retiros pendientes de creadores de contenido" sub="Solicitudes de pago pendientes" />
          </div>
        </div>
      )}

      {/* ── Clientes ── */}
      <div className="mb-8">
        <SectionLabel>Clientes</SectionLabel>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (<>
            <StatCard label="Total clientes" value={stats?.clients.total ?? 0}
              iconBg="bg-blue-500/10" valueColor="text-white"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>}
            />
            <StatCard label="Activos" value={stats?.clients.active ?? 0}
              iconBg="bg-green-500/10" valueColor="text-green-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
            />
            <StatCard label="Suspendidos" value={stats?.clients.suspended ?? 0}
              iconBg="bg-red-500/10" valueColor="text-red-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
            />
            <StatCard label="Nuevos este mes" value={stats?.clients.newThisMonth ?? 0}
              iconBg="bg-purple-500/10" valueColor="text-purple-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></svg>}
            />
          </>)}
        </div>
      </div>

      {/* ── Creadores de contenido ── */}
      <div className="mb-8">
        <SectionLabel>Creadores de contenido</SectionLabel>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
          {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />) : (<>
            <StatCard label="Total creadores de contenido" value={stats?.anfitrionas.total ?? 0}
              iconBg="bg-pink-500/10" valueColor="text-white"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
            />
            <StatCard label="Activas" value={stats?.anfitrionas.active ?? 0}
              iconBg="bg-green-500/10" valueColor="text-green-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
            />
            <StatCard label="Inactivas" value={stats?.anfitrionas.inactive ?? 0}
              iconBg="bg-red-500/10" valueColor="text-red-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
            />
          </>)}
        </div>
      </div>

      {/* ── Solicitudes + Actividad ── */}
      <div className="mb-8">
        <SectionLabel>Solicitudes y actividad</SectionLabel>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (<>
            <StatCard label="Recargas pendientes" value={stats?.deposits.pending ?? 0}
              sub="Esperan aprobación"
              iconBg="bg-yellow-500/10"
              valueColor={stats?.deposits.pending ? "text-yellow-400" : "text-white"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>}
            />
            <StatCard label="Aprobadas hoy" value={stats?.deposits.approvedToday ?? 0}
              iconBg="bg-green-500/10" valueColor="text-green-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
            />
            <StatCard label="Mensajes desbloqueados" value={stats?.activity.messageUnlocks ?? 0}
              sub="Total histórico" iconBg="bg-violet-500/10" valueColor="text-violet-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>}
            />
            <StatCard label="Imágenes desbloqueadas" value={stats?.activity.imageUnlocks ?? 0}
              sub="Total histórico" iconBg="bg-pink-500/10" valueColor="text-pink-400"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>}
            />
          </>)}
        </div>
      </div>
    </div>
  );
}
