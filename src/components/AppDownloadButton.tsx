"use client";

import { useEffect, useRef, useState } from "react";
import { trackPixel } from "@/lib/pixel";

const STORE_URL = process.env.NEXT_PUBLIC_APK_URL;

const GooglePlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" />
  </svg>
);

export function AppDownloadButton({ variant = "general" }: { variant?: "cliente" | "host" | "general" }) {
  const eventName = variant === "cliente" ? "APK_Cliente" : variant === "host" ? "APK_Host" : "InitiateCheckout";
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 300);
      if (y < 50) {
        setVisible(true);
      } else {
        setVisible(y < lastY.current);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sin URL configurada preferimos no pintar un botón muerto.
  if (!STORE_URL) return null;

  const baseClasses = [
    "fixed z-40",
    "bg-[#A11213] hover:bg-[#8a0f10] active:scale-[0.98]",
    "text-white font-black",
    "transition-all duration-300",
    "shadow-[0_4px_24px_rgba(161,18,19,0.55)] hover:shadow-[0_6px_32px_rgba(161,18,19,0.70)]",
    visible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3",
  ];

  const mobileCompact = [
    "md:hidden",
    "bottom-4 right-4",
    "w-14 h-14 rounded-full",
    "flex items-center justify-center",
  ];

  const mobileFull = [
    "md:hidden",
    "bottom-3 left-1/2 -translate-x-1/2",
    "w-[88%] max-w-sm h-14 rounded-2xl px-4",
    "flex items-center gap-3",
  ];

  const desktop = [
    "hidden md:flex",
    "items-center gap-3",
    "right-6 bottom-6",
    "w-auto h-auto px-6 py-3.5 rounded-2xl",
  ];

  // Enlace externo a Google Play: se abre en pestaña nueva y en Android
  // lo intercepta la app de Play Store.
  const linkProps = {
    href: STORE_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: () => trackPixel(eventName),
  } as const;

  return (
    <>
      {/* Mobile compact (circular) */}
      <a
        {...linkProps}
        title="Descargar en Google Play"
        className={[...baseClasses, ...mobileCompact, compact ? "" : "hidden"].join(" ")}
      >
        <GooglePlayIcon />
      </a>

      {/* Mobile full-width bar */}
      <a
        {...linkProps}
        title="Descargar en Google Play"
        className={[...baseClasses, ...mobileFull, compact ? "hidden" : ""].join(" ")}
      >
        <GooglePlayIcon />
        <span className="flex flex-col leading-tight flex-1">
          <span className="text-white/65 text-[10px] font-semibold uppercase tracking-widest leading-none">
            Descargar en
          </span>
          <span className="text-sm leading-tight">Google Play</span>
        </span>
        <span className="flex flex-col items-end leading-tight border-l border-white/25 pl-3">
          <span className="text-white font-black text-sm leading-none">+500</span>
          <span className="text-white/50 text-[9px] uppercase tracking-widest">descargas</span>
        </span>
      </a>

      {/* Desktop pill */}
      <a
        {...linkProps}
        title="Descargar en Google Play"
        className={[...baseClasses, ...desktop].join(" ")}
      >
        <GooglePlayIcon />
        <span className="flex flex-col leading-tight">
          <span className="text-white/65 text-[10px] font-semibold uppercase tracking-widest leading-none">
            Descargar en
          </span>
          <span className="text-sm leading-tight">Google Play</span>
        </span>
      </a>
    </>
  );
}
