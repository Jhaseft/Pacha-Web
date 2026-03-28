"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getAllClients, toggleClientStatus, type ClientData } from "../../../lib/adminClients";

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full
      ${active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-red-400"}`} />
      {active ? "Activo" : "Suspendido"}
    </span>
  );
}

function ClientRow({ client, onToggle, toggling }: {
  client: ClientData;
  onToggle: (c: ClientData) => void;
  toggling: boolean;
}) {
  const name = `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() || "Sin nombre";
  const initials = `${client.firstName?.[0] ?? ""}${client.lastName?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl px-4 py-3.5 flex items-center gap-4 hover:border-white/10 transition-colors group">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-[#1e1e1e] border border-white/5 flex items-center justify-center shrink-0">
        <span className="text-white/50 text-sm font-bold">{initials}</span>
      </div>

      {/* Name + contact */}
      <div className="min-w-0 flex-1">
        <p className="text-white font-semibold text-sm truncate">{name}</p>
        <p className="text-white/40 text-xs truncate">{client.email ?? client.phoneNumber}</p>
      </div>

      {/* Phone — visible on md+ */}
      <p className="text-white/30 text-xs hidden md:block shrink-0 w-32 truncate">
        {client.phoneNumber}
      </p>

      {/* Wallet */}
      <div className="shrink-0 text-right hidden lg:block w-24">
        {client.wallet != null ? (
          <>
            <p className="text-white font-semibold text-sm">${Number(client.wallet.balance).toFixed(2)}</p>
            <p className="text-white/30 text-xs">créditos</p>
          </>
        ) : (
          <p className="text-white/20 text-xs">—</p>
        )}
      </div>

      {/* Status */}
      <div className="shrink-0 hidden sm:block">
        <StatusBadge active={client.isActive} />
      </div>

      {/* Toggle */}
      <button
        onClick={() => onToggle(client)}
        disabled={toggling}
        title={client.isActive ? "Suspender" : "Activar"}
        className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40
          ${client.isActive
            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
            : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
          }`}
      >
        {toggling ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : client.isActive ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span className="hidden sm:inline">Suspender</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <span className="hidden sm:inline">Activar</span>
          </>
        )}
      </button>
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

export default function ClientesPage() {
  const { token } = useAuth();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [search, setSearch] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadClients = useCallback(async (text: string, cursor?: string) => {
    if (!token) return;
    const isFirst = !cursor;
    if (isFirst) setInitialLoading(true); else setLoadingMore(true);
    try {
      const res = await getAllClients(token, text || undefined, cursor);
      setClients((prev) => {
        if (isFirst) return res.data;
        const ids = new Set(prev.map((c) => c.id));
        return [...prev, ...res.data.filter((c) => !ids.has(c.id))];
      });
      setNextCursor(res.nextCursor);
    } catch (err) { console.error(err); }
    finally { setInitialLoading(false); setLoadingMore(false); }
  }, [token]);

  useEffect(() => { loadClients(""); }, [loadClients]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setClients([]); setNextCursor(null); loadClients(search); }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, loadClients]);

  async function handleToggle(client: ClientData) {
    const next = !client.isActive;
    setClients((prev) => prev.map((c) => c.id === client.id ? { ...c, isActive: next } : c));
    setTogglingId(client.id);
    try { await toggleClientStatus(token!, client.id, next); }
    catch { setClients((prev) => prev.map((c) => c.id === client.id ? { ...c, isActive: client.isActive } : c)); }
    finally { setTogglingId(null); }
  }

  const active = clients.filter((c) => c.isActive).length;
  const suspended = clients.filter((c) => !c.isActive).length;

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-white text-3xl font-black tracking-tight">Clientes</h1>
          <p className="text-white/40 text-sm mt-1">Gestiona el acceso de los clientes a la plataforma</p>
        </div>
      </div>

      {/* Stats pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        <StatPill label="Total cargados" value={clients.length} color="bg-white/30" />
        <StatPill label="Activos" value={active} color="bg-green-400" />
        <StatPill label="Suspendidos" value={suspended} color="bg-red-400" />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Column headers — desktop */}
      {!initialLoading && clients.length > 0 && (
        <div className="hidden md:grid grid-cols-[1fr_120px_100px_80px_auto] gap-4 px-4 mb-2">
          {["Cliente", "Teléfono", "Saldo", "Estado", ""].map((h) => (
            <p key={h} className="text-white/25 text-xs font-semibold uppercase tracking-wider">{h}</p>
          ))}
        </div>
      )}

      {/* List */}
      {initialLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl h-16 animate-pulse" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <p className="text-white/20 text-sm">{search ? "Sin resultados para tu búsqueda" : "No hay clientes"}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {clients.map((c) => (
              <ClientRow key={c.id} client={c} onToggle={handleToggle} toggling={togglingId === c.id} />
            ))}
          </div>

          {nextCursor && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => loadClients(search, nextCursor!)}
                disabled={loadingMore}
                className="flex items-center gap-2 bg-[#A11213] hover:bg-red-800 text-white font-bold px-8 py-3 rounded-full transition-colors disabled:opacity-50 text-sm"
              >
                {loadingMore
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Cargando...</>
                  : "Cargar más clientes"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
