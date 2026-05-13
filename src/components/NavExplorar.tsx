"use client";

import { useState, useRef } from "react";

interface Props {
  /** "" para landing page (usa #section), "/" para sub-páginas (usa /#section) */
  base?: string;
}

const ITEMS = [
  { label: "Paquetes", hash: "paquetes" },
  { label: "Características", hash: "features" },
  { label: "Cómo funciona", hash: "como-funciona" },
  { label: "Descargar app", hash: "descargar" },
  { label: "Contacto", hash: "contacto" },
];

export function NavExplorar({ base = "" }: Props) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Explorar
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {ITEMS.map((item) => (
            <a
              key={item.hash}
              href={`${base}#${item.hash}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
