'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useState } from 'react';

interface ImageViewerProps {
  uri: string;
  onClose: () => void;
}

export default function ImageViewer({ uri, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState(1);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(1, Math.min(3, prev * delta)));
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 p-2 rounded-full transition z-10"
      >
        <X size={24} className="text-white" />
      </button>

      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ transform: `scale(${scale})`, transition: 'transform 0.2s' }}>
          <Image
            src={uri}
            alt="Viewer"
            width={800}
            height={800}
            className="max-w-full max-h-screen object-contain"
          />
        </div>
      </div>

      <p className="absolute bottom-4 text-gray-400 text-xs text-center w-full">
        Usa la rueda del ratón para hacer zoom
      </p>
    </div>
  );
}
