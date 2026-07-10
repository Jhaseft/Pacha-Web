import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  amount: number;
  timestamp: string;
}

export function ActivityItem({
  icon: Icon,
  title,
  description,
  amount,
  timestamp,
}: ActivityItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-800 last:border-b-0">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
        <p className="text-sm font-semibold text-green-400">+${amount.toFixed(2)}</p>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
}
