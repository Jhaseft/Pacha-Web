"use client";

import Image from "next/image";
import type { HistoryFeedItem } from "../../lib/hostessService";

export default function StoriesBar({
  stories,
  onSelect,
}: {
  stories: HistoryFeedItem[];
  onSelect: (item: HistoryFeedItem) => void;
}) {
  if (!stories.length) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 px-1">
      {stories.map((item) => (
        <button
          key={item.userId}
          onClick={() => onSelect(item)}
          className="flex flex-col items-center gap-1.5 shrink-0 w-[68px]"
        >
          <span className="p-[2.5px] rounded-full bg-linear-to-tr from-brand via-brand-violet to-brand-strong">
            <span className="block p-[2px] rounded-full bg-canvas">
              <span className="relative block w-14 h-14 rounded-full overflow-hidden bg-canvas-alt">
                {item.avatar && (
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </span>
            </span>
          </span>
          <span className="text-ink-soft text-[11px] font-medium truncate max-w-full">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
}
