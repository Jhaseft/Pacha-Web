'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, ImageIcon, Lock, Plus } from 'lucide-react';

export function ImagePicker({
  preview,
  onPick,
  round,
  wide,
}: {
  preview: string | null;
  onPick: (f: File) => void;
  round?: boolean;
  wide?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      className={`relative overflow-hidden border-2 border-dashed border-line bg-brand-soft/30 flex items-center justify-center text-brand-violet ${
        round ? 'w-20 h-20 rounded-full' : wide ? 'w-full h-28 rounded-2xl' : 'w-full h-28 rounded-2xl'
      }`}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
      ) : round ? (
        <Camera className="w-6 h-6" />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <ImageIcon className="w-6 h-6" />
          <span className="text-xs font-semibold">Subir imagen</span>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
    </button>
  );
}

export function MultiImagePicker({
  files,
  onChange,
  premium,
}: {
  files: File[];
  onChange: (f: File[]) => void;
  premium?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    const next = files.map((f) => URL.createObjectURL(f));
    setUrls(next);
    return () => next.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);
  return (
    <div className="grid grid-cols-4 gap-2">
      {files.map((_, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urls[i]} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(files.filter((_, idx) => idx !== i))}
            className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white text-xs"
          >
            ×
          </button>
          {premium && (
            <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 p-0.5 text-white">
              <Lock className="w-3 h-3" />
            </span>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-line bg-brand-soft/30 text-brand-violet"
      >
        <Plus className="w-6 h-6" />
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []);
          if (picked.length) onChange([...files, ...picked]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
