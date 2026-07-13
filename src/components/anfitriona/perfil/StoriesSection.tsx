'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Plus, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { HistoryItem } from '@/types/perfil';

interface StoriesSectionProps {
  stories: HistoryItem[];
  onAddStory: () => void;
  onViewStory: (story: HistoryItem) => void;
}

export function StoriesSection({ stories, onAddStory, onViewStory }: StoriesSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Las flechas de escritorio solo aparecen si de verdad hay hacia dónde ir.
  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [stories.length]);

  const scrollBy = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * 240, behavior: 'smooth' });
  };

  return (
    <div className="pt-6 pb-2">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xs font-bold text-ink/70 uppercase tracking-widest">Historias (24h)</h3>
        <div className="flex-1 h-px bg-ink/20" />
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Ver historias anteriores"
            className="hidden md:flex absolute left-0 top-8 -translate-y-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-white border border-line shadow-md items-center justify-center text-ink hover:bg-canvas-alt transition"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Ver más historias"
            className="hidden md:flex absolute right-0 top-8 -translate-y-1/2 translate-x-1/2 z-10 w-8 h-8 rounded-full bg-white border border-line shadow-md items-center justify-center text-ink hover:bg-canvas-alt transition"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-1 -mx-1 px-1"
        >
        {/* Añadir historia */}
        <button
          onClick={onAddStory}
          className="group shrink-0 flex flex-col items-center gap-2"
        >
          <span className="w-17 h-17 rounded-full border-2 border-dashed border-brand/40 bg-brand-soft/50 flex items-center justify-center text-brand transition-all group-hover:border-brand group-hover:bg-brand-soft group-hover:scale-105">
            <Plus size={26} strokeWidth={2.5} />
          </span>
          <span className="text-[11px] font-semibold text-ink-faint">Añadir</span>
        </button>

        {/* Historias */}
        {stories.map((story) => {
          const isVideo = story.mediaType?.toUpperCase() === 'VIDEO';
          const isPaid = story.priceCredits > 0;
          const thumbUri = isVideo
            ? story.mediaUrl.replace('/video/upload/', '/video/upload/so_1/').replace('.mp4', '.jpg')
            : story.mediaUrl;

          return (
            <button
              key={story.id}
              onClick={() => onViewStory(story)}
              className="group shrink-0 flex flex-col items-center gap-2"
            >
              <span className="relative block rounded-full bg-linear-to-tr from-purple-500 via-pink-500 to-amber-400 p-[2.5px] transition-transform group-hover:scale-105">
                <span className="relative block w-17 h-17 rounded-full overflow-hidden bg-canvas ring-2 ring-white">
                  <Image
                    src={thumbUri}
                    alt="Historia"
                    fill
                    sizes="68px"
                    className="object-cover"
                  />
                  {isPaid && (
                    <span className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
                  )}
                </span>

                {isPaid && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Lock size={12} className="text-brand" />
                  </span>
                )}
              </span>

              <span
                className={`text-[11px] font-semibold ${isPaid ? 'text-brand' : 'text-ink-faint'}`}
              >
                {isPaid ? `${story.priceCredits} cr` : 'Gratis'}
              </span>
            </button>
          );
        })}

          {stories.length === 0 && (
            <div className="flex-1 flex items-center min-w-0">
              <p className="text-ink-faint text-sm">Sube una historia y gana más 💰</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
