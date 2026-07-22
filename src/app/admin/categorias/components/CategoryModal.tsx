"use client";

import { useEffect, useState } from "react";
import { Tag, X, AlertTriangle } from "lucide-react";
import { CategoryData } from "@/types/category";

interface CategoryModalProps {
  open: boolean;
  initial?: CategoryData | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
  }) => Promise<void>;
}

const EMPTY = { name: "", description: "", icon: "", isActive: true };

export default function CategoryModal({
  open,
  initial,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name ?? "",
              description: initial.description ?? "",
              icon: initial.icon ?? "",
              isActive: initial.isActive ?? true,
            }
          : EMPTY,
      );
      setError(null);
    }
  }, [open, initial]);

  if (!open) return null;

  const isEdit = !!initial;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon.trim(),
        isActive: form.isActive,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Ocurrió un error inesperado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#A11213]/20 border border-[#A11213]/30 flex items-center justify-center">
              <Tag className="w-4.5 h-4.5 text-[#A11213]" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-white font-black text-base">
                {isEdit ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <p className="text-white/30 text-xs">
                {isEdit
                  ? `Modificando "${initial!.name}"`
                  : "Completa los datos de la categoría"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">
              Nombre
            </label>
            <input
              name="name"
              type="text"
              placeholder="Ej: Gaming"
              value={form.name}
              onChange={handleChange}
              className="bg-[#0d0d0d] border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#A11213]/50 transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">
              Descripción
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="Ej: Gamers, streams y contenido épico."
              value={form.description}
              onChange={handleChange}
              className="bg-[#0d0d0d] border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#A11213]/50 transition-colors text-sm resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">
              Imagen (URL)
            </label>
            <input
              name="icon"
              type="text"
              placeholder="https://... (opcional)"
              value={form.icon}
              onChange={handleChange}
              className="bg-[#0d0d0d] border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#A11213]/50 transition-colors text-sm"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="w-4 h-4 accent-[#A11213]"
            />
            <span className="text-white/70 text-sm font-medium">
              Categoría activa (visible para los usuarios)
            </span>
          </label>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-400 text-xs font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-3 rounded-xl border border-white/8 text-white/50 hover:text-white hover:border-white/15 text-sm font-semibold transition-all disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#A11213] hover:bg-red-800 text-white text-sm font-bold transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : isEdit ? (
                "Guardar cambios"
              ) : (
                "Crear categoría"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
