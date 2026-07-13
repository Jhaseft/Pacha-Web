'use client';

import { useEffect } from 'react';
import { X, Trash2, Lock } from 'lucide-react';
import { HistoryItem } from '@/types/perfil';

interface StoryViewerModalProps {
  story: HistoryItem | null;
  onClose: () => void;
  onDelete: (storyId: string) => void;
}

export function StoryViewerModal({ story, onClose, onDelete }: StoryViewerModalProps) {
  // Esc para cerrar: en escritorio es lo que la gente espera de un visor.
  useEffect(() => {
    if (!story) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [story, onClose]);

  if (!story) return null;

  const isVideo = story.mediaType?.toUpperCase() === 'VIDEO';
  const isPaid = story.priceCredits > 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      {/* Acciones */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(story.id);
          }}
          aria-label="Eliminar historia"
          className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-red-500 flex items-center justify-center transition-colors"
        >
          <Trash2 size={22} />
        </button>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Precio */}
      {isPaid && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-white text-sm font-bold">
          <Lock size={14} />
          {story.priceCredits} cr
        </div>
      )}

      {/* Contenido */}
      <div onClick={(e) => e.stopPropagation()} className="w-full h-full flex items-center justify-center p-4">
        {isVideo ? (
          <video
            key={story.id}
            src={story.mediaUrl}
            className="max-w-full max-h-full object-contain"
            autoPlay
            controls
            playsInline
            onEnded={onClose}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={story.mediaUrl}
            alt="Historia"
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>
    </div>
  );
}
