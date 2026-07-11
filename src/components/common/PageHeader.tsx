'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
}

export default function PageHeader({ title, description, onBack }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handleBack}
          className="flex-shrink-0 -ml-2 p-1.5 hover:bg-canvas rounded-lg transition-all duration-200 group"
        >
          <ChevronLeft size={28} className="text-brand group-hover:text-brand/80 transition-colors" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-ink">
          {title}
        </h1>
      </div>
      {description && (
        <p className="text-ink-faint text-sm md:text-base ml-10">
          {description}
        </p>
      )}
    </div>
  );
}
