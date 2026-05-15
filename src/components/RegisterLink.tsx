"use client";

import Link from "next/link";
import { trackPixel } from "@/lib/pixel";

export function RegisterLink({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Link
      href="/login/cliente"
      className={className}
      onClick={() => trackPixel("CompleteRegistration")}
    >
      {children}
    </Link>
  );
}
