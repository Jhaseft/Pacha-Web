"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { googleLogin, loginWithEmail, type User } from "../../lib/auth";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import {
  ShieldCheck,
  Zap,
  Lock,
  ChevronRight,
  Mail,
  Headphones,
  Sparkles,
} from "lucide-react";

const ROLE_REDIRECTS: Record<string, string> = {
  USER: "/dashboard",
  ANFITRIONA: "/dashboard/anfitriona",
  ADMIN: "/admin",
};

const LOGO_SRC =
  "https://res.cloudinary.com/dnbklbswg/image/upload/v1783607654/1000040485-removebg-preview_glnmou.png";

// Número de WhatsApp de soporte (formato internacional sin signos).
const WHATSAPP_SUPPORT = "51999999999";

/**
 * Pantalla de acceso centrada en Google, pensada para cuando alguien llega
 * desde el perfil de una creadora o un anuncio (?ctx=creator). Crea la cuenta
 * como Usuario con Google y vuelve al perfil/chat de origen.
 */
export default function CreatorLoginScreen() {
  const router = useRouter();
  const { setSession } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Acceso con correo y contraseña (administradores y creadoras que ya tienen
  // cuenta). Oculto por defecto para no restar protagonismo a Google.
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Contexto de origen (?redirect=/..., ?name=Luisa, ?ctx=creator).
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const r = q.get("redirect");
    if (r && r.startsWith("/")) setRedirectTo(r);
    const name = q.get("name");
    if (name) setCreatorName(name);
  }, []);

  function destFor(u: User) {
    if (redirectTo && u.role === "USER") return redirectTo;
    return ROLE_REDIRECTS[u.role] ?? "/dashboard";
  }

  // Google crea automáticamente la cuenta con rol Usuario (sin pedir
  // contraseña) e inicia sesión. Entramos directo al destino de origen.
  async function handleGoogleCredential(idToken: string) {
    try {
      setLoading(true);
      setError("");
      const res = await googleLogin(idToken);
      await setSession(res.access_token, res.user);
      router.replace(destFor(res.user));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo continuar con Google.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin() {
    const trimEmail = email.trim().toLowerCase();
    const trimPass = password.trim();
    if (!trimEmail || !trimPass) {
      setError("Ingresa tu correo y contraseña.");
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
        err instanceof Error ? err.message : "No se pudo iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  const authQuery = new URLSearchParams();
  if (redirectTo) authQuery.set("redirect", redirectTo);
  if (creatorName) authQuery.set("name", creatorName);
  authQuery.set("ctx", "creator");
  const qs = authQuery.toString();

  const heading = creatorName ? (
    <>
      Estás a un paso de{" "}
      <br className="hidden sm:block" />
      hablar con{" "}
      <span className="bg-linear-to-r from-brand-violet to-secondary bg-clip-text text-transparent">
        {creatorName}
      </span>{" "}
      <span className="text-secondary">💜</span>
    </>
  ) : (
    <>
      Inicia sesión para{" "}
      <span className="bg-linear-to-r from-brand-violet to-secondary bg-clip-text text-transparent">
        continuar
      </span>
    </>
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-canvas via-brand-soft/40 to-canvas flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md lg:max-w-4xl rounded-[28px] bg-card shadow-2xl shadow-brand/10 ring-1 ring-line px-6 sm:px-8 py-8 relative overflow-hidden">
        {/* Destellos decorativos suaves */}
        <Sparkles className="absolute top-6 left-5 w-4 h-4 text-brand-violet/40" />
        <Sparkles className="absolute top-24 right-6 w-3 h-3 text-secondary/40" />

        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
          {/* ── Columna izquierda: marca + mensaje + beneficios ── */}
          <div>
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt="MonetizaLab" className="w-8 h-8 object-contain" />
              <span className="text-ink font-black text-2xl tracking-tight">
                Monetiza<span className="text-brand-violet">Lab</span>
              </span>
            </div>

            {/* Título */}
            <h1 className="text-center lg:text-left text-ink text-[26px] sm:text-3xl font-black leading-tight mb-3">
              {heading}
            </h1>
            <p className="text-center lg:text-left text-ink-soft text-sm sm:text-base mb-6 max-w-xs mx-auto lg:mx-0">
              Continúa con Google para acceder al chat de forma rápida y segura.
            </p>

            {/* Beneficios */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-line bg-canvas/60 p-3 mb-6 lg:mb-0">
              <Benefit
                icon={<ShieldCheck className="w-4 h-4" />}
                title="100% privado"
                text="Tus conversaciones están protegidas"
              />
              <Benefit
                icon={<Zap className="w-4 h-4" />}
                title="Rápido y fácil"
                text="Entra en segundos sin complicaciones"
              />
              <Benefit
                icon={<Lock className="w-4 h-4" />}
                title="Seguro"
                text="Tu información está en buenas manos"
              />
            </div>
          </div>

          {/* ── Columna derecha: acciones ── */}
          <div>
            {error && (
              <p className="text-red-500 text-sm text-center mb-3">{error}</p>
            )}

            {/* Botón principal: tarjeta con gradiente rosa→violeta con el botón
                OFICIAL de Google encima (Google no permite recolorear su botón
                ni taparlo, así que lo enmarcamos para lograr el look del mockup). */}
            {/* Botón oficial de Google (el mismo de login/registro que sí
                funciona). Google no permite recolorearlo, así que va tal cual. */}
            <div className="flex justify-center">
              <GoogleSignInButton
                text="continue_with"
                onCredential={handleGoogleCredential}
                onError={setError}
                disabled={loading}
              />
            </div>
            {loading && (
              <p className="mt-2 text-center text-xs text-ink-faint">Conectando…</p>
            )}

            {/* Separador */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-line" />
              <span className="text-ink-faint text-sm">o</span>
              <div className="flex-1 h-px bg-line" />
            </div>

            {/* Continuar con correo electrónico → flujo de OTP (registro/login por
                correo). Al venir de una creadora se registra directo como Usuario. */}
            <Link
              href={`/login/cliente${qs ? `?${qs}` : ""}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3.5 shadow-sm transition-colors hover:border-brand-violet/50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-violet">
                <Mail className="w-5 h-5" />
              </span>
              <span className="text-ink font-semibold flex-1">
                Continuar con correo electrónico
              </span>
              <ChevronRight className="w-5 h-5 text-ink-faint" />
            </Link>

            {/* Privacidad */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-brand-soft/60 border border-brand-soft px-4 py-3.5">
              <ShieldCheck className="w-6 h-6 shrink-0 text-brand-violet" />
              <div>
                <p className="text-ink font-bold text-sm">
                  Tu privacidad es nuestra prioridad
                </p>
                <p className="text-ink-soft text-xs leading-snug">
                  No compartimos tu información. Chats, llamadas y videollamadas
                  100% confidenciales.
                </p>
              </div>
            </div>

            {/* Soporte */}
            <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-ink-soft text-sm">
              <Headphones className="w-4 h-4 text-brand-violet" />
              ¿Necesitas ayuda? Contáctanos por{" "}
              <a
                href={`https://wa.me/${WHATSAPP_SUPPORT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-violet font-semibold underline"
              >
                WhatsApp
              </a>
            </p>

            {/* Acceso con correo y contraseña (admin / creadoras con cuenta) */}
            <div className="mt-4 border-t border-line pt-3">
              {!showEmailForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setShowEmailForm(true);
                  }}
                  className="block w-full text-center text-ink-faint text-xs hover:text-ink-soft transition-colors"
                >
                  ¿Administrador o creador? Inicia sesión con correo y contraseña
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full bg-card border border-line rounded-xl px-4 py-2.5 text-ink placeholder-ink-faint outline-none focus:border-brand-violet transition-colors text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
                    autoComplete="current-password"
                    className="w-full bg-card border border-line rounded-xl px-4 py-2.5 text-ink placeholder-ink-faint outline-none focus:border-brand-violet transition-colors text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <Link
                      href="/login/forgot-password"
                      className="text-ink-faint text-xs hover:text-brand-violet transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                    <button
                      type="button"
                      onClick={handleEmailLogin}
                      disabled={loading}
                      className="rounded-full bg-linear-to-r from-secondary to-brand-violet px-5 py-2 text-sm font-bold text-white shadow-md shadow-brand-violet/25 transition-all disabled:opacity-50"
                    >
                      {loading ? "Ingresando…" : "Iniciar sesión"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1 px-1">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-soft text-brand-violet">
        {icon}
      </span>
      <p className="text-ink font-bold text-[11px] leading-tight">{title}</p>
      <p className="text-ink-faint text-[10px] leading-tight">{text}</p>
    </div>
  );
}
