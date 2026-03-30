"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiGetAllPackages } from "../../lib/packages";
import { apiCulqiChargeMe, apiGetMyWallet } from "../../lib/culqi";
import type { PackageData } from "@/types/package";

declare global {
  interface Window {
    Culqi: any;
    culqi: () => void;
  }
}

function DiamondFilled({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 58,24 32,60 6,24" fill="#5bc8f5" stroke="#3aafde" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="32,4 48,24 32,36 16,24" fill="#aae8ff" strokeLinejoin="round" />
    </svg>
  );
}

function DiamondOutline({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 58,24 32,60 6,24" fill="#fde8e8" stroke="#A11213" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="32,4 48,24 32,36 16,24" fill="none" stroke="#A11213" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const { user, token, isHydrated, logout } = useAuth();
  const router = useRouter();

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [pkgLoading, setPkgLoading] = useState(true);

  const [paying, setPaying] = useState(false);
  const [payingPkgId, setPayingPkgId] = useState<string | null>(null);
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState<{ credits: number; newBalance: number } | null>(null);

  // Refs to avoid stale closures and for cleanup
  const pendingPkgRef = useRef<PackageData | null>(null);
  const tokenRef = useRef<string | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const modalOpenRef = useRef(false);

  // Keep tokenRef in sync
  useEffect(() => { tokenRef.current = token; }, [token]);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  // ── Load Culqi.js once ─────────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("culqi-script")) return;
    const script = document.createElement("script");
    script.id = "culqi-script";
    script.src = "https://checkout.culqi.com/js/v4";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // ── Reset all payment state ─────────────────────────────────────────────────
  const resetPayState = useCallback(() => {
    setPaying(false);
    setPayingPkgId(null);
    pendingPkgRef.current = null;
    modalOpenRef.current = false;
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, []);

  // ── Watch for Culqi modal being closed via DOM removal ─────────────────────
  // Safety net: Culqi v4 sometimes doesn't call window.culqi() on X-close
  const startModalWatcher = useCallback(() => {
    observerRef.current?.disconnect();

    // Give Culqi 800ms to inject its modal into the DOM first
    const startTimer = setTimeout(() => {
      const observer = new MutationObserver(() => {
        if (!modalOpenRef.current) return;
        // Culqi v4 injects an iframe with src containing "culqi" or a div with culqi id
        const modalEl =
          document.querySelector('iframe[src*="culqi"]') ??
          document.getElementById("culqi-checkout") ??
          document.querySelector('[class*="culqi"]') ??
          document.querySelector('[id*="culqi"]');

        if (!modalEl) {
          // Modal was removed from DOM — user closed it
          observer.disconnect();
          // Give window.culqi() 400ms to fire first (it has priority if called)
          setTimeout(() => {
            if (modalOpenRef.current && pendingPkgRef.current) {
              resetPayState();
            }
          }, 400);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      observerRef.current = observer;
    }, 800);

    return () => clearTimeout(startTimer);
  }, [resetPayState]);

  // ── Culqi global callback ──────────────────────────────────────────────────
  useEffect(() => {
    window.culqi = async () => {
      const culqiToken: string | undefined = window.Culqi?.token?.id;
      const error = window.Culqi?.error;
      const pkg = pendingPkgRef.current;
      const authToken = tokenRef.current;

      // Always disconnect the observer — culqi() was called, observer no longer needed
      observerRef.current?.disconnect();
      observerRef.current = null;
      modalOpenRef.current = false;

      if (!culqiToken) {
        // User cancelled / closed modal / payment error
        if (error?.user_message) {
          setPayError(error.user_message);
        }
        resetPayState();
        return;
      }

      if (!pkg || !authToken) {
        resetPayState();
        return;
      }

      // Token received — process the charge
      try {
        const result = await apiCulqiChargeMe(
          { culqiToken, packageId: pkg.id! },
          authToken,
        );
        setBalance(Number(result.newBalance));
        setPaySuccess({ credits: result.credits, newBalance: Number(result.newBalance) });
        setPayError("");
      } catch (e: any) {
        setPayError(e.message ?? "Error al procesar el pago");
      } finally {
        resetPayState();
        window.Culqi?.close();
      }
    };
  }, [resetPayState]);

  // ── Cleanup observer on unmount ────────────────────────────────────────────
  useEffect(() => () => { observerRef.current?.disconnect(); }, []);

  // ── Load wallet balance ────────────────────────────────────────────────────
  const loadBalance = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiGetMyWallet(token);
      setBalance(Number(data.balance ?? 0));
    } catch {
      setBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  }, [token]);

  useEffect(() => { loadBalance(); }, [loadBalance]);

  // ── Load packages ──────────────────────────────────────────────────────────
  useEffect(() => {
    apiGetAllPackages()
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setPkgLoading(false));
  }, []);

  // ── Open Culqi modal ───────────────────────────────────────────────────────
  const handleBuy = (pkg: PackageData) => {
    if (!window.Culqi) {
      setPayError("El sistema de pagos no está listo. Recarga la página.");
      return;
    }
    setPayError("");
    setPaySuccess(null);
    pendingPkgRef.current = pkg;
    setPayingPkgId(pkg.id!);
    modalOpenRef.current = true;

    window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? "";
    window.Culqi.settings({
      title: "Pachamama",
      currency: "PEN",
      description: `${pkg.credits.toLocaleString()} créditos`,
      amount: Math.round(Number(pkg.price) * 100),
    });
    setPaying(true);
    window.Culqi.open();
    startModalWatcher();
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Centered content wrapper – max-width for desktop */}
      <div className="max-w-lg mx-auto px-5 flex flex-col min-h-screen">

        {/* ── Top bar ── */}
        <header className="flex items-center justify-between pt-10 pb-6">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">Hola,</p>
            <p className="text-white font-black text-xl leading-tight">
              {user.firstName ?? "Usuario"}
            </p>
          </div>
          <button
            onClick={() => { logout(); router.replace("/login"); }}
            className="flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors text-sm font-medium py-2 px-3 rounded-xl hover:bg-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span className="hidden sm:inline">Salir</span>
          </button>
        </header>

        {/* ── Balance pill ── */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 border-2 border-white rounded-full px-10 py-4 shadow-2xl">
            <DiamondFilled className="w-10 h-10" />
            {balanceLoading ? (
              <div className="w-20 h-11 bg-white/10 rounded-xl animate-pulse" />
            ) : (
              <span className="text-white text-5xl font-black tracking-tight tabular-nums">
                {(balance ?? 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* ── Section heading ── */}
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-black italic">¡Compra Créditos!</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-0.5 w-10 bg-[#A11213]" />
            <div className="h-1 w-2 bg-[#A11213] rounded-full" />
            <div className="h-0.5 w-10 bg-[#A11213]" />
          </div>
        </div>

        {/* ── Banners ── */}
        {paySuccess && (
          <div className="bg-green-900/30 border border-green-500/30 rounded-2xl px-4 py-3 mb-4 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <div>
              <p className="text-green-400 text-sm font-bold">
                ¡{paySuccess.credits.toLocaleString()} créditos acreditados!
              </p>
              <p className="text-green-400/70 text-xs mt-0.5">
                Nuevo saldo: {paySuccess.newBalance.toLocaleString()} créditos
              </p>
            </div>
            <button onClick={() => setPaySuccess(null)} className="ml-auto text-green-400/40 hover:text-green-400/80 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {payError && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-2xl px-4 py-3 mb-4 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <p className="text-red-400 text-sm">{payError}</p>
            <button onClick={() => setPayError("")} className="ml-auto text-red-400/40 hover:text-red-400/80 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Package cards ── */}
        <div className="flex-1 pb-10">
          {pkgLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-3xl h-[90px] animate-pulse" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/30 text-sm">No hay paquetes disponibles por el momento</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {packages.map((pkg) => {
                const isThisPaying = paying && payingPkgId === pkg.id;
                return (
                  <div key={pkg.id} className="relative bg-white rounded-3xl px-5 py-5 shadow-xl">
                    {/* Bono badge */}
                    <div className="absolute -top-3 right-5">
                      <span className="bg-[#A11213] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                        BONO +10
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Icon + credits */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <DiamondOutline className="w-10 h-10 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[#A11213] text-3xl font-black leading-none tracking-tight">
                            {pkg.credits.toLocaleString()}
                          </p>
                          <p className="text-[#A11213] text-sm font-bold">créditos</p>
                          <p className="text-[#A11213]/60 text-sm font-semibold">
                            Soles / {Number(pkg.price) % 1 === 0
                              ? Number(pkg.price).toFixed(0)
                              : Number(pkg.price).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Buy button */}
                      <button
                        onClick={() => handleBuy(pkg)}
                        disabled={paying}
                        className="bg-[#A11213] hover:bg-[#8a0f10] active:scale-95 disabled:opacity-50
                          disabled:cursor-not-allowed text-white font-black text-base px-7 py-3.5
                          rounded-2xl transition-all shrink-0 min-w-[110px] flex items-center justify-center shadow-md"
                      >
                        {isThisPaying ? (
                          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          "Comprar"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-white/15 text-xs text-center mt-8">
            Pagos procesados de forma segura por Culqi
          </p>
        </div>

        {/* ── Descargar App ── */}
        <div className="pb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0.5 w-10 bg-white/10" />
            <p className="text-white/20 text-xs uppercase tracking-widest font-semibold">App Móvil</p>
            <div className="h-0.5 w-10 bg-white/10" />
          </div>

          <a
            href="https://github.com/Jhaseft/Pachamama_Frontend/releases/download/apk/application-a1a328cb-2cf5-45ba-8332-c5fe8190b862.1.apk"
            download
            className="flex items-center gap-4 bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 rounded-3xl px-5 py-4 transition-all"
          >
            {/* Android icon */}
            <div className="w-12 h-12 bg-[#A11213]/20 rounded-2xl flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="#A11213">
                <path d="M17.523 15.341a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-11.046 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM2.1 8.4h19.8A1.1 1.1 0 0 1 23 9.5v6a1.1 1.1 0 0 1-1.1 1.1H21v2.65a.75.75 0 0 1-1.5 0V16.6H4.5v2.65a.75.75 0 0 1-1.5 0V16.6h-.9A1.1 1.1 0 0 1 1 15.5v-6A1.1 1.1 0 0 1 2.1 8.4Zm.9 1.5v5h18v-5H3ZM8.22 2.47a.75.75 0 0 1 1.02-.28L12 3.8l2.76-1.61a.75.75 0 1 1 .75 1.3L13.5 4.8V7.4h-3V4.8L8.5 3.49a.75.75 0 0 1-.28-1.02Z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Descargar App Pachamama</p>
              <p className="text-white/40 text-xs mt-0.5">Versión Android (.apk)</p>
            </div>

            {/* Arrow */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}
