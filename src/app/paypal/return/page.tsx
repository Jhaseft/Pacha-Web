"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { apiPaypalCapture } from "../../../lib/paypal";

function PaypalReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isHydrated } = useAuth();
  const [error, setError] = useState("");
  const capturedRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (capturedRef.current) return;

    const orderId =
      searchParams.get("token") ??
      (typeof window !== "undefined" ? sessionStorage.getItem("pacha.paypalOrderId") : null);

    if (!orderId || !token) {
      router.replace("/dashboard/creditos?paypal=cancel");
      return;
    }

    capturedRef.current = true;
    apiPaypalCapture(orderId, token)
      .then(() => {
        sessionStorage.removeItem("pacha.paypalOrderId");
        router.replace("/dashboard/creditos?paypal=success");
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "No se pudo confirmar el pago.");
      });
  }, [isHydrated, token, searchParams, router]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 text-center">
      {error ? (
        <>
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button
            onClick={() => router.replace("/dashboard/creditos")}
            className="bg-linear-to-r from-brand to-brand-violet text-white font-bold px-8 py-3 rounded-full"
          >
            Volver a créditos
          </button>
        </>
      ) : (
        <>
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-ink-soft text-sm">Confirmando tu pago con PayPal…</p>
        </>
      )}
    </div>
  );
}

export default function PaypalReturnPage() {
  return (
    <Suspense>
      <PaypalReturnContent />
    </Suspense>
  );
}
