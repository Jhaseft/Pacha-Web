"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { resetPassword } from "../../../lib/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const trimCode = code.trim();
    const trimPass = newPassword.trim();
    const trimConfirm = confirmPassword.trim();

    if (!trimCode || !trimPass || !trimConfirm) {
      setError("Completa todos los campos.");
      return;
    }
    if (trimCode.length !== 6 || !/^\d+$/.test(trimCode)) {
      setError("El código debe ser de 6 dígitos.");
      return;
    }
    if (trimPass.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (trimPass !== trimConfirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await resetPassword(email, trimCode, trimPass);
      router.replace("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo restablecer la contraseña."
      );
    } finally {
      setLoading(false);
    }
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

        <h1 className="text-white text-3xl font-bold mb-1">Nueva contraseña</h1>
        <p className="text-white/60 text-base mb-8">
          Ingresa el código que enviamos a{" "}
          <span className="text-white font-semibold">{email}</span> y elige una
          nueva contraseña.
        </p>

        <div className="mb-4">
          <label className="text-white text-base font-semibold block mb-2">
            Código de verificación
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            autoComplete="one-time-code"
            className="w-full bg-neutral-900 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none focus:border-white transition-colors tracking-widest text-center text-xl font-bold"
          />
        </div>

        <div className="mb-4">
          <label className="text-white text-base font-semibold block mb-2">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full bg-neutral-900 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none focus:border-white transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPass ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mb-2">
          <label className="text-white text-base font-semibold block mb-2">
            Confirmar contraseña
          </label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full bg-neutral-900 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-[#555] outline-none focus:border-white transition-colors"
          />
        </div>

        {error && <p className="text-red-400 text-sm mt-3 mb-1">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-600 text-white font-semibold rounded-full py-4 mt-6 hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Restablecer contraseña"}
        </button>

        <Link
          href="/login/forgot-password"
          className="block text-center text-white/50 text-sm mt-6 hover:text-white transition-colors"
        >
          ¿No recibiste el código? Volver a enviar
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
