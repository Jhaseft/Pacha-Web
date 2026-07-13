'use client';

import { X, ImageIcon, Lock, Gem } from 'lucide-react';
import { PublishGalleryForm } from '@/types/perfil';

interface PublishGalleryModalProps {
  visible: boolean;
  previewUrl: string | null;
  form: PublishGalleryForm;
  uploading: boolean;
  error?: string;
  onChangeForm: (patch: Partial<PublishGalleryForm>) => void;
  onClose: () => void;
  onPublish: () => void;
}

export function PublishGalleryModal({
  visible,
  previewUrl,
  form,
  uploading,
  error,
  onChangeForm,
  onClose,
  onPublish,
}: PublishGalleryModalProps) {
  if (!visible) return null;

  return (
    <div
      onClick={uploading ? undefined : onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm my-auto bg-card border border-line rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-canvas-alt border-b border-line px-5 py-4 flex items-center justify-between gap-2">
          <p className="text-ink font-bold text-base">Nueva publicación</p>
          <button
            onClick={onClose}
            disabled={uploading}
            aria-label="Cerrar"
            className="p-1.5 rounded-lg text-ink-faint hover:bg-canvas transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Vista previa */}
          {previewUrl && (
            <div className="w-full h-56 rounded-2xl overflow-hidden border border-line bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Vista previa" className="w-full h-full object-contain" />
            </div>
          )}

          {/* Normal / Exclusiva */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChangeForm({ isPremium: false, unlockCredits: '' })}
              className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-colors ${
                !form.isPremium
                  ? 'bg-[#132673] border-[#132673] text-white'
                  : 'bg-[#132673]/5 border-[#132673]/30 text-[#132673] hover:bg-[#132673]/10'
              }`}
            >
              <ImageIcon size={18} />
              Normal
            </button>

            <button
              type="button"
              onClick={() => onChangeForm({ isPremium: true, unlockCredits: '' })}
              className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-colors ${
                form.isPremium
                  ? 'bg-[#a844f2] border-[#a844f2] text-white'
                  : 'bg-[#a844f2]/5 border-[#a844f2]/30 text-[#a844f2] hover:bg-[#a844f2]/10'
              }`}
            >
              <Lock size={18} />
              Exclusiva
            </button>
          </div>

          {/* Créditos (solo si es exclusiva) */}
          {form.isPremium && (
            <div>
              <p className="text-ink-faint text-xs mb-1 uppercase tracking-widest">
                Créditos para desbloquear
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-line bg-canvas-alt px-4 py-3 focus-within:border-[#a844f2] transition-colors">
                <Gem size={18} color="#f03eb3" className="shrink-0" />
                <input
                  type="number"
                  min={1}
                  step="1"
                  value={form.unlockCredits}
                  onChange={(e) => onChangeForm({ unlockCredits: e.target.value })}
                  placeholder="Ej: 30"
                  className="flex-1 min-w-0 bg-transparent text-ink text-sm font-bold outline-none placeholder:text-ink-faint placeholder:font-normal"
                />
              </div>
            </div>
          )}

          <p className="text-ink-faint text-xs text-center px-2">
            {form.isPremium
              ? 'Los usuarios necesitarán créditos para ver esta foto en tu perfil.'
              : 'Esta foto será visible de forma gratuita en tu perfil.'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 min-w-0 py-3 rounded-xl border border-[#132673] bg-[#132673]/5 text-[#132673] font-bold text-sm hover:bg-[#132673]/10 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              onClick={onPublish}
              disabled={uploading}
              className="flex-1 min-w-0 py-3 rounded-xl bg-linear-to-r from-[#f03eb3] to-[#a844f2] text-white font-bold text-sm flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50"
            >
              {uploading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                'Publicar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
