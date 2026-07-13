'use client';

import Image from 'next/image';
import type { SocialNetwork } from '@/types/socialNetwork';

interface SocialNetworkSelectorProps {
  networks: SocialNetwork[];
  selectedNetworkId: string | null;
  onSelect: (networkId: string) => void;
}

export default function SocialNetworkSelector({
  networks,
  selectedNetworkId,
  onSelect,
}: SocialNetworkSelectorProps) {
  return (
    <div>
      <p className="text-ink-faint text-xs mb-2">Red social</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {networks.map((network) => {
          const selected = selectedNetworkId === network.id;
          return (
            <button
              key={network.id}
              type="button"
              onClick={() => onSelect(network.id)}
              aria-pressed={selected}
              className={`min-w-0 flex flex-col items-center gap-1.5 rounded-lg border-2 px-1.5 py-2.5 text-[11px] sm:text-xs font-semibold transition-all ${
                selected
                  ? 'border-[#a844f2] bg-[#a844f2]/10 text-[#a844f2] shadow-md shadow-[#a844f2]/20'
                  : 'border-line bg-card text-ink-faint hover:border-[#a844f2]/50 active:scale-95'
              }`}
            >
              {network.iconPublicId && (
                <Image
                  src={network.icon}
                  alt={network.name}
                  width={40}
                  height={40}
                  className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 object-contain transition-opacity ${
                    selected ? 'opacity-100' : 'opacity-70'
                  }`}
                />
              )}
              <span className="w-full truncate text-center">{network.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
