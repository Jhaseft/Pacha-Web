import Image from 'next/image';
import { Plus, Lock, Star } from 'lucide-react';
import { GalleryItem } from '@/types/perfil';

interface GallerySectionProps {
  gallery: GalleryItem[];
  onAddImage: () => void;
  onSelectImage: (item: GalleryItem) => void;
}

export function GallerySection({ gallery, onAddImage, onSelectImage }: GallerySectionProps) {
  return (
    <div className="pt-2 pb-6">
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
              className={`relative aspect-square rounded-lg overflow-hidden transition group ${
                item.isPremium
                  ? 'ring-2 ring-brand ring-offset-2 ring-offset-white hover:ring-brand/70'
                  : 'hover:opacity-80'
              }`}
            >
              <Image src={item.imageUrl} alt="Gallery" fill className="object-cover" />

              {item.isPremium ? (
                <>
                  {/* Velo suave: la anfitriona ve su foto, pero distingue que es de pago. */}
                  <span className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shadow-md">
                    <Lock size={12} />
                  </span>
                  <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[11px] font-bold text-white flex items-center justify-center gap-1">
                    {item.unlockCredits ?? 0} cr
                  </span>
                </>
              ) : (
                <span className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                  Gratis
                </span>
              )}

              {item.sortOrder === 0 && (
                <span className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md">
                  <Star size={12} fill="currentColor" />
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No hay imágenes en tu galería</p>
        </div>
      )}

      {/* Botón flotante: círculo en móvil, se despliega con texto al pasar el ratón */}
      <button
        onClick={onAddImage}
        aria-label="Agregar foto a la galería"
        className="group fixed bottom-24 md:bottom-8 right-6 md:right-8 z-40 h-14 pl-4 pr-4 rounded-full bg-linear-to-r from-purple-600 to-pink-500 text-white flex items-center gap-0 md:hover:gap-2 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 ring-1 ring-white/20"
      >
        <Plus size={24} strokeWidth={2.5} className="shrink-0 transition-transform duration-300 group-hover:rotate-90" />
        <span className="hidden md:inline-block max-w-0 overflow-hidden whitespace-nowrap font-semibold text-sm transition-all duration-300 group-hover:max-w-40">
          Agregar foto
        </span>
      </button>
    </div>
  );
}
