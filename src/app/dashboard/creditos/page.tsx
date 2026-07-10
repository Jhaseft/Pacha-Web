"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { apiGetAllPackages } from "../../../lib/packages";
import { apiFlowCreatePayment, apiGetMyWallet } from "../../../lib/flow";
import type { PackageData } from "@/types/package";
import { getMyReferrals, type MyReferralsResponse } from "../../../lib/referrals";

function DiamondFilled({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 58,24 32,60 6,24" fill="#f03eb3" stroke="#a844f2" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="32,4 48,24 32,36 16,24" fill="#ffb8ea" strokeLinejoin="round" />
    </svg>
  );
}

function DiamondOutline({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 58,24 32,60 6,24" fill="#f7d9f0" stroke="#f03eb3" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="32,4 48,24 32,36 16,24" fill="none" stroke="#f03eb3" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function CreditosContent() {
  const { user, token, isHydrated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [pkgLoading, setPkgLoading] = useState(true);
  const [referrals, setReferrals] = useState<MyReferralsResponse | null>(null);
  const [referralsLoading, setReferralsLoading] = useState(true);
  const [referralsError, setReferralsError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copiar");

  const [paying, setPaying] = useState(false);
  const [payingPkgId, setPayingPkgId] = useState<string | null>(null);
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);

  const agreedPercent = (() => {
    if (!referrals?.referrals?.length) return 0;
    const active = referrals.referrals.filter((i) => i.status === "ACTIVE");
    const source = active.length > 0 ? active : referrals.referrals;
    return Number(source[0]?.percent ?? 0);
  })();

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

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

  useEffect(() => {
    if (!token || user?.role !== "ANFITRIONA") {
      setReferralsLoading(false);
      return;
    }
    setReferralsLoading(true);
    setReferralsError("");
    getMyReferrals(token)
      .then(setReferrals)
      .catch((err) =>
        setReferralsError(
          err instanceof Error ? err.message : "No se pudo cargar la información de referidos.",
        ),
      )
      .finally(() => setReferralsLoading(false));
  }, [token, user?.role]);

  useEffect(() => {
    apiGetAllPackages()
      .then((data) => setPackages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setPkgLoading(false));
  }, []);

  // Retorno desde Flow (?token=xxx)
  useEffect(() => {
    const flowToken = searchParams.get("token");
    if (!flowToken) return;
    window.history.replaceState({}, "", "/dashboard/creditos");
    setPaySuccess(true);
    setTimeout(() => loadBalance(), 2000);
  }, [searchParams, loadBalance]);

  const handleBuy = async (pkg: PackageData) => {
    if (!token) return;
    setPayError("");
    setPaySuccess(false);
    setPaying(true);
    setPayingPkgId(pkg.id!);
    try {
      const { paymentUrl } = await apiFlowCreatePayment(pkg.id!, token);
      window.location.href = paymentUrl;
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Error al iniciar el pago");
      setPaying(false);
      setPayingPkgId(null);
    }
  };

  async function handleCopyReferralCode() {
    if (!referrals?.referralCode) return;
    try {
      await navigator.clipboard.writeText(referrals.referralCode);
      setCopyLabel("Copiado");
    } catch {
      setCopyLabel("No disponible");
    }
    setTimeout(() => setCopyLabel("Copiar"), 1400);
  }

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-lg mx-auto px-5 flex flex-col min-h-screen">
        {/* Encabezado */}
        <header className="pt-10 pb-6">
          <h1 className="text-white font-black text-2xl">Créditos</h1>
          <p className="text-white/40 text-sm">Recarga y gestiona tu saldo</p>
        </header>

        {/* Saldo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 border-2 border-secondary rounded-full px-10 py-4 shadow-[0_0_30px_rgba(240,62,179,0.25)]">
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

        {/* Referidos (anfitriona) */}
        {user.role === "ANFITRIONA" && (
          <div className="bg-white/5 border border-surface-border rounded-3xl p-5 mb-8">
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">
              Código de referido
            </p>
            {referralsLoading ? (
              <div className="h-9 w-44 bg-white/10 rounded-xl animate-pulse" />
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-white text-2xl font-black tracking-wide">
                    {referrals?.referralCode || "—"}
                  </p>
                  <button
                    onClick={handleCopyReferralCode}
                    disabled={!referrals?.referralCode}
                    className="bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    {copyLabel}
                  </button>
                  <Link
                    href="/dashboard/referrals"
                    className="bg-secondary hover:bg-secondary/90 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    Ver creadores referidos
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                  <div className="bg-black/30 rounded-xl px-3 py-2">
                    <p className="text-white/30 text-[11px]">Porcentaje acordado</p>
                    <p className="text-white font-bold">{agreedPercent}%</p>
                  </div>
                  <div className="bg-black/30 rounded-xl px-3 py-2">
                    <p className="text-white/30 text-[11px]">Creadores referidos</p>
                    <p className="text-white font-bold">{referrals?.totalReferrals ?? 0}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl px-3 py-2">
                    <p className="text-white/30 text-[11px]">Ganancias por referidos</p>
                    <p className="text-green-400 font-bold">
                      S/ {Number(referrals?.totalRewardAmount ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                {referralsError && <p className="text-red-400/80 text-xs mt-3">{referralsError}</p>}
              </>
            )}
          </div>
        )}

        {/* Título sección */}
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-black italic">¡Compra Créditos!</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-0.5 w-10 bg-secondary" />
            <div className="h-1 w-2 bg-secondary rounded-full" />
            <div className="h-0.5 w-10 bg-secondary" />
          </div>
        </div>

        {/* Banners */}
        {paySuccess && (
          <div className="bg-green-900/30 border border-green-500/30 rounded-2xl px-4 py-3 mb-4">
            <p className="text-green-400 text-sm font-bold">¡Pago procesado!</p>
            <p className="text-green-400/70 text-xs mt-0.5">Tus créditos serán acreditados en breve.</p>
          </div>
        )}
        {payError && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-2xl px-4 py-3 mb-4">
            <p className="text-red-400 text-sm">{payError}</p>
          </div>
        )}

        {/* Paquetes */}
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
                    <div className="absolute -top-3 right-5">
                      <span className="bg-secondary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                        BONO +10
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <DiamondOutline className="w-10 h-10 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-secondary text-3xl font-black leading-none tracking-tight">
                            {pkg.credits.toLocaleString()}
                          </p>
                          <p className="text-secondary text-sm font-bold">créditos</p>
                          <p className="text-secondary/60 text-sm font-semibold">
                            Soles / {Number(pkg.price) % 1 === 0
                              ? Number(pkg.price).toFixed(0)
                              : Number(pkg.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuy(pkg)}
                        disabled={paying}
                        className="bg-secondary hover:bg-secondary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base px-7 py-3.5 rounded-2xl transition-all shrink-0 min-w-[110px] flex items-center justify-center shadow-md"
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
            Pagos procesados de forma segura por Flow
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CreditosPage() {
  return (
    <Suspense>
      <CreditosContent />
    </Suspense>
  );
}
