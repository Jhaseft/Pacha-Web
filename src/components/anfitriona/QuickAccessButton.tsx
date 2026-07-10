import { LucideIcon } from 'lucide-react';

interface QuickAccessButtonProps {
  icon: LucideIcon;
  label: string;
  badge?: number;
  onClick?: () => void;
}

export function QuickAccessButton({
  icon: Icon,
  label,
  badge,
  onClick,
}: QuickAccessButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors relative"
    >
      <div className="relative">
        <Icon className="w-6 h-6 text-purple-400" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
      <span className="text-xs text-gray-300 text-center">{label}</span>
    </button>
  );
}
