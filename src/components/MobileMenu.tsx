"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { trackPixel } from "@/lib/pixel";

const NAV_LINKS = [
  { label: "Inicio", href: "/", isRoute: true },
  { label: "Soy nuevo", href: "/soy-nuevo", isRoute: true },
  { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros", isRoute: true },
];

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
        backgroundColor: "#0a0a0a",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
      }}
    >
      {/* Links de navegación */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {NAV_LINKS.map((link) =>
          link.isRoute ? (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 600,
                padding: "16px 0",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none",
                display: "block",
              }}
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              style={{
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: 600,
                padding: "16px 0",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none",
                display: "block",
              }}
            >
              {link.label}
            </a>
          )
        )}
      </div>

      {/* Botones auth */}
      <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link
          href="/login"
          onClick={close}
          style={{
            display: "block",
            textAlign: "center",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "16px",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.2)",
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
            backgroundColor: "#A11213",
            textDecoration: "none",
          }}
        >
          Registrarse
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
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.25 rounded-xl hover:bg-white/5 transition-all"
      >
        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-1.75" : ""}`} />
        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-1.75" : ""}`} />
      </button>

      {/* Renderizamos el overlay directamente en <body> para evitar que overflow:hidden del padre lo recorte */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
