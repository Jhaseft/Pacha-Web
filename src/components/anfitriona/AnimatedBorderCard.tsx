import { ReactNode } from 'react';

interface AnimatedBorderCardProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedBorderCard({
  children,
  className = '',
}: AnimatedBorderCardProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
      <div className="relative bg-gray-900 rounded-lg p-4 border border-purple-700">
        {children}
      </div>
    </div>
  );
}
