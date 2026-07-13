"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function MisDatosPage() {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const rows = [
    { label: "Teléfono", value: user.phoneNumber ?? "—" },
    { label: "Nombre", value: [user.firstName, user.lastName].filter(Boolean).join(" ") || "—" },
    { label: "Email", value: user.email ?? "—" },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-lg mx-auto px-4">
        <header className="pt-8 pb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-canvas-alt flex items-center justify-center text-ink"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-ink font-black text-2xl">Mis datos</h1>
        </header>

        <div className="bg-card border border-line rounded-3xl divide-y divide-line">
          {rows.map((row) => (
            <div key={row.label} className="px-5 py-4">
              <p className="text-ink-faint text-xs mb-1">{row.label}</p>
              <p className="text-ink text-[15px] font-medium">{row.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
