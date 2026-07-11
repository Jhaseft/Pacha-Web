'use client';

import { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  currentImage?: string;
  onImageSelect: (file: File) => void;
  aspectRatio?: 'square' | 'banner';
  hint?: string;
}

export default function ImageUpload({
  label,
  currentImage,
  onImageSelect,
  aspectRatio = 'square',
  hint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isBanner = aspectRatio === 'banner';

  return (
    <div className={isBanner ? 'w-full' : 'flex flex-col items-center'}>
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        </div>
        <label className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {label}
        </label>
      </div>

      {/* Upload Area */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative group w-full focus:outline-none"
      >
        {isBanner ? (
          /* Banner Upload */
          <div className="w-full flex justify-center">
            <div
              className={`relative w-full max-w-xl aspect-video rounded-2xl overflow-hidden transition-all duration-300 ${
                isDragging
                  ? 'border-2 border-purple-500 bg-purple-50/50 shadow-lg'
                  : 'border-2 border-purple-300/50 hover:border-purple-400 hover:shadow-md'
              }`}
            >
              {preview || currentImage ? (
                <>
                  <img
                    src={preview || currentImage}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-xl">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-purple-600" />
                        <span className="text-xs font-semibold text-purple-600">Cambiar portada</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                    <Camera className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-purple-600">Añadir portada</p>
                    <p className="text-xs text-purple-500/70 mt-1">Arrastra o haz clic para subir</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Avatar Upload */
          <div className="relative w-32 h-32 mx-auto">
            <div
              className={`absolute inset-0 rounded-full transition-all duration-300 ${
                isDragging
                  ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-1 shadow-xl'
                  : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-1 group-hover:shadow-xl'
              }`}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                {preview || currentImage ? (
                  <img
                    src={preview || currentImage}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-purple-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Camera Button */}
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full p-3 border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <Camera className="w-5 h-5 text-white" />
            </div>

            {/* Hover Overlay */}
            {preview || currentImage ? (
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </button>

      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Hint Text */}
      {hint && (
        <p className="text-xs text-purple-600/60 mt-3 text-center font-medium">
          {hint}
        </p>
      )}

      {/* Drag Hint */}
      {isBanner && !preview && !currentImage && (
        <p className="text-xs text-purple-500/50 mt-2 text-center">
          O arrastra una imagen aquí
        </p>
      )}
    </div>
  );
}
