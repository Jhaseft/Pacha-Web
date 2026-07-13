"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaypalCancelPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") sessionStorage.removeItem("pacha.paypalOrderId");
    router.replace("/dashboard/creditos?paypal=cancel");
  }, [router]);

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
