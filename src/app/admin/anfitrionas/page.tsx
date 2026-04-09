"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getAllAnfitrionas, toggleAnfitrionaStatus, type AnfitrionaData } from "../../../lib/adminAnfitrionas";
import { getAnfitrionaStats, type AnfitrionaStats } from "../../../lib/adminStats";
import AnfitrionaDetailPanel from "./AnfitrionaDetailPanel";
import { Search, X, Ban, Check, Loader2, Wallet, UserX, Users } from "lucide-react";

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full
      ${active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-red-400"}`} />
      {active ? "Activa" : "Inactiva"}
    </span>
  );
}

function AnfitrionaRow({ anfitriona, onToggle, toggling, token, onClick }: {
  anfitriona: AnfitrionaData;
  onToggle: (a: AnfitrionaData) => void;
  toggling: boolean;
  token: string;
  onClick: () => void;
}) {
  const name = `${anfitriona.firstName ?? ""} ${anfitriona.lastName ?? ""}`.trim() || "Sin nombre";
  const initials = `${anfitriona.firstName?.[0] ?? ""}${anfitriona.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const avatarUrl = anfitriona.anfitrionaProfile?.avatarUrl;
  const isOnline = anfitriona.anfitrionaProfile?.isOnline;

  const [stats, setStats] = useState<AnfitrionaStats | null>(null);

  useEffect(() => {
    getAnfitrionaStats(token, anfitriona.id)
      .then(setStats)
      .catch(() => {});
  }, [anfitriona.id, token]);

  return (
    <div
      className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors cursor-pointer"
      onClick={onClick}
    >
      {/* Main row */}
      <div className="px-4 py-3.5 flex items-center gap-4">
        {/* Avatar + online dot */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/10 overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-pink-400 text-sm font-bold">{initials}</span>
            )}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#111] ${isOnline ? "bg-green-500" : "bg-zinc-600"}`} />
        </div>

        {/* Name + email */}
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-sm truncate">{name}</p>
          <p className="text-white/40 text-xs truncate">{anfitriona.email ?? "—"}</p>
        </div>

        {/* Phone */}
        <p className="text-white/30 text-xs hidden md:block shrink-0 w-32 truncate">
          {anfitriona.phoneNumber}
        </p>

        {/* Status */}
        <div className="shrink-0 hidden sm:block">
          <StatusBadge active={anfitriona.isActive} />
        </div>

        {/* Toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(anfitriona); }}
          disabled={toggling}
          title={anfitriona.isActive ? "Desactivar" : "Activar"}
          className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40
            ${anfitriona.isActive
              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
              : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
            }`}
        >
          {toggling ? <Loader2 size={14} className="animate-spin" /> : anfitriona.isActive ? <Ban size={14} /> : <Check size={14} />}
          <span className="hidden sm:inline">{anfitriona.isActive ? "Desactivar" : "Activar"}</span>
        </button>
      </div>

      {/* Wallet bar */}
      <div className="flex items-center gap-2 bg-white/[0.02] border-t border-white/5 px-4 py-2">
        <Wallet size={13} className="text-white/20 shrink-0" />
        <span className="text-white/25 text-[11px]">Saldo:</span>
        {stats === null ? (
          <Loader2 size={12} className="text-white/20 animate-spin" />
        ) : (
          <>
            <span className="text-white/80 text-xs font-bold">S/ {stats.balance.soles}</span>
            <span className="text-white/25 text-[11px]">({stats.balance.credits} créditos)</span>
          </>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <div>
        <p className="text-white/40 text-xs">{label}</p>
        <p className="text-white font-black text-lg leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function AnfitrionasPage() {
  const { token } = useAuth();
  const [anfitrionas, setAnfitrionas] = useState<AnfitrionaData[]>([]);
  const [search, setSearch] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedAnfitriona, setSelectedAnfitriona] = useState<AnfitrionaData | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadAnfitrionas = useCallback(async (text: string, cursor?: string) => {
    if (!token) return;
    const isFirst = !cursor;
    if (isFirst) setInitialLoading(true); else setLoadingMore(true);
    try {
      const res = await getAllAnfitrionas(token, text || undefined, cursor);
      setAnfitrionas((prev) => {
        if (isFirst) return res.data;
        const ids = new Set(prev.map((a) => a.id));
        return [...prev, ...res.data.filter((a) => !ids.has(a.id))];
      });
      setNextCursor(res.nextCursor ?? null);
    } catch (err) { console.error(err); }
    finally { setInitialLoading(false); setLoadingMore(false); }
  }, [token]);

  useEffect(() => { loadAnfitrionas(""); }, [loadAnfitrionas]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setAnfitrionas([]); setNextCursor(null); loadAnfitrionas(search); }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, loadAnfitrionas]);

  async function handleToggle(anfitriona: AnfitrionaData) {
    const next = !anfitriona.isActive;
    setAnfitrionas((prev) => prev.map((a) => a.id === anfitriona.id ? { ...a, isActive: next } : a));
    setTogglingId(anfitriona.id);
    try { await toggleAnfitrionaStatus(token!, anfitriona.id, next); }
    catch { setAnfitrionas((prev) => prev.map((a) => a.id === anfitriona.id ? { ...a, isActive: anfitriona.isActive } : a)); }
    finally { setTogglingId(null); }
  }

  const active = anfitrionas.filter((a) => a.isActive).length;
  const inactive = anfitrionas.filter((a) => !a.isActive).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-3xl font-black tracking-tight">Anfitrionas</h1>
        <p className="text-white/40 text-sm mt-1">Gestiona el acceso de las anfitrionas a la plataforma</p>
      </div>

      {/* Stats pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        <StatPill label="Total cargadas" value={anfitrionas.length} color="bg-pink-400" />
        <StatPill label="Activas" value={active} color="bg-green-400" />
        <StatPill label="Inactivas" value={inactive} color="bg-red-400" />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-white/8 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors text-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
            <X size={16} />
          </button>
        )}
      </div>


      {/* List */}
      {initialLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : anfitrionas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          {search ? <UserX size={48} className="text-white/10" /> : <Users size={48} className="text-white/10" />}
          <p className="text-white/20 text-sm">{search ? "Sin resultados para tu búsqueda" : "No hay anfitrionas"}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {anfitrionas.map((a) => (
              <AnfitrionaRow key={a.id} anfitriona={a} onToggle={handleToggle} toggling={togglingId === a.id} token={token!} onClick={() => setSelectedAnfitriona(a)} />
            ))}
          </div>

          {nextCursor && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => loadAnfitrionas(search, nextCursor!)}
                disabled={loadingMore}
                className="flex items-center gap-2 bg-[#A11213] hover:bg-red-800 text-white font-bold px-8 py-3 rounded-full transition-colors disabled:opacity-50 text-sm"
              >
                {loadingMore
                  ? <><Loader2 size={16} className="animate-spin" />Cargando...</>
                  : "Cargar más anfitrionas"}
              </button>
            </div>
          )}
        </>
      )}

      {selectedAnfitriona && (
        <AnfitrionaDetailPanel
          anfitriona={selectedAnfitriona}
          onClose={() => setSelectedAnfitriona(null)}
          onUpdated={(updated) => {
            setAnfitrionas((prev) => prev.map((a) => a.id === updated.id ? updated : a));
            setSelectedAnfitriona(updated);
          }}
        />
      )}
    </div>
  );
}
