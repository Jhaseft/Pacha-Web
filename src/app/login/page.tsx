"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { loginWithEmail, googleLogin, type User } from "../../lib/auth";
import { Brand } from "../../components/Brand";
import GoogleSignInButton from "../../components/GoogleSignInButton";

const ROLE_REDIRECTS: Record<string, string> = {
  USER: "/dashboard",
  ANFITRIONA: "/dashboard/anfitriona",
  ADMIN: "/admin",
};

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Destino tras iniciar sesión: perfil de origen (?redirect=/...) para USER.
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get("redirect");
    if (r && r.startsWith("/")) setRedirectTo(r);
  }, []);

  function destFor(u: User) {
    if (redirectTo && u.role === "USER") return redirectTo;
    return ROLE_REDIRECTS[u.role] ?? "/dashboard";
  }

  async function handleLogin() {
    const trimEmail = email.trim().toLowerCase();
    const trimPass = password.trim();

    if (!trimEmail || !trimPass) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
      setError("Ingresa un correo válido.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await loginWithEmail(trimEmail, trimPass);
      await setSession(res.access_token, res.user);
      router.replace(destFor(res.user));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCredential(idToken: string) {
    try {
      setLoading(true);
      setError("");
      const res = await googleLogin(idToken);
      await setSession(res.access_token, res.user);
      // Con Google la cuenta queda lista: el nombre viene de Google y no se
      // pide contraseña. Entramos directo al destino.
      router.replace(destFor(res.user));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo continuar con Google."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* Logo arriba a la izquierda */}
      <header className="h-16 flex items-center px-5 sm:px-8 border-b border-line">
        <Brand />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-ink text-3xl font-black mb-1">Iniciar sesión</h1>
          <p className="text-ink-soft text-base mb-8">
            Accede con tu correo y contraseña.
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

          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-ink text-sm font-semibold">
                Contraseña
              </label>
              <Link
                href="/login/forgot-password"
                className="text-ink-faint text-sm hover:text-brand transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
                className="w-full bg-card border border-line rounded-xl px-4 py-3 text-ink placeholder-ink-faint outline-none focus:border-brand transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-brand transition-colors"
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

          {error && (
            <p className="text-red-500 text-sm mt-3 mb-1">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand text-white font-black rounded-full py-4 mt-6 shadow-lg shadow-brand/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-line" />
            <span className="text-ink-faint text-sm">o</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <div className="mt-6">
            <GoogleSignInButton
              text="signin_with"
              disabled={loading}
              onCredential={handleGoogleCredential}
              onError={setError}
            />
          </div>

          <Link
            href={`/login/cliente${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="block text-center text-ink-soft text-sm mt-6 hover:text-ink transition-colors"
          >
            ¿No tienes cuenta?{" "}
            <span className="text-brand font-semibold underline">Registrate aqui</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
