"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { Brand } from "../../../components/Brand";
import GoogleSignInButton from "../../../components/GoogleSignInButton";
import {
  sendOtp,
  verifyOtp,
  googleLogin,
  googleLoginAnfitriona,
  completeRegistration,
  completeGoogleClientProfile,
  completeAnfitrionaRegistration,
  completeGoogleAnfitrionaProfile,
  type User,
} from "../../../lib/auth";

type Role = "USER" | "ANFITRIONA";
type Step = "role" | "method" | "otp" | "profile";
type AuthMode = "otp" | "google";

const ROLE_REDIRECTS: Record<string, string> = {
  USER: "/dashboard",
  ANFITRIONA: "/dashboard/anfitriona",
  ADMIN: "/admin",
};

const inputClass =
  "w-full bg-card border border-line rounded-xl px-4 py-3 text-ink placeholder-ink-faint outline-none focus:border-brand transition-colors";
const labelClass = "text-ink text-sm font-semibold block mb-2";

export default function RegisterPage() {
  const router = useRouter();
  const { setSession, token, user, isHydrated } = useAuth();

  const [role, setRole] = useState<Role | null>(null);
  const [step, setStep] = useState<Step>("role");
  const [authMode, setAuthMode] = useState<AuthMode>("otp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Token para completar el perfil: tempToken (OTP) o accessToken (Google).
  const [completionToken, setCompletionToken] = useState("");

  // Método correo / OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Perfil (compartido)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Perfil creador
  const [username, setUsername] = useState("");
  const [cedula, setCedula] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [idDoc, setIdDoc] = useState<File | null>(null);
  const [accepted, setAccepted] = useState(false);

  // Si el usuario llega ya autenticado (p. ej. desde el botón Google del login)
  // con el perfil incompleto, saltamos directo a completar el perfil.
  useEffect(() => {
    if (!isHydrated) return;
    if (token && user && !user.isProfileComplete) {
      const r: Role = user.role === "ANFITRIONA" ? "ANFITRIONA" : "USER";
      setRole(r);
      setAuthMode("google");
      setCompletionToken(token);
      prefillName(user);
      setStep("profile");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  function prefillName(u: User) {
    if (u.firstName) setFirstName(u.firstName);
    if (u.lastName) setLastName(u.lastName);
  }

  function goToProfileOrRedirect(res: { access_token: string; user: User }) {
    if (res.user.isProfileComplete) {
      setSession(res.access_token, res.user);
      router.replace(ROLE_REDIRECTS[res.user.role] ?? "/dashboard");
      return;
    }
    setAuthMode("google");
    setCompletionToken(res.access_token);
    prefillName(res.user);
    setStep("profile");
  }

  async function handleGoogleCredential(idToken: string) {
    if (!role) return;
    try {
      setLoading(true);
      setError("");
      const res =
        role === "ANFITRIONA"
          ? await googleLoginAnfitriona(idToken)
          : await googleLogin(idToken);
      goToProfileOrRedirect(res);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo continuar con Google.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp() {
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Ingresa un correo válido.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await sendOtp(trimmed);
      setEmail(trimmed);
      setStep("otp");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo enviar el código.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Ingresa el código de 6 dígitos.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await verifyOtp(email, code);
      if ("access_token" in res) {
        setSession(res.access_token, res.user);
        router.replace(ROLE_REDIRECTS[res.user.role] ?? "/dashboard");
        return;
      }
      setAuthMode("otp");
      setCompletionToken(res.tempToken);
      setStep("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteUser() {
    const name = firstName.trim();
    if (!name) return setError("Ingresa tu nombre.");
    if (!password || password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirmPassword)
      return setError("Las contraseñas no coinciden.");

    const [fn, ...rest] = name.split(/\s+/);
    const ln = rest.join(" ") || undefined;

    try {
      setLoading(true);
      setError("");
      const res =
        authMode === "otp"
          ? await completeRegistration({
            tempToken: completionToken,
            firstName: fn,
            lastName: ln ?? "",
            password,
            confirmPassword,
          })
          : await completeGoogleClientProfile(
            { firstName: fn, lastName: ln, password, confirmPassword },
            completionToken,
          );
      setSession(res.access_token, res.user);
      router.replace(ROLE_REDIRECTS[res.user.role] ?? "/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo completar el registro.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteAnfitriona() {
    if (!firstName.trim()) return setError("Ingresa tu nombre.");
    if (!lastName.trim()) return setError("Ingresa tu apellido.");
    if (!username.trim()) return setError("Ingresa un nombre de usuario.");
    if (!cedula.trim()) return setError("Ingresa tu cédula.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth))
      return setError("Ingresa tu fecha de nacimiento.");
    if (authMode === "otp") {
      if (!password || password.length < 6)
        return setError("La contraseña debe tener al menos 6 caracteres.");
      if (password !== confirmPassword)
        return setError("Las contraseñas no coinciden.");
    }
    if (!idDoc) return setError("Sube una imagen de tu documento de identidad.");
    if (!accepted) return setError("Debes aceptar los Términos y Condiciones.");

    const base = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      cedula: cedula.trim(),
      dateOfBirth,
      ...(referralCode.trim() ? { referralCode: referralCode.trim() } : {}),
    };

    try {
      setLoading(true);
      setError("");
      const res =
        authMode === "otp"
          ? await completeAnfitrionaRegistration(
            {
              ...base,
              tempToken: completionToken,
              password,
              confirmPassword,
            },
            idDoc,
          )
          : await completeGoogleAnfitrionaProfile(base, idDoc, completionToken);
      setSession(res.access_token, res.user);
      router.replace(ROLE_REDIRECTS[res.user.role] ?? "/dashboard/anfitriona");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo completar el registro.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  }

  function selectRole(r: Role) {
    setRole(r);
    setError("");
    setStep("method");
  }

  function back() {
    setError("");
    if (step === "method") {
      setStep("role");
      setRole(null);
    } else if (step === "otp") {
      setOtp(["", "", "", "", "", ""]);
      setStep("method");
    } else if (step === "profile") {
      setStep(authMode === "otp" ? "otp" : "method");
    }
  }

  const isCreator = role === "ANFITRIONA";
  const primaryBtn =
    "w-full bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand text-white font-black rounded-full py-4 shadow-lg shadow-brand/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <header className="h-16 flex items-center px-5 sm:px-8 border-b border-line">
        <Brand />
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {step !== "role" && (
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-ink-soft text-sm mb-6 hover:text-ink transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          )}

          {/* ── Paso 1: elegir tipo de cuenta ─────────────────────────── */}
          {step === "role" && (
            <>
              <h1 className="text-ink text-3xl font-black mb-1">Crear cuenta</h1>
              <p className="text-ink-soft text-base mb-8">
                ¿Cómo quieres unirte a la plataforma?
              </p>

              <button
                onClick={() => selectRole("USER")}
                className="w-full text-left bg-card border border-line rounded-2xl p-5 mb-4 hover:border-brand transition-colors group"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
                    </svg>
                  </div>
                  <span className="text-ink font-black text-lg">Usuario</span>
                </div>
                <p className="text-ink-soft text-sm">
                  Explora, sigue y apoya a tus creadores favoritos.
                </p>
              </button>

              <button
                onClick={() => selectRole("ANFITRIONA")}
                className="w-full text-left bg-card border border-line rounded-2xl p-5 hover:border-brand transition-colors"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11 5.52.44c.5.04.7.66.32.99l-4.2 3.6 1.28 5.39c.12.49-.42.88-.85.62L12 17.3l-4.72 2.85c-.43.26-.97-.13-.85-.62l1.28-5.39-4.2-3.6a.56.56 0 0 1 .32-.99l5.52-.44 2.13-5.11Z" />
                    </svg>
                  </div>
                  <span className="text-ink font-black text-lg">Creador</span>
                </div>
                <p className="text-ink-soft text-sm">
                  Publica contenido, gana suscriptores y monetiza tu comunidad.
                </p>
              </button>

              <Link
                href="/login"
                className="block text-center text-ink-soft text-sm mt-8 hover:text-ink transition-colors"
              >
                ¿Ya tienes cuenta?{" "}
                <span className="text-brand font-semibold underline">Iniciar sesión</span>
              </Link>
            </>
          )}

          {/* ── Paso 2: elegir método (Google o correo) ───────────────── */}
          {step === "method" && (
            <>
              <h1 className="text-ink text-3xl font-black mb-1">
                {isCreator ? "Registro de creador" : "Crear cuenta"}
              </h1>
              <p className="text-ink-soft text-base mb-8">
                Regístrate con tu correo.
              </p>
              <p className="text-ink-soft text-base mb-8">
                Te enviaremos un código de verificación para completar tu registro como {isCreator ? "creador" : "usuario"}.
              </p>


              <label className={labelClass}>Correo</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                autoComplete="email"
                className={inputClass}
              />

              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-line" />
                <span className="text-ink-faint text-sm">o continua con</span>
                <div className="flex-1 h-px bg-line" />
              </div>



              <GoogleSignInButton
                text="signup_with"
                disabled={loading}
                onCredential={handleGoogleCredential}
                onError={setError}
              />

              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className={`${primaryBtn} mt-6`}
              >
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </>
          )}

          {/* ── Paso 3: verificar OTP ─────────────────────────────────── */}
          {step === "otp" && (
            <>
              <h1 className="text-ink text-3xl font-black mb-1">Verificar código</h1>
              <p className="text-ink-soft text-base mb-8">
                Ingresa el código de 6 dígitos que enviamos a{" "}
                <span className="text-ink font-semibold">{email}</span>
              </p>

              <div className="flex gap-2 justify-between mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-ink text-xl font-bold bg-card border border-line rounded-xl outline-none focus:border-brand transition-colors"
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className={primaryBtn}
              >
                {loading ? "Verificando..." : "Verificar"}
              </button>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="block w-full text-center text-ink-soft text-sm mt-5 hover:text-ink transition-colors"
              >
                Reenviar código
              </button>
            </>
          )}

          {/* ── Paso 4: completar perfil ──────────────────────────────── */}
          {step === "profile" && !isCreator && (
            <>
              <h1 className="text-ink text-3xl font-black mb-1">Completa tu perfil</h1>
              <p className="text-ink-soft text-base mb-8">
                Agrega tu nombre y una contraseña para acceder cuando quieras.
              </p>

              <div className="mb-4">
                <label className={labelClass}>Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              {renderPasswordFields()}

              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

              <button
                onClick={handleCompleteUser}
                disabled={loading}
                className={`${primaryBtn} mt-6`}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </>
          )}

          {step === "profile" && isCreator && (
            <>
              <h1 className="text-ink text-3xl font-black mb-1">Perfil de creador</h1>
              <p className="text-ink-soft text-base mb-8">
                Completa tus datos para registrarte como creador.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className={labelClass}>Nombre</label>
                  <input type="text" placeholder="Camila" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Apellido</label>
                  <input type="text" placeholder="Sánchez" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="mb-4">
                <label className={labelClass}>Nombre de usuario</label>
                <input type="text" placeholder="camila_princ" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
              </div>

              <div className="mb-4">
                <label className={labelClass}>Cédula</label>
                <input type="text" inputMode="numeric" placeholder="12345678" value={cedula} onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))} maxLength={15} className={inputClass} />
              </div>

              <div className="mb-4">
                <label className={labelClass}>Fecha de nacimiento</label>
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={`${inputClass} [color-scheme:light]`} />
              </div>

              <div className="mb-4">
                <label className={labelClass}>Código de referido (opcional)</label>
                <input type="text" placeholder="Si un creador te refirió" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} className={inputClass} />
              </div>

              {authMode === "otp" && renderPasswordFields()}

              <div className="mb-4">
                <label className={labelClass}>Documento de identidad</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIdDoc(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-brand-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand-soft/70"
                />
                {idDoc && (
                  <p className="text-ink-faint text-xs mt-1 truncate">{idDoc.name}</p>
                )}
              </div>

              <label className="flex items-start gap-2.5 mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-brand"
                />
                <span className="text-ink-soft text-sm">
                  He leído y acepto los{" "}
                  <Link href="/terminos" className="text-brand underline">
                    Términos y Condiciones
                  </Link>
                  .
                </span>
              </label>

              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

              <button
                onClick={handleCompleteAnfitriona}
                disabled={loading}
                className={`${primaryBtn} mt-6`}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  function renderPasswordFields() {
    return (
      <>
        <div className="mb-4">
          <label className={labelClass}>Contraseña</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={`${inputClass} pr-12`}
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

        <div className="mb-2">
          <label className={labelClass}>Confirmar contraseña</label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
      </>
    );
  }
}
