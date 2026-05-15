"use client";

import { useEffect, useRef, useState } from "react";
import { trackPixel } from "@/lib/pixel";

const APK_URL = process.env.NEXT_PUBLIC_APK_URL;

export function AppDownloadButton() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
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

  return (
    <a
      href={APK_URL}
      download
      title="Descargar aplicación Android"
      onClick={() => trackPixel("InitiateCheckout")}
      className={[
        "fixed z-40 flex items-center gap-3",
        "bg-[#A11213] hover:bg-[#8a0f10] active:scale-[0.98]",
        "text-white font-black",
        "transition-all duration-300",
        "shadow-[0_4px_24px_rgba(161,18,19,0.55)] hover:shadow-[0_6px_32px_rgba(161,18,19,0.70)]",
        "bottom-3 left-1/2 -translate-x-1/2",
        "w-[88%] max-w-sm h-14 rounded-2xl px-4",
        "md:left-auto md:right-6 md:bottom-6 md:translate-x-0",
        "md:w-auto md:max-w-none md:h-auto md:px-6 md:py-3.5 md:rounded-2xl",
        visible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 shrink-0"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M17.523 15.341a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-11.046 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM2.1 8.4h19.8A1.1 1.1 0 0 1 23 9.5v6a1.1 1.1 0 0 1-1.1 1.1H21v2.65a.75.75 0 0 1-1.5 0V16.6H4.5v2.65a.75.75 0 0 1-1.5 0V16.6h-.9A1.1 1.1 0 0 1 1 15.5v-6A1.1 1.1 0 0 1 2.1 8.4Zm.9 1.5v5h18v-5H3ZM8.22 2.47a.75.75 0 0 1 1.02-.28L12 3.8l2.76-1.61a.75.75 0 1 1 .75 1.3L13.5 4.8V7.4h-3V4.8L8.5 3.49a.75.75 0 0 1-.28-1.02Z" />
      </svg>

      <span className="flex flex-col leading-tight flex-1">
        <span className="text-white/65 text-[10px] font-semibold uppercase tracking-widest leading-none">
          Descargar app
        </span>
        <span className="text-sm leading-tight">Android .apk</span>
      </span>

      <span className="md:hidden flex flex-col items-end leading-tight border-l border-white/25 pl-3">
        <span className="text-white font-black text-sm leading-none">+500</span>
        <span className="text-white/50 text-[9px] uppercase tracking-widest">descargas</span>
      </span>
    </a>
  );
}
