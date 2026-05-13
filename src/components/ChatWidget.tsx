"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { ChatAsistente } from "./ChatAsistente";

type WidgetState = "closed" | "selector" | "chat";
type Role = "usuario" | "anfitriona";

export function ChatWidget() {
  const [state, setState] = useState<WidgetState>("closed");
  const [role, setRole] = useState<Role>("usuario");

  function selectRole(r: Role) {
    setRole(r);
    setState("chat");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Panel */}
      {state !== "closed" && (
        <div className="w-80 sm:w-96 flex flex-col rounded-3xl bg-[#111] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ height: 'min(760px, calc(100vh - 80px))' }}>

          {state === "selector" && (
            <>
              {/* Header selector */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-black/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#A11213]/20 border border-[#A11213]/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
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

              {/* Selector de rol */}
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
                    <p className="text-white font-bold text-sm">Soy un usuario</p>
                    <p className="text-white/40 text-xs">Quiero registrarme o aprender a usar la app</p>
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
                    <p className="text-white font-bold text-sm">Soy anfitriona</p>
                    <p className="text-white/40 text-xs">Quiero unirme o tengo dudas sobre cómo ganar</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {state === "chat" && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header chat */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-black/60 flex-none">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#A11213]/20 border border-[#A11213]/30 flex items-center justify-center flex-none">
                    <Bot className="w-5 h-5 text-white" />
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

              {/* Chat sin su propio header (usamos el de arriba) */}
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <ChatAsistente
                  role={role}
                  titulo=""
                  subtitulo=""
                  welcomeMessage={
                    role === "usuario"
                      ? "¡Hola! 👋 Soy el asistente de Pachamama. ¿En qué te puedo ayudar hoy?"
                      : "¡Hola! 💫 Soy el asistente para anfitrionas. ¿Tienes dudas sobre cómo empezar a ganar?"
                  }
                  sugerencias={
                    role === "usuario"
                      ? ["¿Cómo me registro?", "¿Cómo compro créditos?"]
                      : ["¿Cómo me uno?", "¿Cómo gano dinero?"]
                  }
                  embedded
                  hideHeader
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Burbuja flotante — solo visible cuando el panel está cerrado */}
      {state === "closed" && (
        <button
          onClick={() => setState("selector")}
          className="w-14 h-14 rounded-full bg-[#A11213] hover:bg-[#8a0f10] shadow-2xl shadow-[#A11213]/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <Bot className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}
