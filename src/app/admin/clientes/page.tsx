"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  getAllClients,
  toggleClientStatus,
  type ClientData,
} from "../../../lib/adminClients";

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#ccc]" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  );
}

function ClientRow({
  client,
  onToggle,
  toggling,
}: {
  client: ClientData;
  onToggle: (client: ClientData) => void;
  toggling: boolean;
}) {
  const name = `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() || "Sin nombre";
  const isActive = client.isActive;

  return (
    <div className="bg-[#460202] border border-red-900/20 rounded-[22px] p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Avatar */}
        <div className="bg-gray-800 rounded-full p-2 shrink-0">
          <UserIcon />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-5 truncate">{name}</p>
          <p className="text-gray-400 text-xs truncate">
            {client.email ?? client.phoneNumber}
          </p>
          <span className={`text-xs font-bold uppercase ${isActive ? "text-green-500" : "text-red-500"}`}>
            {isActive ? "activo" : "suspendido"}
          </span>
        </div>
      </div>

      {/* Wallet */}
      {client.wallet != null && (
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-gray-500 text-xs">Saldo</p>
          <p className="text-white font-bold text-sm">
            ${Number(client.wallet.balance).toFixed(2)}
          </p>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => onToggle(client)}
        disabled={toggling}
        className={`shrink-0 rounded-full p-2 transition-colors disabled:opacity-50
          ${isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
        title={isActive ? "Suspender cliente" : "Activar cliente"}
      >
        {isActive ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        )}
      </button>
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

  const loadClients = useCallback(
    async (text: string, cursor?: string) => {
      if (!token) return;
      const isFirst = !cursor;
      if (isFirst) setInitialLoading(true);
      else setLoadingMore(true);

      try {
        const res = await getAllClients(token, text || undefined, cursor);
        setClients((prev) => {
          if (isFirst) return res.data;
          const ids = new Set(prev.map((c) => c.id));
          return [...prev, ...res.data.filter((c) => !ids.has(c.id))];
        });
        setNextCursor(res.nextCursor);
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    },
    [token],
  );

  // Initial load
  useEffect(() => {
    loadClients("");
  }, [loadClients]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setClients([]);
      setNextCursor(null);
      loadClients(search);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, loadClients]);

  async function handleToggle(client: ClientData) {
    const newStatus = !client.isActive;
    setClients((prev) =>
      prev.map((c) => (c.id === client.id ? { ...c, isActive: newStatus } : c)),
    );
    setTogglingId(client.id);
    try {
      await toggleClientStatus(token!, client.id, newStatus);
    } catch {
      // revert
      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, isActive: client.isActive } : c)),
      );
    } finally {
      setTogglingId(null);
    }
  }

  const activeCount = clients.filter((c) => c.isActive).length;
  const suspendedCount = clients.filter((c) => !c.isActive).length;

  return (
    <div className="p-6 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-white text-2xl font-black tracking-tight">Clientes</h1>
        <p className="text-white/50 text-sm mt-0.5">Gestiona el estado de las cuentas de clientes</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-6">
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl px-4 py-3">
          <p className="text-white/50 text-xs">Total cargados</p>
          <p className="text-white text-xl font-black">{clients.length}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl px-4 py-3">
          <p className="text-white/50 text-xs">Activos</p>
          <p className="text-green-500 text-xl font-black">{activeCount}</p>
        </div>
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl px-4 py-3">
          <p className="text-white/50 text-xs">Suspendidos</p>
          <p className="text-red-500 text-xl font-black">{suspendedCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#555] outline-none focus:border-white/30 transition-colors text-sm"
        />
      </div>

      {/* List */}
      {initialLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#A11213] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-sm">
          {search ? "No se encontraron resultados" : "No hay clientes"}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {clients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                onToggle={handleToggle}
                toggling={togglingId === client.id}
              />
            ))}
          </div>

          {/* Load more */}
          {nextCursor && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => loadClients(search, nextCursor)}
                disabled={loadingMore}
                className="bg-[#A11213] text-white font-bold px-8 py-3 rounded-full hover:bg-red-800 transition-colors disabled:opacity-50 text-sm"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Cargando...
                  </span>
                ) : (
                  "Cargar más"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
