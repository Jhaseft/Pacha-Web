"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { apiGetAllPackages } from "../../../lib/packages";
import { apiFlowCreatePayment, apiGetMyWallet } from "../../../lib/flow";
import { apiPaypalCreateOrder } from "../../../lib/paypal";
import {
  apiBinanceCreateIntent,
  apiBinanceGetIntent,
  apiBinanceConfirm,
  type BinanceIntent,
} from "../../../lib/binance";
import { useCurrency } from "../../../hooks/useCurrency";
import type { PackageData } from "@/types/package";
import { getMyReferrals, type MyReferralsResponse } from "../../../lib/referrals";

type PaymentMethod = "flow" | "paypal" | "binance";

function DiamondFilled({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 58,24 32,60 6,24" fill="#6d5efc" stroke="#a855f7" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="32,4 48,24 32,36 16,24" fill="#c4b5fd" strokeLinejoin="round" />
    </svg>
  );
}

function DiamondOutline({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 58,24 32,60 6,24" fill="#efeaff" stroke="#6d5efc" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="32,4 48,24 32,36 16,24" fill="none" stroke="#6d5efc" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function formatRemaining(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

function CreditosContent() {
  const { user, token, isHydrated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { symbol, rate, isPeru } = useCurrency();

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

  // Selector de método de pago
  const [methodPickerVisible, setMethodPickerVisible] = useState(false);
  const [pendingPkg, setPendingPkg] = useState<PackageData | null>(null);

  // Binance
  const [binanceIntent, setBinanceIntent] = useState<BinanceIntent | null>(null);
  const [binanceVisible, setBinanceVisible] = useState(false);
  const [txidInput, setTxidInput] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [copiedField, setCopiedField] = useState<"address" | "amount" | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const intentPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Retorno desde Flow (?token=xxx) o PayPal (?paypal=success)
  useEffect(() => {
    const flowToken = searchParams.get("token");
    const paypal = searchParams.get("paypal");
    if (!flowToken && !paypal) return;
    window.history.replaceState({}, "", "/dashboard/creditos");
    if (paypal === "cancel") {
      setPayError("Pago con PayPal cancelado.");
      return;
    }
    setPaySuccess(true);
    setTimeout(() => loadBalance(), 2000);
  }, [searchParams, loadBalance]);

  // Countdown + polling del intent de Binance
  useEffect(() => {
    if (!binanceVisible || !binanceIntent || !token) {
      setRemaining(0);
      if (intentPollRef.current) {
        clearInterval(intentPollRef.current);
        intentPollRef.current = null;
      }
      return;
    }

    const tick = () => {
      const ms = new Date(binanceIntent.expiresAt).getTime() - Date.now();
      setRemaining(Math.max(0, Math.floor(ms / 1000)));
    };
    tick();
    const interval = setInterval(tick, 1000);

    const poll = setInterval(async () => {
      try {
        const fresh = await apiBinanceGetIntent(binanceIntent.intentId, token);
        if (fresh.status === "CONFIRMED") {
          setBinanceVisible(false);
          setBinanceIntent(null);
          setPaySuccess(true);
          await loadBalance();
        } else if (fresh.status === "EXPIRED") {
          setBinanceIntent(fresh);
        }
      } catch {
        // silencioso, reintenta
      }
    }, 15000);
    intentPollRef.current = poll;

    return () => {
      clearInterval(interval);
      clearInterval(poll);
      intentPollRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binanceVisible, binanceIntent?.intentId, binanceIntent?.expiresAt, token]);

  const handleBuy = (pkg: PackageData) => {
    setPayError("");
    setPaySuccess(false);
    setPendingPkg(pkg);
    setMethodPickerVisible(true);
  };

  const handlePickMethod = async (method: PaymentMethod) => {
    if (!pendingPkg?.id || !token) return;
    const pkg = pendingPkg;
    setMethodPickerVisible(false);
    setPaying(true);
    setPayingPkgId(pkg.id!);
    try {
      if (method === "flow") {
        const { paymentUrl } = await apiFlowCreatePayment(pkg.id!, token);
        window.location.href = paymentUrl;
      } else if (method === "paypal") {
        const { approveUrl, orderId } = await apiPaypalCreateOrder(pkg.id!, token);
        sessionStorage.setItem("pacha.paypalOrderId", orderId);
        window.location.href = approveUrl;
      } else {
        const intent = await apiBinanceCreateIntent(pkg.id!, token);
        setBinanceIntent(intent);
        setSelectedNetwork(intent.defaultNetwork ?? intent.networks[0]?.network ?? null);
        setTxidInput("");
        setBinanceVisible(true);
        setPaying(false);
        setPayingPkgId(null);
      }
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "No se pudo iniciar el pago");
      setPaying(false);
      setPayingPkgId(null);
    } finally {
      setPendingPkg(null);
    }
  };

  const handleCopy = async (value: string, field: "address" | "amount") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField((f) => (f === field ? null : f)), 1600);
    } catch {}
  };

  const handleConfirmTxid = async () => {
    if (!binanceIntent || !token) return;
    const trimmed = txidInput.trim();
    if (trimmed.length < 10) {
      setPayError("Pega el TXID completo de tu transacción.");
      return;
    }
    setConfirming(true);
    try {
      await apiBinanceConfirm(binanceIntent.intentId, trimmed, token);
      setBinanceVisible(false);
      setBinanceIntent(null);
      setPaySuccess(true);
      await loadBalance();
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "No se pudo confirmar el pago");
    } finally {
      setConfirming(false);
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
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentNetwork =
    binanceIntent?.networks.find((n) => n.network === selectedNetwork) ??
    binanceIntent?.networks[0] ??
    null;
  const binanceExpired = !binanceIntent || binanceIntent.status === "EXPIRED" || remaining <= 0;

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-lg mx-auto px-5 flex flex-col min-h-screen">
        {/* Encabezado */}
        <header className="pt-10 pb-6">
          <h1 className="text-ink font-black text-2xl">Créditos</h1>
          <p className="text-ink-faint text-sm">Recarga y gestiona tu saldo</p>
        </header>

        {/* Saldo */}
        <div className="flex justify-center mb-3">
          <div className="flex items-center gap-4 bg-card border-2 border-brand rounded-full px-10 py-4 shadow-[0_0_30px_rgba(109,94,252,0.2)]">
            <DiamondFilled className="w-10 h-10" />
            {balanceLoading ? (
              <div className="w-20 h-11 bg-canvas-alt rounded-xl animate-pulse" />
            ) : (
              <span className="text-ink text-5xl font-black tracking-tight tabular-nums">
                {(balance ?? 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Tasa de conversión */}
        <p className="text-brand/60 text-xs font-semibold text-center mb-8 tracking-widest">
          1 crédito = {symbol} {rate}
        </p>

        {/* Referidos (anfitriona) */}
        {user.role === "ANFITRIONA" && (
          <div className="bg-card border border-line rounded-3xl p-5 mb-8">
            <p className="text-ink-faint text-xs uppercase tracking-widest font-semibold mb-2">
              Código de referido
            </p>
            {referralsLoading ? (
              <div className="h-9 w-44 bg-canvas-alt rounded-xl animate-pulse" />
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-ink text-2xl font-black tracking-wide">
                    {referrals?.referralCode || "—"}
                  </p>
                  <button
                    onClick={handleCopyReferralCode}
                    disabled={!referrals?.referralCode}
                    className="bg-canvas-alt hover:bg-brand-soft disabled:opacity-50 text-ink text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    {copyLabel}
                  </button>
                  <Link
                    href="/dashboard/referrals"
                    className="bg-linear-to-r from-brand to-brand-violet text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    Ver creadores referidos
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                  <div className="bg-canvas-alt rounded-xl px-3 py-2">
                    <p className="text-ink-faint text-[11px]">Porcentaje acordado</p>
                    <p className="text-ink font-bold">{agreedPercent}%</p>
                  </div>
                  <div className="bg-canvas-alt rounded-xl px-3 py-2">
                    <p className="text-ink-faint text-[11px]">Creadores referidos</p>
                    <p className="text-ink font-bold">{referrals?.totalReferrals ?? 0}</p>
                  </div>
                  <div className="bg-canvas-alt rounded-xl px-3 py-2">
                    <p className="text-ink-faint text-[11px]">Ganancias por referidos</p>
                    <p className="text-green-600 font-bold">
                      S/ {Number(referrals?.totalRewardAmount ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                {referralsError && <p className="text-red-500 text-xs mt-3">{referralsError}</p>}
              </>
            )}
          </div>
        )}

        {/* Título sección */}
        <div className="text-center mb-6">
          <h2 className="text-ink text-2xl font-black italic">¡Compra Créditos!</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-0.5 w-10 bg-brand" />
            <div className="h-1 w-2 bg-brand rounded-full" />
            <div className="h-0.5 w-10 bg-brand" />
          </div>
        </div>

        {/* Banners */}
        {paySuccess && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-4">
            <p className="text-green-700 text-sm font-bold">¡Pago procesado!</p>
            <p className="text-green-600 text-xs mt-0.5">Tus créditos serán acreditados en breve.</p>
          </div>
        )}
        {payError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
            <p className="text-red-600 text-sm">{payError}</p>
          </div>
        )}

        {/* Paquetes */}
        <div className="flex-1 pb-10">
          {pkgLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-canvas-alt rounded-3xl h-[90px] animate-pulse" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink-faint text-sm">No hay paquetes disponibles por el momento</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {packages.map((pkg) => {
                const isThisPaying = paying && payingPkgId === pkg.id;
                return (
                  <div key={pkg.id} className="relative bg-card border border-line rounded-3xl px-5 py-5 shadow-xl">
                    <div className="absolute -top-3 right-5">
                      <span className="bg-brand text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                        BONO +10
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <DiamondOutline className="w-10 h-10 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-brand text-3xl font-black leading-none tracking-tight">
                            {pkg.credits.toLocaleString()}
                          </p>
                          <p className="text-brand text-sm font-bold">créditos</p>
                          <p className="text-ink-soft text-sm font-semibold">
                            {symbol} {(pkg.credits * rate).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuy(pkg)}
                        disabled={paying}
                        className="bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base px-7 py-3.5 rounded-2xl transition-all shrink-0 min-w-28 flex items-center justify-center shadow-md shadow-brand/30"
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
          <p className="text-ink-faint text-xs text-center mt-8">
            Pagos procesados de forma segura
          </p>
        </div>
      </div>

      {/* Modal selector de método de pago */}
      {methodPickerVisible && (
        <div
          onClick={() => { setMethodPickerVisible(false); setPendingPkg(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-card border border-line rounded-3xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-ink text-lg font-black">Elige cómo pagar</h3>
              <button
                onClick={() => { setMethodPickerVisible(false); setPendingPkg(null); }}
                className="w-8 h-8 flex items-center justify-center text-ink-faint hover:text-ink text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {isPeru && (
              <button
                onClick={() => handlePickMethod("flow")}
                className="w-full text-left bg-canvas-alt border border-line hover:border-brand rounded-2xl px-4 py-4 mb-3 transition-colors"
              >
                <p className="text-ink text-base font-extrabold">Flow</p>
                <p className="text-ink-faint text-xs mt-1">
                  Tarjeta, transferencia o billetera (Perú/Chile)
                </p>
              </button>
            )}

            <button
              onClick={() => handlePickMethod("paypal")}
              className="w-full text-left bg-[#001a33] border border-[#0070ba] rounded-2xl px-4 py-4 mb-3"
            >
              <p className="text-white text-base font-extrabold">PayPal</p>
              <p className="text-white/50 text-xs mt-1">
                Paga con tu cuenta PayPal o tarjeta (USD)
              </p>
            </button>

            <button
              onClick={() => handlePickMethod("binance")}
              className="w-full text-left bg-[#1a1400] border border-[#F0B90B] rounded-2xl px-4 py-4"
            >
              <p className="text-white text-base font-extrabold">Binance</p>
              <p className="text-white/50 text-xs mt-1">
                Cripto (USDT) — TRC20 / BEP20 / etc.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Modal de pago con Binance */}
      {binanceVisible && binanceIntent && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="w-full max-w-md bg-card border border-line rounded-3xl p-5 my-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-ink text-xl font-black">Pago con Binance</h3>
              <button
                onClick={() => { setBinanceVisible(false); setBinanceIntent(null); setTxidInput(""); }}
                className="w-8 h-8 flex items-center justify-center text-ink-faint hover:text-ink text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Resumen del paquete */}
            <div className="bg-canvas-alt rounded-2xl border border-line px-5 py-4 mb-4">
              <p className="text-ink-faint text-xs uppercase tracking-widest mb-1">Paquete</p>
              <p className="text-ink text-lg font-extrabold">{binanceIntent.packageName}</p>
              <p className="text-brand text-base font-bold mt-1">
                {binanceIntent.credits.toLocaleString()} créditos
              </p>
            </div>

            {/* Countdown / status */}
            {binanceExpired ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
                <p className="text-red-600 text-sm">
                  El intento expiró. Cierra y vuelve a tocar Comprar.
                </p>
              </div>
            ) : (
              <div className="bg-brand-soft border border-brand/30 rounded-2xl px-4 py-2 mb-4 text-center">
                <p className="text-brand text-sm font-bold">
                  Expira en {formatRemaining(remaining)}
                </p>
              </div>
            )}

            {/* Selector de red */}
            {binanceIntent.networks.length > 0 && (
              <div className="mb-3">
                <p className="text-ink-faint text-xs uppercase tracking-widest mb-2">
                  Elige la red ({binanceIntent.coin})
                </p>
                <div className="flex flex-wrap gap-2">
                  {binanceIntent.networks.map((n) => {
                    const active = selectedNetwork === n.network;
                    return (
                      <button
                        key={n.network}
                        onClick={() => { setSelectedNetwork(n.network); setCopiedField(null); }}
                        className={[
                          "rounded-full px-4 py-2 text-xs font-extrabold border transition-colors",
                          active
                            ? "bg-brand text-white border-brand"
                            : "bg-canvas-alt text-brand border-line",
                        ].join(" ")}
                      >
                        {n.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-ink-faint text-[11px] mt-2">
                  Envía SOLO {binanceIntent.coin} en la red seleccionada. Otra red se perderá.
                </p>
              </div>
            )}

            {/* Wallet de destino */}
            {currentNetwork && (
              <div className="mb-3">
                <p className="text-ink-faint text-xs uppercase tracking-widest mb-1">
                  Wallet de destino · {currentNetwork.label}
                </p>
                <button
                  onClick={() => handleCopy(currentNetwork.wallet, "address")}
                  className="w-full bg-canvas-alt border border-line rounded-2xl px-4 py-3 flex items-center gap-2 text-left"
                >
                  <span className="text-ink text-sm font-mono break-all flex-1">
                    {currentNetwork.wallet}
                  </span>
                  <span className="text-xs font-bold shrink-0" style={{ color: copiedField === "address" ? "#22c55e" : undefined }}>
                    {copiedField === "address" ? "✓" : "Copiar"}
                  </span>
                </button>
              </div>
            )}

            {/* Monto exacto */}
            <div className="mb-4">
              <p className="text-ink-faint text-xs uppercase tracking-widest mb-1">
                Monto EXACTO a enviar
              </p>
              <button
                onClick={() => handleCopy(binanceIntent.amount, "amount")}
                className="w-full bg-canvas-alt border-2 border-brand rounded-2xl px-4 py-3 flex items-center gap-2 text-left"
              >
                <span className="flex-1">
                  <span className="text-ink text-2xl font-black">
                    {binanceIntent.amount} <span className="text-brand">{binanceIntent.coin}</span>
                  </span>
                  <span className="block text-ink-faint text-[11px] mt-0.5">
                    Debe llegar este monto exacto (tolerancia {binanceIntent.tolerancePercent}%).
                  </span>
                </span>
                <span className="text-xs font-bold shrink-0" style={{ color: copiedField === "amount" ? "#22c55e" : undefined }}>
                  {copiedField === "amount" ? "✓" : "Copiar"}
                </span>
              </button>
            </div>

            {/* Instrucciones */}
            <div className="bg-brand-soft border border-brand/30 rounded-2xl px-4 py-3 mb-5">
              <p className="text-brand text-xs font-bold mb-1">Cómo pagar</p>
              <p className="text-ink-soft text-xs leading-5">
                1. Abre tu app de Binance.<br />
                2. Envía exactamente <span className="text-brand font-bold">{binanceIntent.amount} {binanceIntent.coin}</span> a la wallet de arriba en la red elegida.<br />
                3. Copia el TXID/hash de la transacción y pégalo aquí abajo.<br />
                4. Toca &quot;Ya pagué&quot;. El sistema valida con Binance y te acredita los créditos.
              </p>
            </div>

            {/* TXID input */}
            <p className="text-ink-faint text-xs uppercase tracking-widest mb-1">
              TXID / Hash de la transacción
            </p>
            <textarea
              value={txidInput}
              onChange={(e) => setTxidInput(e.target.value)}
              placeholder="0xabc123... o hash TRC20"
              disabled={confirming || binanceIntent.status !== "PENDING" || remaining <= 0}
              className="w-full bg-canvas-alt border border-line rounded-2xl px-4 py-3 text-ink text-sm font-mono mb-4 min-h-13 resize-none outline-none focus:border-brand"
            />

            <button
              onClick={handleConfirmTxid}
              disabled={
                confirming ||
                txidInput.trim().length < 10 ||
                binanceIntent.status !== "PENDING" ||
                remaining <= 0
              }
              className="w-full bg-linear-to-r from-brand to-brand-violet disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-2xl transition-all"
            >
              {confirming ? "Confirmando…" : "Ya pagué"}
            </button>

            <p className="text-ink-faint text-[11px] text-center mt-3">
              Si cierras esta pantalla, el sistema sigue intentando confirmar tu pago en segundo plano por unos minutos.
            </p>
          </div>
        </div>
      )}
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
