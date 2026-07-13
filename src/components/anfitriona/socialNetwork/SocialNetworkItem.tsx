'use client';

import Image from 'next/image';
import { Link as LinkIcon, Pencil, Trash2 } from 'lucide-react';
import type { SocialLink } from '@/types/socialNetwork';

interface SocialNetworkItemProps {
  item: SocialLink;
  onEdit: (link: SocialLink) => void;
  onDelete: (id: string) => void;
}

export default function SocialNetworkItem({ item, onEdit, onDelete }: SocialNetworkItemProps) {
  const network = item.socialNetwork;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#a844f2]/25 bg-card px-3 py-3 mb-2.5 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-[#a844f2]/10 flex items-center justify-center shrink-0">
        {network?.iconPublicId ? (
          <Image
            src={network.icon}
            alt={network.name}
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
        ) : (
          <LinkIcon size={20} color="#a844f2" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-ink font-semibold text-[13px]">{network?.name || 'Red social'}</p>
        <p className="text-ink-faint text-[11px] mt-0.5 truncate">{item.url}</p>
      </div>

      <button
        type="button"
        onClick={() => onEdit(item)}
        aria-label="Editar"
        className="p-2 rounded-lg hover:bg-[#a844f2]/10 transition-colors"
      >
        <Pencil size={18} color="#a844f2" />
      </button>

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        aria-label="Eliminar"
        className="p-2 rounded-lg hover:bg-[#f03eb3]/10 transition-colors"
      >
        <Trash2 size={18} color="#f03eb3" />
      </button>
    </div>
  );
}
