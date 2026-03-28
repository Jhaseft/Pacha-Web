"use client";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

export function StatCard({ title, value, icon, color = "#A11213", onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex flex-col gap-2 ${onClick ? "cursor-pointer hover:border-gray-600 transition-colors" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <span className="text-white text-3xl font-black">{value}</span>
    </div>
  );
}
