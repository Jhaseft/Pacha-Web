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
  /** Contenido visible del botón (el diseño personalizado). */
  children: ReactNode;
  /** Clases del contenedor visible (el botón que ve el usuario). */
  className?: string;
}

/**
 * Botón de Google con diseño 100% personalizado. Renderiza el botón real de
 * Google (que abre el selector de cuentas) de forma transparente encima del
 * diseño propio, de modo que al pulsar el botón bonito se dispara el flujo
 * oficial de Google Identity Services (muestra los correos y deja elegir uno).
 */
export default function GoogleOverlayButton({
  onCredential,
  onError,
  disabled = false,
  children,
  className = "",
}: Props) {
  const gisRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  // Mantiene la referencia más reciente del callback sin re-inicializar GIS.
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    let cancelled = false;

    if (!CLIENT_ID) {
      onError?.("Falta configurar el Client ID de Google.");
      return;
    }

    loadGsiScript()
      .then(() => {
        if (cancelled || !gisRef.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              onCredentialRef.current(response.credential);
            } else {
              onError?.("No se pudo obtener el token de Google.");
            }
          },
        });
        window.google.accounts.id.renderButton(gisRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "center",
          width: wrapRef.current?.offsetWidth || 360,
        });
        setReady(true);
      })
      .catch(() => onError?.("No se pudo cargar Google Sign-In."));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative ${disabled ? "pointer-events-none opacity-60" : ""} ${className}`}
    >
      {/* Diseño visible del botón */}
      {children}

      {/* Botón real de Google, transparente y estirado para cubrir todo el
          área clicable. `color-scheme:light` evita que el tema oscuro lo pinte. */}
      <div
        ref={gisRef}
        aria-hidden={!ready}
        className="absolute inset-0 z-10 overflow-hidden opacity-0 [color-scheme:light] [&_iframe]:!h-full [&_iframe]:!w-full [&>div]:!h-full [&>div]:!w-full"
      />
    </div>
  );
}
