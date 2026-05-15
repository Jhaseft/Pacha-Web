"use client";
import { trackPixel } from "@/lib/pixel";

const APK_URL = process.env.NEXT_PUBLIC_APK_URL;

export function ApkLink({ event, className, children }: { event: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={APK_URL} download onClick={() => trackPixel(event)} className={className}>
      {children}
    </a>
  );
}
