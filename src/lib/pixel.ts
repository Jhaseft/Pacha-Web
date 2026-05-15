type FbqFn = (...args: unknown[]) => void;

export function trackPixel(event: string, params?: Record<string, unknown>) {
  const fbq = (window as unknown as { fbq?: FbqFn }).fbq;
  if (typeof fbq === "function") {
    fbq("track", event, params);
  }
}
