"use client";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ visible, title, message, onCancel, onConfirm }: ConfirmDialogProps) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
        <h2 className="text-white font-black text-lg">{title}</h2>
        <p className="text-gray-400 text-sm">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#A11213] hover:bg-red-800 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
