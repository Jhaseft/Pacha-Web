"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { forgotPassword } from "../../../lib/auth";
import { Brand } from "../../../components/Brand";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const trimEmail = email.trim().toLowerCase();

    if (!trimEmail) {
      setError("Ingresa tu correo.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
      setError("Ingresa un correo válido.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await forgotPassword(trimEmail);
      router.push(
        `/login/reset-password?email=${encodeURIComponent(trimEmail)}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo procesar la solicitud."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <header className="h-16 flex items-center px-5 sm:px-8 border-b border-line">
        <Brand />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-ink text-3xl font-black mb-1">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-ink-soft text-base mb-8">
            Ingresa tu correo y te enviaremos un código para recuperar tu cuenta.
          </p>

          <div className="mb-4">
            <label className="text-ink text-sm font-semibold block mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
              className="w-full bg-card border border-line rounded-xl px-4 py-3 text-ink placeholder-ink-faint outline-none focus:border-brand transition-colors"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-3 mb-1">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand text-white font-black rounded-full py-4 mt-6 shadow-lg shadow-brand/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar código"}
          </button>

          <Link
            href="/login"
            className="block text-center text-ink-soft text-sm mt-6 hover:text-ink transition-colors"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
