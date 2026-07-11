import Image from 'next/image';
import { Plus } from 'lucide-react';
import { GalleryItem } from '@/types/perfil';

interface GallerySectionProps {
  gallery: GalleryItem[];
  onAddImage: () => void;
  onSelectImage: (item: GalleryItem) => void;
}

export function GallerySection({ gallery, onAddImage, onSelectImage }: GallerySectionProps) {
  return (
    <div className="py-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xs font-bold text-ink/70 uppercase tracking-widest">Mi Galería</h3>
        <div className="flex-1 h-px bg-ink/20" />
      </div>

      {gallery.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {gallery.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectImage(item)}
              className="relative aspect-square rounded-lg overflow-hidden hover:opacity-80 transition group"
            >
              <Image
                src={item.imageUrl}
                alt="Gallery"
                fill
                className="object-cover"
              />
              {item.sortOrder === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-yellow-400 text-lg">⭐</span>
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No hay imágenes en tu galería</p>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={onAddImage}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand hover:bg-brand/90 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition z-40"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
