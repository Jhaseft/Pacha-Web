"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiGetAllPackages } from "../../../lib/packages";
import { getAllClients, type ClientData } from "../../../lib/adminClients";
import { apiCulqiCharge } from "../../../lib/culqi";
import type { PackageData } from "@/types/package";

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

// ── Gem icon matching the mobile app ─────────────────────────────────────────
function GemIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.5 2h11l3.5 5-9 15L2 7l4.5-5zM3.5 7h17M9 2l-2.5 5M15 2l2.5 5M12 2l-3 5M12 2l3 5" />
      <polygon points="2,7 6.5,2 17.5,2 22,7 12,22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PackageCard({
  pkg,
  selected,
  onSelect,
}: {
  pkg: PackageData;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-150
        ${selected
          ? "border-[#A11213] bg-[#A11213]/10 shadow-lg shadow-[#A11213]/10"
          : "border-white/8 bg-[#111] hover:border-white/20 hover:bg-[#161616]"
        }`}
    >
      {/* Bono badge */}
      <div className="absolute -top-3 right-4">
        <span className="bg-[#A11213] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
          BONO +10
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`shrink-0 ${selected ? "text-[#A11213]" : "text-[#e07070]"}`}>
            <GemIcon className="w-8 h-8" />
          </div>
          <div>
            <p className={`text-2xl font-black ${selected ? "text-[#A11213]" : "text-white"}`}>
              {pkg.credits.toLocaleString()}
            </p>
            <p className="text-white/50 text-xs font-medium">créditos</p>
            <p className="text-white/40 text-xs mt-0.5">
              S/ {Number(pkg.price).toFixed(2)}
            </p>
          </div>
        </div>

        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors
          ${selected ? "border-[#A11213] bg-[#A11213]" : "border-white/20"}`}>
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

function ClientSearchResult({
  client,
  onSelect,
}: {
  client: ClientData;
  onSelect: () => void;
}) {
  const name = `${client.firstName ?? ""} ${client.lastName ?? ""}`.trim() || "Sin nombre";
  const initials = `${client.firstName?.[0] ?? ""}${client.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
    >
      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
        <span className="text-white/60 text-sm font-bold">{initials}</span>
      </div>
      <div className="min-w-0">
        <p className="text-white text-sm font-semibold truncate">{name}</p>
        <p className="text-white/40 text-xs truncate">{client.email ?? client.phoneNumber}</p>
      </div>
      <div className="shrink-0 ml-auto text-right">
        <p className="text-white/60 text-xs font-semibold">
          {client.wallet != null ? `${Number(client.wallet.balance).toFixed(0)} cr.` : "—"}
        </p>
      </div>
    </button>
  );
}

export default function RecargasPage() {
  const { token } = useAuth();

  // Packages state
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [pkgLoading, setPkgLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<PackageData | null>(null);

  // Client search state
  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<ClientData[]>([]);
  const [clientLoading, setClientLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Payment state
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState<{ credits: number; newBalance: string } | null>(null);
  const [error, setError] = useState("");

  // Culqi pending info (used inside window.culqi callback)
  const pendingRef = useRef<{ packageId: string; clientId: string } | null>(null);

  // ── Load Culqi.js ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("culqi-script")) return;
    const script = document.createElement("script");
    script.id = "culqi-script";
    script.src = "https://checkout.culqi.com/js/v4";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      const s = document.getElementById("culqi-script");
      if (s) document.head.removeChild(s);
    };
  }, []);

  // ── Register window.culqi callback ─────────────────────────────────────────
  useEffect(() => {
    window.culqi = async () => {
      const tokenId: string | undefined = window.Culqi?.token?.id;
      const pending = pendingRef.current;

      if (!tokenId || !pending || !token) {
        const err = window.Culqi?.error;
        if (err) setError(err.user_message ?? "Error en el pago");
        setPaying(false);
        return;
      }

      try {
        const result = await apiCulqiCharge(
          { culqiToken: tokenId, packageId: pending.packageId, clientId: pending.clientId },
          token,
        );
        setSuccess({ credits: result.credits, newBalance: result.newBalance });
        setError("");
      } catch (e: any) {
        setError(e.message ?? "Error al procesar el pago");
      } finally {
        setPaying(false);
        pendingRef.current = null;
        window.Culqi?.close();
      }
    };
  }, [token]);

  // ── Load packages ──────────────────────────────────────────────────────────
  useEffect(() => {
    apiGetAllPackages()
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => setError("No se pudieron cargar los paquetes"))
      .finally(() => setPkgLoading(false));
  }, []);

  // ── Client search ──────────────────────────────────────────────────────────
  const searchClients = useCallback(
    async (q: string) => {
      if (!token || q.trim().length < 2) { setClients([]); return; }
      setClientLoading(true);
      try {
        const result = await getAllClients(token, q);
        setClients(result.data);
        setShowDropdown(true);
      } catch { setClients([]); }
      finally { setClientLoading(false); }
    },
    [token],
  );

  useEffect(() => {
    const timer = setTimeout(() => searchClients(clientSearch), 350);
    return () => clearTimeout(timer);
  }, [clientSearch, searchClients]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Open Culqi modal ───────────────────────────────────────────────────────
  const handlePay = () => {
    setError("");
    setSuccess(null);

    if (!selectedClient) { setError("Selecciona un cliente primero"); return; }
    if (!selectedPkg) { setError("Selecciona un paquete primero"); return; }
    if (!window.Culqi) { setError("Culqi no está disponible. Recarga la página."); return; }

    const amountInCents = Math.round(Number(selectedPkg.price) * 100);
    pendingRef.current = { packageId: selectedPkg.id!, clientId: selectedClient.id };

    window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? "";
    window.Culqi.settings({
      title: "MonetizaLab",
      currency: "PEN",
      description: `${selectedPkg.credits.toLocaleString()} créditos`,
      amount: amountInCents,
    });

    setPaying(true);
    window.Culqi.open();
  };

  const clientName = selectedClient
    ? `${selectedClient.firstName ?? ""} ${selectedClient.lastName ?? ""}`.trim() || "Sin nombre"
    : null;

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-3xl font-black tracking-tight">Recargar Créditos</h1>
        <p className="text-white/40 text-sm mt-1">
          Selecciona un cliente y un paquete, luego paga con tarjeta vía Culqi
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-900/20 border border-green-500/20 text-green-400 rounded-xl px-4 py-4 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span className="font-bold">Recarga exitosa</span>
          </div>
          <p className="text-green-400/80 text-sm">
            Se acreditaron <strong>{success.credits.toLocaleString()} créditos</strong>.
            Nuevo saldo: <strong>{Number(success.newBalance).toFixed(0)} créditos</strong>.
          </p>
        </div>
      )}

      {/* Step 1 – Client selector */}
      <div className="mb-6">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
          1. Selecciona el cliente
        </p>
        <div ref={searchRef} className="relative">
          {selectedClient ? (
            <div className="bg-[#111] border border-[#A11213]/50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#A11213]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#A11213] text-sm font-black">
                    {`${selectedClient.firstName?.[0] ?? ""}${selectedClient.lastName?.[0] ?? ""}`.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{clientName}</p>
                  <p className="text-white/40 text-xs truncate">
                    {selectedClient.email ?? selectedClient.phoneNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedClient(null); setClientSearch(""); }}
                className="text-white/30 hover:text-white/60 transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cliente por nombre, email o teléfono..."
                value={clientSearch}
                onChange={(e) => { setClientSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => { if (clients.length > 0) setShowDropdown(true); }}
                className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25
                  focus:outline-none focus:border-white/20 transition-colors pr-10"
              />
              {clientLoading ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border border-white/30 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              )}

              {showDropdown && clients.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden shadow-2xl">
                  {clients.map((c) => (
                    <ClientSearchResult
                      key={c.id}
                      client={c}
                      onSelect={() => {
                        setSelectedClient(c);
                        setShowDropdown(false);
                        setClientSearch("");
                      }}
                    />
                  ))}
                </div>
              )}

              {showDropdown && clientSearch.length >= 2 && !clientLoading && clients.length === 0 && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 shadow-2xl">
                  <p className="text-white/30 text-sm">Sin resultados</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Step 2 – Package selection */}
      <div className="mb-8">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">
          2. Selecciona el paquete
        </p>

        {pkgLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-[#111] border border-white/5 rounded-2xl px-4 py-6 text-center">
            <p className="text-white/30 text-sm">No hay paquetes activos</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                selected={selectedPkg?.id === pkg.id}
                onSelect={() => { setSelectedPkg(pkg); setSuccess(null); setError(""); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Step 3 – Pay button */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
          3. Pagar con tarjeta
        </p>

        {/* Summary */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white/40 text-xs">Cliente</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {selectedClient ? clientName : <span className="text-white/25 italic">No seleccionado</span>}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs">Paquete</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              {selectedPkg
                ? `${selectedPkg.credits.toLocaleString()} cr. — S/ ${Number(selectedPkg.price).toFixed(2)}`
                : <span className="text-white/25 italic">No seleccionado</span>}
            </p>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={paying || !selectedClient || !selectedPkg}
          className="w-full flex items-center justify-center gap-2 bg-[#A11213] hover:bg-[#8a0f10]
            disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm
            px-6 py-3.5 rounded-xl transition-colors"
        >
          {paying ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Procesando pago...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              {selectedPkg
                ? `Pagar S/ ${Number(selectedPkg.price).toFixed(2)} con tarjeta`
                : "Pagar con tarjeta"}
            </>
          )}
        </button>

        <p className="text-white/20 text-xs text-center mt-3">
          Pagos procesados de forma segura por Culqi
        </p>
      </div>
    </div>
  );
}
