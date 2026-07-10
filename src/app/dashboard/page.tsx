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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-lg mx-auto px-4">
        {/* ── Barra superior ── */}
        <header className="flex items-center justify-between pt-8 pb-4">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">Hola,</p>
            <p className="text-white font-black text-xl leading-tight">
              {user.firstName ?? "Usuario"}
            </p>
          </div>
          <Link
            href="/dashboard/creditos"
            className="flex items-center gap-2 bg-surface-card border border-surface-border rounded-full pl-3 pr-4 py-2 hover:border-secondary/50 transition-colors"
          >
            <Gem size={18} className="text-secondary" />
            <span className="text-white font-bold tabular-nums">
              {balance === null ? "…" : balance.toLocaleString()}
            </span>
            <span className="text-secondary text-lg font-black leading-none">+</span>
          </Link>
        </header>

        {/* ── Historias ── */}
        <StoriesBar stories={feed} onSelect={handleStorySelect} />

        {/* ── Feed ── */}
        <section className="pt-4 pb-10">
          {loading ? (
            <div className="flex flex-col gap-5">
              {[1, 2].map((i) => (
                <div key={i} className="w-full aspect-[3/4] rounded-3xl bg-surface-card animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-white/60 mb-4">{error}</p>
              <button
                onClick={loadFirst}
                className="bg-secondary text-white font-semibold px-6 py-3 rounded-full"
              >
                Reintentar
              </button>
            </div>
          ) : anfitrionas.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/40">No hay anfitrionas disponibles por el momento.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-5">
                {anfitrionas.map((a) => (
                  <PostCard key={a.id} anfitriona={a} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="bg-surface-card border border-surface-border hover:border-secondary/50 text-white font-semibold px-8 py-3 rounded-full transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? "Cargando…" : "Ver más"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {activeStory && (
        <StoryViewer item={activeStory} onClose={() => setActiveStory(null)} />
      )}
    </div>
  );
}
21