'use client';

import { Link2Off } from 'lucide-react';
import type { SocialLink } from '@/types/socialNetwork';
import SocialNetworkItem from './SocialNetworkItem';

interface SocialNetworkListProps {
  links: SocialLink[];
  loading: boolean;
  onEdit: (link: SocialLink) => void;
  onDelete: (id: string) => void;
}

export default function SocialNetworkList({
  links,
  loading,
  onEdit,
  onDelete,
}: SocialNetworkListProps) {
  return (
    <div>
      <p className="text-[#a844f2] text-base font-semibold mb-3">
        Mis redes sociales ({links.length})
      </p>

      {loading ? (
        <div className="flex justify-center py-5">
          <div className="w-8 h-8 rounded-full border-2 border-[#a844f2] border-t-transparent animate-spin" />
        </div>
      ) : links.length === 0 ? (
        <div className="flex flex-col items-center py-6">
          <Link2Off size={40} className="text-ink-faint/40" />
          <p className="text-ink-faint text-sm mt-2">No tienes redes sociales agregadas</p>
        </div>
      ) : (
        links.map((link) => (
          <SocialNetworkItem key={link.id} item={link} onEdit={onEdit} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}
