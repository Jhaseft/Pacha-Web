'use client';

import { useEffect } from 'react';
import { X, Trash2, Star, Lock, ImageIcon } from 'lucide-react';
import { GalleryItem } from '@/types/perfil';

interface GalleryItemViewerProps {
  item: GalleryItem | null;
  onClose: () => void;
  onDelete: (imageId: string) => void;
  onSetFeatured: (imageId: string) => void;
}

export function GalleryItemViewer({
  item,
  onClose,
  onDelete,
  onSetFeatured,
}: GalleryItemViewerProps) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Cerrar */}
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
      >
        <X size={24} />
      </button>

      {/* Imagen */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex-1 flex items-center justify-center p-4 min-h-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt="Foto de la galería"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Barra inferior */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-black/85 border-t border-zinc-800 px-5 py-4 flex flex-col gap-3.5"
      >
        {item.isPremium ? (
          <p className="flex items-center gap-2 text-red-500 text-sm font-semibold">
            <Lock size={16} />
            Foto exclusiva · {item.unlockCredits} créditos para desbloquear
          </p>
        ) : (
          <p className="flex items-center gap-2 text-zinc-400 text-sm">
            <ImageIcon size={16} />
            {item.isVisible === false
              ? 'Foto oculta · no visible en tu perfil'
              : 'Foto normal · visible públicamente'}
          </p>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={() => onSetFeatured(item.id)}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 rounded-xl border border-amber-400 bg-zinc-900 py-2.5 text-amber-400 font-semibold text-sm hover:bg-zinc-800 transition-colors"
          >
            <Star size={18} />
            Del feed
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 rounded-xl border border-red-500 bg-zinc-900 py-2.5 text-red-500 font-semibold text-sm hover:bg-zinc-800 transition-colors"
          >
            <Trash2 size={18} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
