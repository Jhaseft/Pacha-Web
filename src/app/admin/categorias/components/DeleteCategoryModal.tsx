"use client";

import { Trash2 } from "lucide-react";
import { CategoryData } from "@/types/category";

interface DeleteCategoryModalProps {
  category: CategoryData | null;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteCategoryModal({
  category,
  deleting,
  onConfirm,
  onCancel,
}: DeleteCategoryModalProps) {
  if (!category) return null;

  const count = category.creatorsCount ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!deleting ? onCancel : undefined}
      />

      <div className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Trash2 className="w-7 h-7 text-red-400" strokeWidth={1.8} />
        </div>

        <div>
          <h3 className="text-white font-black text-lg">Eliminar categoría</h3>
          <p className="text-white/40 text-sm mt-1">
            ¿Estás seguro que quieres eliminar{" "}
            <span className="text-white/70 font-semibold">
              &quot;{category.name}&quot;
            </span>
            ?
            {count > 0 && (
              <>
                {" "}
                Se quitará de{" "}
                <span className="text-white/70 font-semibold">
                  {count} creador{count === 1 ? "" : "es"}
                </span>
                .
              </>
            )}{" "}
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-3 w-full pt-1">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl border border-white/8 text-white/50 hover:text-white hover:border-white/15 text-sm font-semibold transition-all disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all disabled:opacity-50"
          >
            {deleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Eliminando...
              </>
            ) : (
              "Sí, eliminar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
