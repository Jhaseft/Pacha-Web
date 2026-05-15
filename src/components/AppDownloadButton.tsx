"use client";

import { useEffect, useRef, useState } from "react";
import { trackPixel } from "@/lib/pixel";

const APK_URL = process.env.NEXT_PUBLIC_APK_URL;

const AndroidIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="white">
    <path d="M17.523 15.341a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-11.046 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM2.1 8.4h19.8A1.1 1.1 0 0 1 23 9.5v6a1.1 1.1 0 0 1-1.1 1.1H21v2.65a.75.75 0 0 1-1.5 0V16.6H4.5v2.65a.75.75 0 0 1-1.5 0V16.6h-.9A1.1 1.1 0 0 1 1 15.5v-6A1.1 1.1 0 0 1 2.1 8.4Zm.9 1.5v5h18v-5H3ZM8.22 2.47a.75.75 0 0 1 1.02-.28L12 3.8l2.76-1.61a.75.75 0 1 1 .75 1.3L13.5 4.8V7.4h-3V4.8L8.5 3.49a.75.75 0 0 1-.28-1.02Z" />
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

  return (
    <>
      {/* Mobile compact (circular) */}
      <a
        href={APK_URL}
        download
        title="Descargar app Android"
        onClick={() => trackPixel(eventName)}
        className={[...baseClasses, ...mobileCompact, compact ? "" : "hidden"].join(" ")}
      >
        <AndroidIcon />
      </a>

      {/* Mobile full-width bar */}
      <a
        href={APK_URL}
        download
        title="Descargar aplicación Android"
        onClick={() => trackPixel(eventName)}
        className={[...baseClasses, ...mobileFull, compact ? "hidden" : ""].join(" ")}
      >
        <AndroidIcon />
        <span className="flex flex-col leading-tight flex-1">
          <span className="text-white/65 text-[10px] font-semibold uppercase tracking-widest leading-none">
            Descargar app
          </span>
          <span className="text-sm leading-tight">Android .apk</span>
        </span>
        <span className="flex flex-col items-end leading-tight border-l border-white/25 pl-3">
          <span className="text-white font-black text-sm leading-none">+500</span>
          <span className="text-white/50 text-[9px] uppercase tracking-widest">descargas</span>
        </span>
      </a>

      {/* Desktop pill */}
      <a
        href={APK_URL}
        download
        title="Descargar aplicación Android"
        onClick={() => trackPixel(eventName)}
        className={[...baseClasses, ...desktop].join(" ")}
      >
        <AndroidIcon />
        <span className="flex flex-col leading-tight">
          <span className="text-white/65 text-[10px] font-semibold uppercase tracking-widest leading-none">
            Descargar app
          </span>
          <span className="text-sm leading-tight">Android .apk</span>
        </span>
      </a>
    </>
  );
}
