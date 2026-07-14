"use client";

import { useEffect, useRef, useState } from "react";

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
  text?: "signin_with" | "signup_with" | "continue_with";
  disabled?: boolean;
}

export default function GoogleSignInButton({
  onCredential,
  onError,
  text = "continue_with",
  disabled = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
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
        if (cancelled || !containerRef.current || !window.google) return;
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
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text,
          shape: "pill",
          logo_alignment: "center",
          width: containerRef.current.offsetWidth || 340,
        });
        setReady(true);
      })
      .catch(() => onError?.("No se pudo cargar Google Sign-In."));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className={disabled ? "pointer-events-none opacity-50" : undefined}>
      <div
        ref={containerRef}
        className="flex justify-center [color-scheme:light]"
      />
      {!ready && (
        <div className="h-11 w-full rounded-full border border-line bg-card animate-pulse" />
      )}
    </div>
  );
}
