"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Crown, CalendarClock } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { apiGetMySubscriptions } from "../../../lib/subscriptions";
import type { MySubscription } from "../../../types/subscriptions";

function SubscriptionCard({ item }: { item: MySubscription }) {
  const expiresAt = new Date(item.expiresAt);
  const daysLeft = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Link
      href={`/anfitrionas/${item.anfitrionaUsername}`}
      className={`block rounded-2xl border overflow-hidden mb-3 ${
        item.isActive ? "bg-card border-brand/30" : "bg-card border-line"
      }`}
    >
      <div className="flex items-center p-4 gap-3">
        {/* Avatar */}
        <span
          className={`relative rounded-full overflow-hidden shrink-0 border-2 flex items-center justify-center bg-canvas-alt ${
            item.isActive ? "border-brand" : "border-line"
          }`}
          style={{ width: 52, height: 52 }}
        >
          {item.anfitrionaAvatar ? (
            <Image src={item.anfitrionaAvatar} alt={item.anfitrionaName} fill sizes="52px" className="object-cover" />
          ) : (
            <span className="text-brand text-xl font-bold">
              {item.anfitrionaName[0]?.toUpperCase() ?? "?"}
            </span>
          )}
        </span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-ink font-bold text-[15px] truncate">{item.anfitrionaName}</p>
          <p className="text-ink-faint text-xs mt-0.5 truncate">@{item.anfitrionaUsername}</p>
          <p className={`text-[11px] mt-1 font-semibold ${item.isActive ? "text-brand" : "text-ink-faint"}`}>
            {item.isActive
              ? daysLeft > 0
                ? `Vence en ${daysLeft} día${daysLeft !== 1 ? "s" : ""}`
                : "Vence hoy"
              : "Expirada"}
          </p>
        </div>

        {/* Precio + badge */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            item.isActive ? "bg-brand-soft text-brand" : "bg-canvas-alt text-ink-faint"
          }`}>
            {item.isActive ? "● ACTIVA" : "● EXPIRADA"}
          </span>
          <span className="text-ink-faint text-[11px]">{item.price} cr/mes</span>
        </div>
      </div>

      {item.isActive && (
        <div className="bg-canvas-alt px-4 py-2 flex items-center gap-2 border-t border-line">
          <CalendarClock size={13} className="text-ink-faint" />
          <span className="text-ink-faint text-[11px]">
            Vence el {expiresAt.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
      )}
    </Link>
  );
}

export default function MisSuscripcionesPage() {
  const { user, isHydrated } = useAuth();
  const router = useRouter();
  const [subs, setSubs] = useState<MySubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  useEffect(() => {
    if (!user) return;
    apiGetMySubscriptions()
      .then(setSubs)
      .catch(() => setSubs([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const active = subs.filter((s) => s.isActive);
  const expired = subs.filter((s) => !s.isActive);

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
          <div className="flex-1">
            <h1 className="text-ink font-black text-xl">Mis suscripciones</h1>
            <p className="text-ink-faint text-xs mt-0.5">
              {active.length} activa{active.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Crown size={22} className="text-brand" />
        </header>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-canvas-alt animate-pulse" />
            ))}
          </div>
        ) : subs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-brand-soft flex items-center justify-center">
              <Crown size={32} className="text-brand" />
            </div>
            <p className="text-ink font-bold text-base">Sin suscripciones</p>
            <p className="text-ink-faint text-sm px-8">
              Aún no te has suscrito a ningún creador de contenido.
            </p>
          </div>
        ) : (
          <div className="pb-10">
            {active.length > 0 && (
              <>
                {expired.length > 0 && (
                  <p className="text-ink-faint text-[11px] uppercase tracking-widest mb-3">
                    Activas · {active.length}
                  </p>
                )}
                {active.map((item) => (
                  <SubscriptionCard key={item.subscriptionId} item={item} />
                ))}
              </>
            )}
            {expired.length > 0 && (
              <>
                <p className="text-ink-faint text-[11px] uppercase tracking-widest mb-3 mt-2">
                  Expiradas · {expired.length}
                </p>
                {expired.map((item) => (
                  <SubscriptionCard key={item.subscriptionId} item={item} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
