"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Tipos mínimos de Google Identity Services (GIS) que usamos aquí.
type CredentialResponse = { credential?: string };
type GoogleId = {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: Record<string, unknown>,
  ) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";

function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.google?.accounts?.id) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("gsi error")));
      return;
    }

    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("gsi error"));
    document.head.appendChild(script);
  });
}

interface Props {
  /** Recibe el ID token (credential) de Google para enviarlo al backend. */
  onCredential: (idToken: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  /** Contenido visible del botón (el diseño rosado personalizado). */
  children: ReactNode;
  className?: string;
}

/**
 * Botón de Google totalmente personalizado (fondo rosado con degradado).
 * Dibuja el botón REAL de Google al ancho exacto del botón visible, lo centra
 * y lo deja transparente encima; así cualquier clic abre el selector oficial
 * de cuentas de Google. Es responsive: se redibuja al cambiar el ancho.
 */
export default function GoogleOverlayButton({
  onCredential,
  onError,
  disabled = false,
  children,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const gisRef = useRef<HTMLDivElement>(null);
  const lastWidth = useRef(0);
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    let cancelled = false;
    if (!CLIENT_ID) {
      onError?.("Falta configurar el Client ID de Google.");
      return;
    }

    const renderButton = () => {
      if (!gisRef.current || !wrapRef.current || !window.google) return;
      const measured = wrapRef.current.offsetWidth || 320;
      const width = Math.max(200, Math.min(400, Math.round(measured)));
      if (Math.abs(width - lastWidth.current) < 4 && ready) return;
      lastWidth.current = width;
      gisRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(gisRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "center",
        width,
      });
      setReady(true);
    };

    let ro: ResizeObserver | null = null;

    loadGsiScript()
      .then(() => {
        if (cancelled || !window.google) return;
        if (!initialized.current) {
          initialized.current = true;
          window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: (response) => {
              if (response.credential) onCredentialRef.current(response.credential);
              else onError?.("No se pudo obtener el token de Google.");
            },
          });
        }
        renderButton();
        if (wrapRef.current) {
          ro = new ResizeObserver(() => renderButton());
          ro.observe(wrapRef.current);
        }
      })
      .catch(() => onError?.("No se pudo cargar Google Sign-In."));

    return () => {
      cancelled = true;
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative ${disabled ? "pointer-events-none opacity-60" : ""} ${className}`}
    >
      {/* Diseño visible (botón rosado) */}
      {children}

      {/* Botón real de Google: transparente, centrado y del ancho exacto,
          encima de todo para capturar el clic. */}
      <div
        aria-hidden={!ready}
        className="absolute inset-0 z-10 flex items-center justify-center opacity-0 scheme-light"
      >
        <div ref={gisRef} />
      </div>
    </div>
  );
}
