"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { trackPixel } from "@/lib/pixel";
import { NAV_LINKS } from "@/lib/navLinks";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = () => setOpen(false);

  const overlay = open ? (
    <div
      style={{
        position: "fixed",
        top: "64px",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "#ffffff",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
      }}
    >
      {/* Links de navegación */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
            style={{
              color: "#171226",
              fontSize: "18px",
              fontWeight: 600,
              padding: "16px 0",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              textDecoration: "none",
              display: "block",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Botones auth */}
      <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link
          href="/login"
          onClick={close}
          style={{
            display: "block",
            textAlign: "center",
            color: "#171226",
            fontWeight: 700,
            fontSize: "16px",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.12)",
            textDecoration: "none",
          }}
        >
          Iniciar sesión
        </Link>
        <Link
          href="/login/cliente"
          onClick={() => { close(); trackPixel("CompleteRegistration"); }}
          style={{
            display: "block",
            textAlign: "center",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: "16px",
            padding: "16px",
            borderRadius: "16px",
            backgroundColor: "#6d5efc",
            textDecoration: "none",
          }}
        >
          Quiero ser creador
        </Link>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Botón hamburguesa / X */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.25 rounded-xl hover:bg-brand-soft transition-all"
      >
        <span className={`block w-5 h-0.5 bg-ink rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-1.75" : ""}`} />
        <span className={`block w-5 h-0.5 bg-ink rounded-full transition-all duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-ink rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-1.75" : ""}`} />
      </button>

      {/* Renderizamos el overlay directamente en <body> para evitar que overflow:hidden del padre lo recorte */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
