"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, ChevronDown, Search, X } from "lucide-react";
import { COUNTRY_CODES, flagUrl } from "../../../../lib/countryCodes";

interface Props {
  editing: boolean;
  countryCode: string;
  phoneNumber: string;
  onChangeCode: (code: string) => void;
  onChangeNumber: (number: string) => void;
  error?: string;
}

export default function AnfitrionaPhoneField({ editing, countryCode, phoneNumber, onChangeCode, onChangeNumber, error }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch]         = useState("");
  const fieldRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === countryCode && c.name !== "Rusia") ??
    COUNTRY_CODES.find((c) => c.code === countryCode) ??
    COUNTRY_CODES[0];

  const filtered = search.trim()
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search),
      )
    : COUNTRY_CODES;

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={fieldRef} className="relative flex items-center px-4 py-4 gap-3 border-b border-zinc-800">
      <div className="w-9 h-9 rounded-xl bg-[#1a0505] flex items-center justify-center shrink-0">
        <Phone size={18} className="text-[#A11B1B]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Teléfono</p>

        {editing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setSearch(""); setShowPicker((v) => !v); }}
              className="flex items-center gap-1 bg-zinc-800 rounded-lg px-2 py-1 text-sm font-bold text-white hover:bg-zinc-700 transition-colors shrink-0"
            >
              <img src={flagUrl(selectedCountry.flag)} alt={selectedCountry.name} className="w-5 h-3.5 object-cover rounded-sm" />
              <span>{countryCode}</span>
              <ChevronDown size={12} className="text-zinc-400" />
            </button>

            <input
              value={phoneNumber}
              onChange={(e) => onChangeNumber(e.target.value)}
              type="tel"
              placeholder="71234567"
              className="flex-1 min-w-0 bg-transparent text-white text-[15px] font-semibold border-b border-[#A11B1B] pb-1 outline-none placeholder-zinc-600"
            />
          </div>
        ) : (
          <p className="text-white text-[15px] font-semibold">{countryCode} {phoneNumber || "—"}</p>
        )}
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      {showPicker && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-zinc-700 rounded-2xl overflow-hidden z-20 shadow-2xl mx-2">
          <div className="flex items-center gap-2 p-2 border-b border-zinc-800">
            <Search size={14} className="text-zinc-500 shrink-0 ml-1" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar país o código..."
              className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 outline-none py-1"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={14} className="text-zinc-500 hover:text-white transition-colors" />
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => { onChangeCode(item.code); setShowPicker(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors border-b border-zinc-800/40
                  ${item.code === countryCode ? "bg-[#1a0505]" : ""}`}
              >
                <img src={flagUrl(item.flag)} alt={item.name} className="w-6 h-4 object-cover rounded-sm shrink-0" />
                <span className="flex-1 text-white text-sm truncate">{item.name}</span>
                <span className="text-zinc-400 text-sm font-bold shrink-0">{item.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
