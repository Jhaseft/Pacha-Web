'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getPublicHostesses, Anfitriona } from '@/lib/hostesses';
import { Search, Loader2, Heart, AlertCircle, Users, X, ArrowLeft } from 'lucide-react';

const LOGO_SRC =
  'https://res.cloudinary.com/dnbklbswg/image/upload/v1783607654/1000040485-removebg-preview_glnmou.png';

const PAGE_SIZE = 24;

export default function ExplorarPage() {
  const router = useRouter();
  const [items, setItems] = useState<Anfitriona[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = async (page: number, replace: boolean) => {
    replace ? setLoading(true) : setLoadingMore(true);
    setError(null);
    try {
      const res = await getPublicHostesses(page, PAGE_SIZE);
      setItems((prev) => (replace ? res.anfitrionas : [...prev, ...res.anfitrionas]));
      setHasMore(res.hasMore);
    } catch {
      setError('No se pudieron cargar los creadores. Verifica tu conexión.');
    } finally {
      replace ? setLoading(false) : setLoadingMore(false);
    }
  };

  useEffect(() => {
    load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter((a) => `${a.name} ${a.username ?? ''}`.toLowerCase().includes(q))
    : items;

  const nextPage = Math.floor(items.length / PAGE_SIZE) + 1;

  return (
    <div className="min-h-screen bg-surface text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-surface/85 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition shrink-0"
            aria-label="Volver"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="MonetizaLab" className="w-8 h-8 object-contain shrink-0" />
          <span className="text-lg font-black tracking-tight">
            Monetiza<span className="text-secondary">Lab</span>
          </span>
          <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-white/50 text-sm">
            <Users size={16} className="text-secondary" />
            Explorar creadores
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Título */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Descubre <span className="text-secondary">creadores</span>
          </h1>
          <p className="text-white/60 mt-1 text-sm">Encuentra con quién quieres conectar</p>
        </div>

        {/* Buscador */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o usuario…"
            className="w-full rounded-full bg-surface-card border border-surface-border pl-11 pr-11 py-3 text-white placeholder-white/40 focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 outline-none transition"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Estados */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={36} className="text-secondary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-24 text-center">
            <AlertCircle size={44} className="text-white/40 mb-3" />
            <p className="text-white/70 mb-6">{error}</p>
            <button
              onClick={() => load(1, true)}
              className="bg-linear-to-r from-secondary to-purple hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold transition"
            >
              Reintentar
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Search size={24} className="text-white/40" />
            </div>
            <p className="text-white/50">
              {q ? `No se encontraron creadores para “${query}”.` : 'Aún no hay creadores.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((a) => (
                <CreatorCard key={a.id} a={a} />
              ))}
            </div>

            {/* Cargar más (solo sin búsqueda activa) */}
            {!q && hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => load(nextPage, false)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full border border-secondary/50 bg-secondary/10 px-6 py-2.5 text-sm font-bold text-secondary hover:bg-secondary/20 transition disabled:opacity-60"
                >
                  {loadingMore ? <Loader2 size={16} className="animate-spin" /> : null}
                  {loadingMore ? 'Cargando…' : 'Cargar más'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CreatorCard({ a }: { a: Anfitriona }) {
  const img = a.images[0] || a.avatar || '/no_image.svg';
  const href = a.username
    ? `/@${encodeURIComponent(a.username)}`
    : `/anfitrionas/${a.id}`;
  return (
    <Link
      href={href}
      className="group relative rounded-2xl overflow-hidden border border-surface-border bg-surface-card hover:border-secondary/50 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20"
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={img}
          alt={a.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

        {/* Estado */}
        <span
          className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md ${
            a.isOnline
              ? 'bg-emerald-500/25 border border-emerald-400/40 text-emerald-300'
              : 'bg-black/40 border border-white/15 text-white/70'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${a.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-white/50'}`} />
          {a.isOnline ? 'En línea' : 'Offline'}
        </span>

        {/* Info inferior */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="flex items-center gap-1">
            <h3 className="font-bold text-white truncate">{a.name}</h3>
          </div>
          {a.username && <p className="text-white/60 text-xs truncate">@{a.username}</p>}
          <div className="flex items-center gap-1 mt-1 text-white/80 text-xs">
            <Heart size={12} className="text-secondary fill-secondary" />
            {a.likesCount.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
