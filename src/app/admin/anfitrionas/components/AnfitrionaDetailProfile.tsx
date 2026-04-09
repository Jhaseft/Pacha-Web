"use client";

import { Wallet } from "lucide-react";
import { type AnfitrionaStats } from "../../../../lib/adminStats";

interface Props {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  isActive: boolean;
  isOnline: boolean;
  stats: AnfitrionaStats | null;
}

export default function AnfitrionaDetailProfile({ firstName, lastName, avatarUrl, isActive, isOnline, stats }: Props) {
  const name     = `${firstName} ${lastName}`.trim() || "Sin nombre";
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <>
      <div className="flex flex-col items-center py-5">
        <div
          className="w-28 h-28 rounded-full border-[3px] border-[#A11B1B] bg-[#2d0a0a] overflow-hidden flex items-center justify-center"
          style={{ boxShadow: "0 0 28px rgba(161,27,27,0.5)" }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#A11B1B] text-4xl font-black">{initials}</span>
          )}
        </div>

        <p className="text-white text-[22px] font-black mt-3 tracking-wide">{name}</p>

        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          <span className={`rounded-full px-3 py-1 border text-xs font-bold
            ${isActive ? "bg-[#0d1f0d] border-green-500 text-green-400" : "bg-[#1a0505] border-red-500 text-red-400"}`}>
            {isActive ? "Activa" : "Inactiva"}
          </span>
          <span className={`rounded-full px-3 py-1 border text-xs font-bold
            ${isOnline ? "bg-[#0d1f0d] border-green-500 text-green-400" : "bg-[#1a1a1a] border-zinc-700 text-zinc-500"}`}>
            {isOnline ? "En línea" : "Desconectada"}
          </span>
        </div>
      </div>

      {!stats ? (
        <div className="flex justify-center py-4">
          <span className="w-6 h-6 border-2 border-[#A11B1B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3 mb-1">
          <div className="flex items-center gap-3 bg-[#1a0505] rounded-2xl border border-[#A11B1B] p-4">
            <div className="w-9 h-9 rounded-xl bg-[#2d0a0a] flex items-center justify-center shrink-0">
              <Wallet size={18} className="text-[#A11B1B]" />
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Saldo en Billetera</p>
              <p className="text-white text-[15px] font-semibold mt-1">
                Soles / {stats.balance.soles}{" "}
                <span className="text-zinc-500 text-xs">({stats.balance.credits} créditos)</span>
              </p>
            </div>
          </div>

          <p className="text-white text-base font-bold italic">Ganancias en Soles</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Hoy",      value: stats.earnings.today.soles    },
              { label: "Este mes", value: stats.earnings.thisMonth.soles },
              { label: "Total",    value: stats.earnings.total.soles     },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#141414] rounded-2xl border border-zinc-800 p-3">
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">{label}</p>
                <p className="text-green-400 text-[15px] font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
