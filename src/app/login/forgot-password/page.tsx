"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { forgotPassword } from "../../../lib/auth";

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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/logofull.jpeg"
            alt="Pachamama"
            width={120}
            height={120}
            className="rounded-2xl object-cover"
            priority
          />
        </div>

        <h1 className="text-white text-3xl font-bold mb-1">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-white/60 text-base mb-8">
          Ingresa tu correo y te enviaremos un código para recuperar tu cuenta.
        </p>

        <div className="mb-4">
          <label className="text-white text-base font-semibold block mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="email"
            className="w-full bg-neutral-900 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none focus:border-white transition-colors"
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-3 mb-1">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-600 text-white font-semibold rounded-full py-4 mt-6 hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : "Enviar código"}
        </button>

        <Link
          href="/login"
          className="block text-center text-white/50 text-sm mt-6 hover:text-white transition-colors"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
