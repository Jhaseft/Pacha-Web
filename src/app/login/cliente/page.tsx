"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import {
  sendOtp,
  verifyOtp,
  completeRegistration,
} from "../../../lib/auth";

const COUNTRIES = [
  { code: "PE", name: "Perú", dialCode: "51" },
  { code: "CO", name: "Colombia", dialCode: "57" },
  { code: "MX", name: "México", dialCode: "52" },
  { code: "AR", name: "Argentina", dialCode: "54" },
  { code: "CL", name: "Chile", dialCode: "56" },
  { code: "EC", name: "Ecuador", dialCode: "593" },
  { code: "BO", name: "Bolivia", dialCode: "591" },
  { code: "PY", name: "Paraguay", dialCode: "595" },
  { code: "UY", name: "Uruguay", dialCode: "598" },
  { code: "VE", name: "Venezuela", dialCode: "58" },
  { code: "PA", name: "Panamá", dialCode: "507" },
  { code: "CR", name: "Costa Rica", dialCode: "506" },
  { code: "GT", name: "Guatemala", dialCode: "502" },
  { code: "HN", name: "Honduras", dialCode: "504" },
  { code: "SV", name: "El Salvador", dialCode: "503" },
  { code: "NI", name: "Nicaragua", dialCode: "505" },
  { code: "DO", name: "Rep. Dominicana", dialCode: "1809" },
  { code: "CU", name: "Cuba", dialCode: "53" },
];

type Step = "phone" | "otp" | "profile";

export default function ClienteLoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Phone step
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [showCountryList, setShowCountryList] = useState(false);
  const [phone, setPhone] = useState("");

  // OTP step
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [fullPhone, setFullPhone] = useState("");

  // Profile step
  const [tempToken, setTempToken] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSendOtp() {
    const localNumber = phone.replace(/\D/g, "");
    if (!localNumber) {
      setError("Ingresa tu número de celular.");
      return;
    }
    const full = `+${country.dialCode}${localNumber}`;
    try {
      setLoading(true);
      setError("");
      await sendOtp(full);
      setFullPhone(full);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar el código.");
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
      const res = await verifyOtp(fullPhone, code);
      if ("needsProfile" in res) {
        setTempToken(res.tempToken);
        setStep("profile");
      } else {
        await setSession(res.access_token, res.user);
        router.replace("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteProfile() {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await completeRegistration({
        tempToken,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      await setSession(res.access_token, res.user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/login"
          className="flex items-center gap-2 text-white text-base mb-8 hover:text-white/70 transition-colors w-fit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>

        {step === "phone" && (
          <>
            <h1 className="text-white text-3xl font-bold mb-2">Crear cuenta</h1>
            <p className="text-white/70 text-lg mb-8">
              Te enviaremos un código de verificación para validar tu número.
            </p>

            <div className="mb-4 relative">
              <label className="text-white text-lg font-bold block mb-2">País</label>
              <button
                type="button"
                onClick={() => setShowCountryList((v) => !v)}
                className="w-full flex items-center justify-between bg-neutral-900 border border-white rounded-xl px-4 py-3 text-white hover:bg-neutral-800 transition-colors"
              >
                <span>{country.name}</span>
                <span className="text-white/70">+{country.dialCode}</span>
              </button>
              {showCountryList && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCountryList(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-neutral-900 border border-white/10 rounded-xl max-h-56 overflow-y-auto shadow-xl">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCountry(c);
                          setShowCountryList(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-0 text-white hover:bg-white/5 transition-colors"
                      >
                        <span>{c.name}</span>
                        <span className="text-white/70">+{c.dialCode}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="mb-4">
              <label className="text-white text-lg font-bold block mb-2">
                Número de celular
              </label>
              <div className="flex items-center bg-neutral-900 border border-white rounded-xl overflow-hidden">
                <span className="text-white px-4 py-3 border-r border-white/20 shrink-0">
                  +{country.dialCode}
                </span>
                <input
                  type="tel"
                  placeholder="999 999 999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  maxLength={15}
                  className="flex-1 bg-transparent text-white placeholder-[#666] px-4 py-3 outline-none"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-red-600 text-white font-semibold rounded-full py-4 mt-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>

            <Link
              href="/login/email?role=cliente"
              className="block text-center text-white/60 text-sm mt-6 underline hover:text-white transition-colors"
            >
              Ya tengo cuenta, iniciar sesión con email
            </Link>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="text-white text-3xl font-bold mb-2">
              Verificar código
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Ingresa el código de 6 dígitos enviado a{" "}
              <span className="text-white font-medium">{fullPhone}</span>
            </p>

            <div className="flex gap-3 justify-between mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-white text-xl font-bold bg-neutral-900 border border-white rounded-xl outline-none focus:border-red-500 transition-colors"
                />
              ))}
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-red-600 text-white font-semibold rounded-full py-4 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : "Verificar"}
            </button>

            <button
              onClick={() => { setOtp(["","","","","",""]); setStep("phone"); setError(""); }}
              className="block w-full text-center text-white/60 text-sm mt-6 underline hover:text-white transition-colors"
            >
              Cambiar número
            </button>
          </>
        )}

        {step === "profile" && (
          <>
            <h1 className="text-white text-3xl font-bold mb-2">
              Completa tu perfil
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Ingresa tus datos para finalizar el registro.
            </p>

            {[
              { label: "Nombre", value: firstName, onChange: setFirstName, type: "text", placeholder: "Tu nombre" },
              { label: "Apellido", value: lastName, onChange: setLastName, type: "text", placeholder: "Tu apellido" },
              { label: "Email", value: email, onChange: setEmail, type: "email", placeholder: "correo@ejemplo.com" },
            ].map((field) => (
              <div key={field.label} className="mb-4">
                <label className="text-white text-lg font-bold block mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full bg-neutral-900 border border-white rounded-xl px-4 py-3 text-white placeholder-[#666] outline-none focus:border-red-500 transition-colors"
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="text-white text-lg font-bold block mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-white rounded-xl px-4 py-3 text-white placeholder-[#666] outline-none focus:border-red-500 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
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

            <div className="mb-4">
              <label className="text-white text-lg font-bold block mb-2">Confirmar contraseña</label>
              <input
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-white rounded-xl px-4 py-3 text-white placeholder-[#666] outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button
              onClick={handleCompleteProfile}
              disabled={loading}
              className="w-full bg-red-600 text-white font-semibold rounded-full py-4 mt-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
