"use client";
import { trackPixel } from "@/lib/pixel";

const STORE_URL = process.env.NEXT_PUBLIC_APK_URL;

export function ApkLink({ event, className, children }: { event: string; className?: string; children: React.ReactNode }) {
  // Sin URL configurada preferimos no pintar un enlace muerto.
  if (!STORE_URL) return null;

  return (
    <a
      href={STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackPixel(event)}
      className={className}
    >
      {children}
    </a>
  );
}
