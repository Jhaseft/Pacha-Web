"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Send, Lock, Phone, Video, AlertCircle, X } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { getMessages, sendMessage, markAsRead, type Message } from "../../../../lib/messages";
import { getPublicServicePrices, type ServicePrice } from "../../../../lib/hostessService";
import { useMessageSocket } from "../../../../hooks/useMessageSocket";

const SPAM_LIMIT = 5;

function ChatThread() {
  const { user, token, isHydrated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const search = useSearchParams();

  const routeConversationId = String(params.conversationId);
  const otherUserId = search.get("otherUserId") ?? "";
  const name = search.get("name") ?? "Chat";
  const avatar = search.get("avatar") ?? "";

  const [conversationId, setConversationId] = useState(routeConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>([]);
  const [sendError, setSendError] = useState<{ text: string; recharge: boolean } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { socket: msgSocket, onNewMessage } = useMessageSocket();

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  // Precios de servicio de la anfitriona (mensaje / llamada / video)
  useEffect(() => {
    if (!otherUserId) return;
    getPublicServicePrices(otherUserId).then(setServicePrices).catch(() => {});
  }, [otherUserId]);

  const getPrice = (type: ServicePrice["serviceType"]) =>
    servicePrices.find((p) => p.serviceType === type)?.price ?? null;

  const msgPrice = getPrice("MESSAGE_SEND");
  const callPrice = getPrice("CALL");
  const videoPrice = getPrice("VIDEO_CALL");

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

  // Mensajes entrantes en tiempo real (WebSocket)
  useEffect(() => {
    if (!user?.id || !msgSocket) return;
    const unsub = onNewMessage((msg) => {
      if (msg.conversationId !== conversationId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      scrollToBottom();
      if (token) markAsRead(conversationId, user.id, token).catch(() => {});
    });
    return () => { unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgSocket, conversationId, user?.id, token]);

  // Anti-spam: nº de mensajes propios consecutivos sin respuesta (backend lo bloquea a los 5)
  const unrespondedCount = useMemo(() => {
    if (!user?.id) return 0;
    let count = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].senderId === user.id) count++;
      else break;
    }
    return count;
  }, [messages, user?.id]);
  const isSpamBlocked = unrespondedCount >= SPAM_LIMIT;

  function handleCall(callType: "CALL" | "VIDEO_CALL") {
    const price = getPrice(callType);
    if (price === null || !otherUserId) return;
    const p = new URLSearchParams({
      anfitrionaId: otherUserId,
      anfitrionaName: name,
      anfitrionaAvatar: avatar,
      callType,
      pricePerMinute: String(price),
    });
    router.push(`/call?${p.toString()}`);
  }

  const handleSend = async () => {
    const body = text.trim();
    if (!body || !user || !token || !otherUserId || sending || isSpamBlocked) return;
    setSendError(null);
    setSending(true);
    setText("");

    const tempId = `_pending_${Date.now()}`;
    const tempMsg: Message = {
      id: tempId,
      conversationId,
      senderId: user.id,
      text: body,
      read: false,
      isLocked: false,
      price: null,
      isUnlocked: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom();

    try {
      const msg = await sendMessage(user.id, otherUserId, body, token);
      setMessages((prev) => prev.map((m) => (m.id === tempId ? msg : m)));
      if (conversationId === "new") setConversationId(msg.conversationId);
      scrollToBottom();
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setText(body);
      const raw = e instanceof Error ? e.message : "";
      if (/cr[ée]dito/i.test(raw)) {
        setSendError({ text: "No tienes créditos suficientes para enviar el mensaje.", recharge: true });
      } else if (/consecutiv/i.test(raw)) {
        setSendError({ text: raw, recharge: false });
      } else {
        setSendError({ text: raw || "No se pudo enviar el mensaje.", recharge: false });
      }
    } finally {
      setSending(false);
    }
  };

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <div className="max-w-lg w-full mx-auto flex flex-col flex-1">
        {/* Cabecera estilo WhatsApp */}
        <header className="sticky top-0 z-10 flex items-center gap-3 px-3 py-3 bg-card/90 backdrop-blur border-b border-line">
          <Link href="/dashboard/chats" className="text-ink-soft hover:text-ink p-1">
            <ArrowLeft size={22} />
          </Link>
          {otherUserId && user.role !== "ANFITRIONA" ? (
            <Link
              href={`/anfitrionas/${otherUserId}`}
              className="flex items-center gap-3 flex-1 min-w-0 group"
            >
              <span className="relative w-10 h-10 rounded-full overflow-hidden bg-canvas-alt shrink-0 border border-brand/40">
                {avatar && <Image src={avatar} alt={name} fill sizes="40px" className="object-cover" />}
              </span>
              <div className="min-w-0">
                <p className="text-ink font-semibold truncate group-hover:underline">{name}</p>
                <p className="text-brand text-xs">Ver perfil</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="relative w-10 h-10 rounded-full overflow-hidden bg-canvas-alt shrink-0">
                {avatar && <Image src={avatar} alt={name} fill sizes="40px" className="object-cover" />}
              </span>
              <p className="text-ink font-semibold truncate">{name}</p>
            </div>
          )}

          {/* Llamada / Videollamada */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleCall("CALL")}
              disabled={callPrice === null}
              aria-label="Llamar"
              className="w-9 h-9 rounded-full bg-canvas-alt hover:bg-brand-soft flex items-center justify-center text-green-600 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            >
              <Phone size={18} />
            </button>
            <button
              onClick={() => handleCall("VIDEO_CALL")}
              disabled={videoPrice === null}
              aria-label="Videollamada"
              className="w-9 h-9 rounded-full bg-canvas-alt hover:bg-brand-soft flex items-center justify-center text-brand disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
            >
              <Video size={19} />
            </button>
          </div>
        </header>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-ink-faint text-sm text-center">
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
                        ? "bg-brand text-white rounded-br-md"
                        : "bg-card text-ink rounded-bl-md border border-line"
                    }`}
                  >
                    {m.isLocked && !m.isUnlocked ? (
                      <span className={`flex items-center gap-2 italic ${mine ? "text-white/70" : "text-ink-faint"}`}>
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

        {/* Error de envío (créditos / spam) */}
        {sendError && (
          <div className="mx-4 mb-2 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-red-600 text-sm flex-1">{sendError.text}</p>
            {sendError.recharge && (
              <Link
                href="/dashboard/creditos"
                className="bg-linear-to-r from-brand to-brand-violet text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
              >
                Recargar
              </Link>
            )}
            <button onClick={() => setSendError(null)} className="text-ink-faint hover:text-ink shrink-0">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Bloqueo anti-spam */}
        {isSpamBlocked && (
          <div className="mx-4 mb-2 flex items-center gap-2 bg-brand-soft border border-brand/20 rounded-2xl px-4 py-2.5">
            <Lock size={15} className="text-brand shrink-0" />
            <p className="text-ink-soft text-xs">
              Enviaste {SPAM_LIMIT} mensajes sin respuesta. Espera a que el creador de contenido te conteste.
            </p>
          </div>
        )}

        {/* Barra de envío */}
        <div className="sticky bottom-0 flex items-center gap-2 px-4 py-3 bg-card border-t border-line">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isSpamBlocked}
            placeholder={
              isSpamBlocked
                ? "Chat bloqueado hasta que el creador de contenido responda"
                : msgPrice != null
                ? `Enviar mensaje – ${msgPrice} cr.`
                : "Escribe un mensaje…"
            }
            className="flex-1 bg-canvas border border-line rounded-full px-4 py-3 text-ink placeholder-ink-faint text-sm outline-none focus:border-brand disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim() || isSpamBlocked}
            className="w-11 h-11 rounded-full bg-brand flex items-center justify-center disabled:opacity-40 shrink-0"
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
