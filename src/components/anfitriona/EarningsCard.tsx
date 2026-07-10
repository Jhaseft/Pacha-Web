interface EarningsCardProps {
  title: string;
  amount: number;
  subtitle?: string;
}

export function EarningsCard({ title, amount, subtitle }: EarningsCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg p-4 border border-purple-700">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-white mb-1">
        ${amount.toFixed(2)}
      </p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}
