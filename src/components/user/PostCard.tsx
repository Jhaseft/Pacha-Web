"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Bookmark, Gem, Heart, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toggleLike, toggleSaved, type Anfitriona } from "../../lib/hostesses";

export default function PostCard({ anfitriona }: { anfitriona: Anfitriona }) {
  const { token } = useAuth();
  const [liked, setLiked] = useState(anfitriona.isLiked);
  const [likes, setLikes] = useState(anfitriona.likesCount);
  const [saved, setSaved] = useState(anfitriona.isFavorite);
  const likingRef = useRef(false);
  const savingRef = useRef(false);

  const featured = anfitriona.images?.[0] || anfitriona.avatar || null;
  const profileHref = `/anfitrionas/${anfitriona.username ?? anfitriona.id}`;

  const handleLike = async () => {
    if (!token || likingRef.current) return;
    likingRef.current = true;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((c) => (wasLiked ? c - 1 : c + 1));
    try {
      const res = await toggleLike(anfitriona.id, token);
      setLiked(res.liked);
      setLikes(res.likesCount);
    } catch {
      setLiked(wasLiked);
      setLikes((c) => (wasLiked ? c + 1 : c - 1));
    } finally {
      likingRef.current = false;
    }
  };

  const handleSave = async () => {
    if (!token || savingRef.current) return;
    savingRef.current = true;
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      const res = await toggleSaved(anfitriona.id, token);
      setSaved(res.saved);
    } catch {
      setSaved(wasSaved);
    } finally {
      savingRef.current = false;
    }
  };

  return (
    <div className="relative w-full h-full mx-auto max-w-115 rounded-3xl overflow-hidden bg-neutral-900 shadow-xl">
      {/* Imagen destacada → perfil */}
      <Link href={profileHref} className="absolute inset-0">
        {featured ? (
          <Image
            src={featured}
            alt={anfitriona.name}
            fill
            sizes="(max-width: 460px) 100vw, 460px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-brand to-brand-violet" />
        )}
        {/* Degradado inferior para legibilidad */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
      </Link>

      {/* Estado online */}
      {anfitriona.isOnline && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-xs font-semibold">En línea</span>
        </div>
      )}

      {/* Columna de acciones */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
        {/* Foto de perfil → perfil */}
        <Link href={profileHref} className="flex flex-col items-center gap-1">
          <span className="relative block">
            <span className="block w-13 h-13 rounded-full border-2 border-white overflow-hidden bg-neutral-800">
              {anfitriona.avatar ? (
                <Image
                  src={anfitriona.avatar}
                  alt={anfitriona.name}
                  width={52}
                  height={52}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="flex w-full h-full items-center justify-center text-white text-lg font-black">
                  {(anfitriona.name?.[0] ?? "?").toUpperCase()}
                </span>
              )}
            </span>
            {anfitriona.isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-neutral-900" />
            )}
          </span>
        </Link>

        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <Heart
            size={32}
            className={liked ? "text-secondary fill-secondary" : "text-white"}
          />
          <span className="text-white text-xs font-semibold">{likes}</span>
        </button>

        <button onClick={handleSave} className="flex flex-col items-center gap-1">
          <Bookmark
            size={30}
            className={saved ? "text-yellow-400 fill-yellow-400" : "text-white"}
          />
          <span className="text-white text-xs font-semibold">Guardar</span>
        </button>
      </div>

      {/* Info inferior */}
      <div className="absolute inset-x-0 bottom-0 p-4 pr-20">
        <Link href={profileHref} className="block">
          <h3 className="text-white text-xl font-black leading-tight">
            @{anfitriona.username ?? anfitriona.name}
          </h3>
        </Link>
        {anfitriona.shortDescription && (
          <p className="text-white/80 text-sm mt-1 line-clamp-2">
            {anfitriona.shortDescription}
          </p>
        )}
        {anfitriona.credits > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-white/50 text-xs">Desde</span>
            <Gem size={13} className="text-brand-violet" />
            <span className="text-white text-sm font-semibold">
              {anfitriona.credits} créditos
            </span>
          </div>
        )}

        {/* Acción principal → perfil */}
        <Link
          href={profileHref}
          className="mt-3 flex items-center justify-center gap-2 bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand active:scale-95 transition-all text-white font-black text-sm py-3 rounded-full shadow-lg shadow-brand/30"
        >
          <MessageCircle size={17} className="fill-white" />
          Ver perfil
        </Link>
      </div>
    </div>
  );
}
