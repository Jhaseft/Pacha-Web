"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { HistoryFeedItem } from "../../lib/hostessService";

const STORY_MS = 5000;

export default function StoryViewer({
  item,
  onClose,
}: {
  item: HistoryFeedItem;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const stories = item.stories ?? [];
  const current = stories[index];

  // Auto-avance (solo para imágenes; el video avanza al terminar).
  useEffect(() => {
    if (!current || current.mediaType === "VIDEO") return;
    const t = setTimeout(() => next(), STORY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, current]);

  const next = () => {
    setIndex((i) => {
      if (i + 1 >= stories.length) {
        onClose();
        return i;
      }
      return i + 1;
    });
  };
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full max-w-lg h-full sm:h-[90vh] sm:rounded-2xl overflow-hidden">
        {/* Barras de progreso */}
        <div className="absolute top-3 inset-x-3 z-20 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
              <div
                className={`h-full bg-white ${i < index ? "w-full" : i === index ? "w-full" : "w-0"}`}
              />
            </div>
          ))}
        </div>

        {/* Cabecera */}
        <div className="absolute top-6 inset-x-3 z-20 flex items-center gap-2">
          <span className="relative w-9 h-9 rounded-full overflow-hidden bg-surface-card">
            {item.avatar && (
              <Image src={item.avatar} alt={item.name} fill sizes="36px" className="object-cover" />
            )}
          </span>
          <span className="text-white text-sm font-semibold">{item.name}</span>
          <button onClick={onClose} className="ml-auto text-white/80 hover:text-white">
            <X size={26} />
          </button>
        </div>

        {/* Media */}
        {current.mediaType === "VIDEO" ? (
          <video
            key={current.id}
            src={current.mediaUrl}
            autoPlay
            playsInline
            onEnded={next}
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <Image
            key={current.id}
            src={current.mediaUrl}
            alt=""
            fill
            sizes="512px"
            className="object-contain bg-black"
          />
        )}

        {/* Zonas de toque para navegar */}
        <button onClick={prev} className="absolute left-0 top-0 h-full w-1/3 z-10" aria-label="Anterior" />
        <button onClick={next} className="absolute right-0 top-0 h-full w-2/3 z-10" aria-label="Siguiente" />
      </div>
    </div>
  );
}
