"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Send, Lock } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { getMessages, sendMessage, markAsRead, type Message } from "../../../../lib/messages";

function ChatThread() {
  const { user, token, isHydrated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const search = useSearchParams();

  const conversationId = String(params.conversationId);
  const otherUserId = search.get("otherUserId") ?? "";
  const name = search.get("name") ?? "Chat";
  const avatar = search.get("avatar") ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  const scrollToBottom = () =>
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));

  useEffect(() => {
    if (!token || conversationId === "new") {
      setLoading(false);
      return;
    }
    getMessages(conversationId, token)
      .then((m) => {
        setMessages(m);
        scrollToBottom();
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
    if (user) markAsRead(conversationId, user.id, token).catch(() => {});
  }, [conversationId, token, user]);

  const handleSend = async () => {
    const body = text.trim();
    if (!body || !user || !token || !otherUserId || sending) return;
    setSending(true);
    setText("");
    try {
      const msg = await sendMessage(user.id, otherUserId, body, token);
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    } catch {
      setText(body); // restaura si falla
    } finally {
      setSending(false);
    }
  };

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="max-w-lg w-full mx-auto flex flex-col flex-1">
        {/* Cabecera */}
        <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-black/90 backdrop-blur border-b border-surface-border">
          <Link href="/dashboard/chats" className="text-white/70 hover:text-white">
            <ArrowLeft size={22} />
          </Link>
          <span className="relative w-10 h-10 rounded-full overflow-hidden bg-surface-card">
            {avatar && <Image src={avatar} alt={name} fill sizes="40px" className="object-cover" />}
          </span>
          <p className="text-white font-semibold">{name}</p>
        </header>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/40 text-sm text-center">
                Envía el primer mensaje para iniciar la conversación.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const mine = m.senderId === user.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      mine
                        ? "bg-secondary text-white rounded-br-md"
                        : "bg-surface-card text-white rounded-bl-md border border-surface-border"
                    }`}
                  >
                    {m.isLocked && !m.isUnlocked ? (
                      <span className="flex items-center gap-2 text-white/70 italic">
                        <Lock size={14} /> Mensaje bloqueado
                      </span>
                    ) : m.imageUrl ? (
                      <span className="relative block w-40 h-40 rounded-lg overflow-hidden">
                        <Image src={m.imageUrl} alt="" fill sizes="160px" className="object-cover" />
                      </span>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Barra de envío */}
        <div className="sticky bottom-0 flex items-center gap-2 px-4 py-3 bg-black border-t border-surface-border">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe un mensaje…"
            className="flex-1 bg-surface-card border border-surface-border rounded-full px-4 py-3 text-white text-sm outline-none focus:border-secondary/60"
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center disabled:opacity-40 shrink-0"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatThreadPage() {
  return (
    <Suspense>
      <ChatThread />
    </Suspense>
  );
}
