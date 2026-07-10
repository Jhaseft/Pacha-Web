"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Bookmark, Heart, MessageCircle } from "lucide-react";
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
    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-surface-card shadow-xl">
      {/* Imagen destacada */}
      <Link href={profileHref} className="absolute inset-0">
        {featured ? (
          <Image
            src={featured}
            alt={anfitriona.name}
            fill
            sizes="(max-width: 512px) 100vw, 512px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple" />
        )}
        {/* Degradado inferior para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      </Link>

      {/* Estado online */}
      {anfitriona.isOnline && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-xs font-semibold">En línea</span>
        </div>
      )}

      {/* Acciones laterales */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center gap-5">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <Heart
            size={30}
            className={liked ? "text-secondary fill-secondary" : "text-white"}
          />
          <span className="text-white text-xs font-semibold">{likes}</span>
        </button>
        <button onClick={handleSave} className="flex flex-col items-center gap-1">
          <Bookmark
            size={28}
            className={saved ? "text-purple fill-purple" : "text-white"}
          />
        </button>
        <Link href={profileHref} className="flex flex-col items-center gap-1">
          <MessageCircle size={28} className="text-white" />
        </Link>
      </div>

      {/* Info inferior */}
      <div className="absolute inset-x-0 bottom-0 p-5 pr-20">
        <Link href={profileHref} className="block">
          <h3 className="text-white text-2xl font-black leading-tight">
            {anfitriona.name}
          </h3>
          {anfitriona.username && (
            <p className="text-white/60 text-sm font-medium">@{anfitriona.username}</p>
          )}
        </Link>
        {anfitriona.shortDescription && (
          <p className="text-white/80 text-sm mt-1.5 line-clamp-2">
            {anfitriona.shortDescription}
          </p>
        )}
        <Link
          href={profileHref}
          className="inline-flex mt-3 bg-secondary hover:bg-secondary/90 active:scale-95 transition-all text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
}
