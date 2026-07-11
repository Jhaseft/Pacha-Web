"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gem } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiGetMyWallet } from "../../lib/flow";
import { getPublicHostesses, getSavedAnfitrionas, type Anfitriona } from "../../lib/hostesses";
import { getStoriesFeed, type HistoryFeedItem } from "../../lib/hostessService";
import PostCard from "../../components/user/PostCard";
import StoriesBar from "../../components/user/StoriesBar";
import StoryViewer from "../../components/user/StoryViewer";

export default function InicioPage() {
  const { user, token, isHydrated } = useAuth();
  const router = useRouter();

  const [balance, setBalance] = useState<number | null>(null);
  const [anfitrionas, setAnfitrionas] = useState<Anfitriona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [feed, setFeed] = useState<HistoryFeedItem[]>([]);
  const [activeStory, setActiveStory] = useState<HistoryFeedItem | null>(null);

  // ── Auth guard ──
  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  // ── Retorno de pago Flow: llega como /dashboard?token=xxx → lleva a Créditos ──
  useEffect(() => {
    const flowToken = new URLSearchParams(window.location.search).get("token");
    if (flowToken) router.replace(`/dashboard/creditos?token=${flowToken}`);
  }, [router]);

  // ── Saldo ──
  useEffect(() => {
    if (!token) return;
    apiGetMyWallet(token)
      .then((d) => setBalance(Number(d.balance ?? 0)))
      .catch(() => setBalance(0));
  }, [token]);

  // ── Historias ──
  useEffect(() => {
    getStoriesFeed().then(setFeed).catch(() => setFeed([]));
  }, []);

  // ── Anfitrionas (página 1 + favoritos) ──
  const loadFirst = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [result, saved] = await Promise.all([
        getPublicHostesses(1),
        token ? getSavedAnfitrionas(token) : Promise.resolve({ data: [], nextCursor: null }),
      ]);
      const savedIds = new Set(saved.data.map((s) => s.id));
      setAnfitrionas(
        result.anfitrionas.map((a) => ({ ...a, isFavorite: savedIds.has(a.id) })),
      );
      setPage(1);
      setHasMore(result.hasMore);
    } catch {
      setError("No se pudieron cargar las anfitrionas. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isHydrated) loadFirst();
  }, [isHydrated, loadFirst]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const result = await getPublicHostesses(next);
      setAnfitrionas((prev) => {
        const ids = new Set(prev.map((a) => a.id));
        return [...prev, ...result.anfitrionas.filter((a) => !ids.has(a.id))];
      });
      setPage(next);
      setHasMore(result.hasMore);
    } catch {
      /* silencioso */
    } finally {
      setLoadingMore(false);
    }
  };

  const handleStorySelect = (item: HistoryFeedItem) => {
    if (item.stories?.length) setActiveStory(item);
  };

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Carga automática al acercarse al final del feed (estilo TikTok).
  const handleFeedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      hasMore &&
      !loadingMore &&
      el.scrollHeight - el.scrollTop - el.clientHeight < el.clientHeight
    ) {
      loadMore();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] md:h-dvh bg-canvas">
      {/* ── Barra superior ── */}
      <header className="shrink-0 w-full max-w-115 md:max-w-2xl mx-auto flex items-center justify-between px-4 pt-5 pb-3">
        <div>
          <p className="text-ink-faint text-xs uppercase tracking-widest font-semibold">Hola,</p>
          <p className="text-ink font-black text-xl leading-tight">
            {user.firstName ?? "Usuario"}
          </p>
        </div>
        <Link
          href="/dashboard/creditos"
          className="flex items-center gap-2 bg-card border border-line rounded-full pl-3 pr-4 py-2 hover:border-brand/50 transition-colors"
        >
          <Gem size={18} className="text-brand" />
          <span className="text-ink font-bold tabular-nums">
            {balance === null ? "…" : balance.toLocaleString()}
          </span>
          <span className="text-brand text-lg font-black leading-none">+</span>
        </Link>
      </header>

      {/* ── Historias ── */}
      <div className="shrink-0 w-full max-w-115 md:max-w-2xl mx-auto px-4">
        <StoriesBar stories={feed} onSelect={handleStorySelect} />
      </div>

      {/* ── Feed uno-por-scroll ── */}
      {loading ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="w-full max-w-115 h-full py-2 px-3">
            <div className="w-full h-full rounded-3xl bg-canvas-alt animate-pulse" />
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-ink-soft mb-4">{error}</p>
          <button
            onClick={loadFirst}
            className="bg-linear-to-r from-brand to-brand-violet text-white font-semibold px-6 py-3 rounded-full"
          >
            Reintentar
          </button>
        </div>
      ) : anfitrionas.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <p className="text-ink-faint">No hay anfitrionas disponibles por el momento.</p>
        </div>
      ) : (
        <div
          onScroll={handleFeedScroll}
          className="flex-1 min-h-0 overflow-y-auto snap-y snap-mandatory px-3"
        >
          {anfitrionas.map((a) => (
            <div key={a.id} className="h-full snap-start py-2">
              <PostCard anfitriona={a} />
            </div>
          ))}
          {loadingMore && (
            <div className="h-16 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {activeStory && (
        <StoryViewer item={activeStory} onClose={() => setActiveStory(null)} />
      )}
    </div>
  );
}