'use client';

import { X, CloudUpload, DollarSign } from 'lucide-react';

interface CreateHistoryModalProps {
  visible: boolean;
  file: File | null;
  previewUrl: string | null;
  credits: string;
  uploading: boolean;
  error?: string;
  onChangeCredits: (value: string) => void;
  onClose: () => void;
  onPublish: () => void;
}

export function CreateHistoryModal({
  visible,
  file,
  previewUrl,
  credits,
  uploading,
  error,
  onChangeCredits,
  onClose,
  onPublish,
}: CreateHistoryModalProps) {
  if (!visible) return null;

  const isVideo = file?.type.startsWith('video');

  return (
    <div
      onClick={uploading ? undefined : onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-card border border-line rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#a844f2]/10 to-[#f03eb3]/10 border-b border-[#a844f2]/20 px-4 py-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[#a844f2] font-extrabold text-base tracking-wide">Nueva Historia</p>
            <p className="text-ink-faint text-[10px] mt-0.5">Comparte contenido exclusivo</p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            aria-label="Cerrar"
            className="p-1.5 rounded-lg text-ink-faint hover:bg-canvas-alt transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {/* Vista previa */}
          {previewUrl && (
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#a844f2]/30 bg-black">
              {isVideo ? (
                <video src={previewUrl} className="w-full h-50 object-cover" muted playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Vista previa" className="w-full h-50 object-cover" />
              )}
              <span className="absolute top-2 right-2 bg-black/60 text-[#f03eb3] text-[10px] font-bold px-2 py-1 rounded-lg">
                {isVideo ? '🎥 Video' : '📸 Foto'}
              </span>
            </div>
          )}

          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-soft text-xs font-semibold">💰 Precio</span>
              <span className="text-[#a844f2] text-[11px] font-bold">
                {credits === '0' || credits === '' ? 'Gratis' : `${credits} cr`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-[#a844f2] bg-[#a844f2]/5 px-3 py-2.5">
              <DollarSign size={18} color="#a844f2" className="shrink-0" />
              <input
                type="number"
                min={0}
                step="1"
                value={credits}
                onChange={(e) => onChangeCredits(e.target.value)}
                placeholder="0"
                className="flex-1 min-w-0 bg-transparent text-ink text-sm font-bold outline-none placeholder:text-[#a844f2]/40"
              />
            </div>
          </div>

          {/* Info */}
          <div className="rounded-xl bg-[#a844f2]/10 border-l-[3px] border-[#a844f2] px-2.5 py-2">
            <p className="text-ink-soft text-[10px] leading-[14px]">
              <span className="font-bold text-[#a844f2]">💡</span> Historias con precio = más
              ingresos
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 min-w-0 rounded-xl border border-[#132673] bg-canvas-alt py-2.5 text-[#132673] font-bold text-xs hover:bg-canvas transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onPublish}
              disabled={uploading}
              className="flex-1 min-w-0 rounded-xl bg-gradient-to-r from-[#a844f2] to-[#7209b7] py-2.5 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {uploading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>
                  <CloudUpload size={16} />
                  Publicar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
