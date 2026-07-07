"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChatAsistente } from "./ChatAsistente";

type WidgetState = "closed" | "selector" | "chat";
type Role = "usuario" | "anfitriona";

const AUTO_MESSAGES = [
  "Hola 😊 ¿Quieres aprender cómo funciona Pachamama?",
  "El chat es gratis ✨",
  "También puedes hacer llamadas y videollamadas en vivo.",
];

export function ChatWidget() {
  const pathname = usePathname();
  const [state, setState] = useState<WidgetState>("closed");
  const [role, setRole] = useState<Role>("usuario");
  const [bubbles, setBubbles] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Ocultar ChatWidget en páginas de perfil de anfitriona
  const isAnfitrioneProfile = pathname?.includes("/anfitrionas/") || pathname?.startsWith("/@");
  
  if (isAnfitrioneProfile) {
    return null;
  }

  useEffect(() => {
    const delays = [3000, 8000, 14000];
    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        if (!dismissed) {
          setBubbles((prev) => [...prev, AUTO_MESSAGES[i]]);
        }
      }, delay);
      timers.current.push(t);
    });
    return () => timers.current.forEach(clearTimeout);
  }, [dismissed]);

  function dismiss() {
    setDismissed(true);
    setBubbles([]);
    timers.current.forEach(clearTimeout);
  }

  function selectRole(r: Role) {
    setRole(r);
    setState("chat");
    dismiss();
  }

  function openWidget() {
    setState("selector");
    dismiss();
  }

  return (
    <div className="fixed bottom-22 right-4 md:bottom-22 md:right-6 z-50 flex flex-col items-end gap-3">

      {/* Auto-message bubbles */}
      {state === "closed" && bubbles.length > 0 && (
        <div className="flex flex-col items-end gap-2 mb-1 max-w-60">
          {bubbles.map((msg, i) => (
            <div
              key={i}
              className="bg-[#111] border border-white/10 rounded-2xl rounded-br-sm px-4 py-2.5 shadow-xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-start gap-2"
            >
              <p className="text-white/90 text-sm leading-snug flex-1">{msg}</p>
              {i === bubbles.length - 1 && (
                <button
                  onClick={dismiss}
                  className="text-white/30 hover:text-white/60 transition-colors mt-0.5 shrink-0"
                  aria-label="Cerrar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Panel */}
      {state !== "closed" && (
        <div
          className="w-80 sm:w-96 flex flex-col rounded-3xl bg-[#111] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{ height: "min(760px, calc(100vh - 80px))" }}
        >
          {state === "selector" && (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-black/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#A11213]/40">
                    <Image src="/logofull.jpeg" alt="Asistente" width={32} height={32} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Asistente Pachamama</p>
                    <p className="text-white/40 text-xs">¿Cómo puedo ayudarte?</p>
                  </div>
                </div>
                <button
                  onClick={() => setState("closed")}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
                <p className="text-white/60 text-sm text-center mb-2">
                  Selecciona con quién necesitas ayuda:
                </p>

                <button
                  onClick={() => selectRole("usuario")}
                  className="w-full flex items-center gap-4 bg-white/5 hover:bg-[#A11213]/20 border border-white/8 hover:border-[#A11213]/40 rounded-2xl px-5 py-4 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#A11213]/15 border border-[#A11213]/20 flex items-center justify-center flex-none group-hover:bg-[#A11213]/30 transition-colors text-lg">
                    👤
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">¿Quiero aprender a usar la APP?</p>
                  </div>
                </button>

                <button
                  onClick={() => selectRole("anfitriona")}
                  className="w-full flex items-center gap-4 bg-white/5 hover:bg-[#A11213]/20 border border-white/8 hover:border-[#A11213]/40 rounded-2xl px-5 py-4 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#A11213]/15 border border-[#A11213]/20 flex items-center justify-center flex-none group-hover:bg-[#A11213]/30 transition-colors text-lg">
                    💃
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">¿Quieres trabajar con nosotros?</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {state === "chat" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-black/60 flex-none">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[#A11213]/40 flex-none">
                    <Image src="/logofull.jpeg" alt="Asistente" width={36} height={36} className="object-cover w-full h-full" />
                  </div>
                  <p className="text-white font-bold text-sm">Asistente Virtual</p>
                </div>
                <button
                  onClick={() => setState("closed")}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <ChatAsistente
                  role={role}
                  titulo=""
                  subtitulo=""
                  welcomeMessage={
                    role === "usuario"
                      ? "¡Hola! 👋 Soy el asistente de Pachamama. ¿En qué te puedo ayudar hoy?"
                      : "¡Hola! 💫 Soy el asistente para creadoras. ¿Tienes dudas sobre cómo empezar a ganar?"
                  }
                  sugerencias={[]}
                  embedded
                  hideHeader
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón circular con imagen — siempre visible cuando cerrado */}
      {state === "closed" && (
        <button
          onClick={openWidget}
          className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#A11213] shadow-2xl shadow-[#A11213]/40 hover:scale-110 active:scale-95 transition-all"
          title="Habla con nuestro asistente"
        >
          <Image
            src="https://res.cloudinary.com/dnbklbswg/image/upload/v1778740623/chicabot_hxhgy7.jpg"
            alt="Asistente"
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
          {/* Pulsing notification dot */}
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A11213] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#A11213] border-2 border-[#0a0a0a]" />
          </span>
        </button>
      )}
    </div>
  );
}
