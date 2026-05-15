"use client";
import { useEffect } from "react";
import { trackPixel } from "@/lib/pixel";

export function PixelEvent({ event, params }: { event: string; params?: Record<string, unknown> }) {
  useEffect(() => {
    trackPixel(event, params);
  }, []);
  return null;
}
