"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trackPixel } from "@/lib/pixel";

type Role = "usuario" | "anfitriona";

interface ChatVideo {
  descripcion: string;
  video: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  imagenes?: string[];
  videos?: ChatVideo[];
}

interface Props {
  role: Role;
  titulo: string;
  subtitulo: string;
  welcomeMessage: string;
  sugerencias?: string[];
  embedded?: boolean;
  hideHeader?: boolean;
}

export function ChatAsistente({ role, titulo, subtitulo, welcomeMessage, sugerencias = [], embedded = false, hideHeader = false }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useRef<string>(crypto.randomUUID());
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    if (messages.length === 1) trackPixel("Chat_Iniciado");
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/chat/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), sessionId: sessionId.current }),
      });

      const data = await res.json();
      console.log("Chat response:", data);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? "Sin respuesta",
          imagenes: (data.imagenes ?? []).map((img: unknown) =>
            typeof img === "string" ? img : (img as Record<string, string>).imagen ?? (img as Record<string, string>).url ?? ""
          ).filter(Boolean),
          videos: data.videos ?? [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hubo un error al contactar al asistente. Intenta nuevamente." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className={`flex flex-col text-white ${embedded ? "h-160 border border-white/8 overflow-hidden bg-white/3 rounded-2xl" : "h-screen bg-[#0a0a0a]"}`}>
      {/* Header */}
      {!hideHeader && (
        <header className="flex-none flex items-center gap-3 px-4 sm:px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-[#A11213]/30">
          <Image
            src="/logofull.jpeg"
            alt="MonetizaLab"
            width={36}
            height={36}
            style={{ height: "auto" }}
            className="rounded-xl object-cover ring-2 ring-[#A11213]/40 flex-none"
          />
          <div className="leading-tight">
            <p className="text-white font-bold text-sm sm:text-base">{titulo}</p>
            <p className="text-white/40 text-xs">{subtitulo}</p>
          </div>
        </header>
      )}

      {/* Mensajes */}
      <div ref={messagesRef} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[90%] sm:max-w-[80%] flex flex-col gap-2`}>
              <div
                className={`px-4 py-3 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#A11213] text-white rounded-br-sm"
                    : "bg-white/5 border border-white/8 text-white/90 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
              {msg.imagenes && msg.imagenes.length > 0 && (
                <div className="flex flex-col gap-2">
                  {msg.imagenes.map((url, ii) => (
                    <div key={ii} className="rounded-xl overflow-hidden border border-white/10 w-66">
                      <img src={url} alt="" className="w-full object-cover bg-black" />
                    </div>
                  ))}
                </div>
              )}
              {msg.videos && msg.videos.length > 0 && (
                <div className="flex flex-col gap-2">
                  {msg.videos.map((v, vi) => (
                    <div key={vi} className="rounded-xl overflow-hidden border border-white/10 w-66">
                      {v.descripcion && (
                        <p className="text-white/50 text-xs px-3 py-1.5 bg-white/5 leading-tight">{v.descripcion}</p>
                      )}
                      <video src={v.video} controls playsInline className="w-full max-h-105 object-contain bg-black">
                        <track kind="captions" />
                      </video>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loader */}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="bg-white/5 border border-white/8 rounded-3xl rounded-bl-sm px-5 py-4 flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Sugerencias (solo al inicio) */}
        {messages.length === 1 && sugerencias.length > 0 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {sugerencias.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-xs px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-[#A11213]/20 hover:border-[#A11213]/40 hover:text-white transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Input */}
      <div className="flex-none px-4 sm:px-6 py-4 bg-black/60 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta..."
            rows={1}
            className="flex-1 resize-none bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#A11213]/50 focus:bg-white/8 transition-all max-h-32 overflow-y-auto"
            style={{ height: "auto" }}
            onInput={(e) => {
              const t = e.currentTarget;
              t.style.height = "auto";
              t.style.height = Math.min(t.scrollHeight, 128) + "px";
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="flex-none w-11 h-11 rounded-2xl bg-[#A11213] flex items-center justify-center hover:bg-[#8a0f10] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-white/20 text-[10px] mt-2">Presiona Enter para enviar · Shift+Enter para nueva línea</p>
      </div>
    </div>
  );
}
