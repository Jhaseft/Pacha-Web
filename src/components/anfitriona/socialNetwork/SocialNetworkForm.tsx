'use client';

import type { SocialNetwork } from '@/types/socialNetwork';
import SocialNetworkSelector from './SocialNetworkSelector';

interface SocialNetworkFormProps {
  networks: SocialNetwork[];
  selectedNetworkId: string | null;
  url: string;
  editingId: string | null;
  submitting: boolean;
  onNetworkSelect: (networkId: string) => void;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function SocialNetworkForm({
  networks,
  selectedNetworkId,
  url,
  editingId,
  submitting,
  onNetworkSelect,
  onUrlChange,
  onSubmit,
  onCancel,
}: SocialNetworkFormProps) {
  return (
    <div className="mb-6">
      <p className="text-[#a844f2] text-base font-semibold mb-3">
        {editingId ? 'Editar red social' : 'Agregar nueva red social'}
      </p>

      <SocialNetworkSelector
        networks={networks}
        selectedNetworkId={selectedNetworkId}
        onSelect={onNetworkSelect}
      />

      <p className="text-ink-faint text-xs mb-2 mt-4">URL o usuario</p>
      <input
        type="url"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !submitting) onSubmit();
        }}
        placeholder="https://instagram.com/tuusuario"
        className="w-full min-w-0 bg-card border border-line rounded-lg px-3 py-2.5 text-ink text-sm mb-4 outline-none focus:border-[#a844f2] transition-colors placeholder:text-ink-faint"
      />

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1 min-w-0 py-3 rounded-lg border border-[#a844f2] text-[#a844f2] font-semibold text-sm hover:bg-[#a844f2]/10 transition-colors disabled:opacity-50"
        >
          {editingId ? 'Cancelar' : 'Deshacer'}
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 min-w-0 py-3 rounded-lg bg-[#a844f2] text-white font-bold text-sm hover:bg-[#9333ea] transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {submitting ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : editingId ? (
            'Actualizar'
          ) : (
            'Agregar'
          )}
        </button>
      </div>
    </div>
  );
}
