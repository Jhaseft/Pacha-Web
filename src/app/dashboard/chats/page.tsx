"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import { getChats, type Chat } from "../../../lib/messages";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function ChatsPage() {
  const { user, token, isHydrated } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  useEffect(() => {
    if (!user || !token) return;
    getChats(user.id, token)
      .then(setChats)
      .catch(() => setChats([]))
      .finally(() => setLoading(false));
  }, [user, token]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-lg mx-auto px-4">
        <header className="pt-8 pb-4">
          <h1 className="text-white font-black text-2xl">Chats</h1>
        </header>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[72px] rounded-2xl bg-surface-card animate-pulse" />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40">Aún no tienes conversaciones.</p>
            <Link
              href="/dashboard"
              className="inline-flex mt-4 bg-secondary text-white font-semibold px-6 py-3 rounded-full"
            >
              Explorar anfitrionas
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {chats.map((c) => (
              <Link
                key={c.conversationId}
                href={`/dashboard/chats/${c.conversationId}?otherUserId=${c.otherUserId}&name=${encodeURIComponent(c.otherUserName)}&avatar=${encodeURIComponent(c.otherUserAvatar ?? "")}`}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors"
              >
                <span className="relative w-14 h-14 rounded-full overflow-hidden bg-surface-card shrink-0">
                  {c.otherUserAvatar && (
                    <Image src={c.otherUserAvatar} alt={c.otherUserName} fill sizes="56px" className="object-cover" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white font-semibold truncate">{c.otherUserName}</p>
                    <span className="text-white/30 text-xs shrink-0">{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white/50 text-sm truncate">{c.lastMessage ?? "Imagen"}</p>
                    {c.unreadCount > 0 && (
                      <span className="bg-secondary text-white text-[11px] font-bold min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
