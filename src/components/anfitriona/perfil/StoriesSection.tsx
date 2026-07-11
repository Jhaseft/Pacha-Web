import Image from 'next/image';
import { HistoryItem } from '@/types/perfil';

interface StoriesSectionProps {
  stories: HistoryItem[];
  onAddStory: () => void;
  onViewStory: (story: HistoryItem) => void;
}

export function StoriesSection({ stories, onAddStory, onViewStory }: StoriesSectionProps) {
  return (
    <div className="py-6">
      <h3 className="text-xs font-bold text-ink/70 uppercase tracking-widest mb-4">Historias (24h)</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {/* Add Story Button */}
        <button
          onClick={onAddStory}
          className="flex-shrink-0 w-18 h-18 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 flex items-center justify-center hover:shadow-lg transition"
        >
          <div className="w-full h-full rounded-full bg-canvas flex items-center justify-center text-2xl font-bold text-brand">
            +
          </div>
        </button>

        {/* Stories */}
        {stories.length > 0 ? (
          stories.map((story) => {
            const isVideo = story.mediaType?.toUpperCase() === 'VIDEO';
            const thumbUri = isVideo
              ? story.mediaUrl.replace('/video/upload/', '/video/upload/so_1/').replace('.mp4', '.jpg')
              : story.mediaUrl;

            return (
              <button
                key={story.id}
                onClick={() => onViewStory(story)}
                className="flex-shrink-0 flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-1 overflow-hidden bg-canvas">
                  <Image
                    src={thumbUri}
                    alt="Story"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {story.priceCredits > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                      🔒
                    </div>
                  )}
                </div>
                <span className="text-xs text-white/40 text-center w-16 truncate">
                  {story.priceCredits > 0 ? `${story.priceCredits} cr` : 'Gratis'}
                </span>
              </button>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center py-8 text-center">
            <div>
              <p className="text-gray-400 text-sm mb-1">Sube una historia y gana más 💰</p>
              <div className="h-px bg-gray-600 w-32 mx-auto" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
