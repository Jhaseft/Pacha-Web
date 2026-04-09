"use client";

import { useEffect, useState } from "react";
import { Package, X, AlertTriangle, Gem  } from "lucide-react";
import { PackageData } from "@/types/package";

interface PackageModalProps {
  open: boolean;
  initial?: PackageData | null;
  onClose: () => void;
  onSave: (data: Omit<PackageData, "id" | "isActive">) => Promise<void>;
}

const EMPTY: Omit<PackageData, "id" | "isActive"> = { name: "", credits: 0, price: 0 };

export default function PackageModal({ open, initial, onClose, onSave }: PackageModalProps) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(initial ? { name: initial.name, credits: initial.credits, price: initial.price } : EMPTY);
      setError(null);
    }
  }, [open, initial]);

  if (!open) return null;

  const isEdit = !!initial;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "credits" || name === "price" ? (value === "" ? 0 : Number(value)) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es obligatorio"); return; }
    if (form.credits <= 0) { setError("Los créditos deben ser mayores a 0"); return; }
    if (form.price <= 0) { setError("El precio debe ser mayor a 0"); return; }
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Ocurrió un error inesperado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#A11213]/20 border border-[#A11213]/30 flex items-center justify-center">
              <Package className="w-4.5 h-4.5 text-[#A11213]" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-white font-black text-base">{isEdit ? "Editar paquete" : "Nuevo paquete"}</h2>
              <p className="text-white/30 text-xs">{isEdit ? `Modificando "${initial!.name}"` : "Completa los datos del paquete"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Nombre del paquete</label>
            <input
              name="name"
              type="text"
              placeholder="Ej: Pack Básico"
              value={form.name}
              onChange={handleChange}
              className="bg-[#0d0d0d] border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#A11213]/50 transition-colors text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Precio (Soles)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-bold">S/</span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price === 0 ? "" : form.price}
                  onChange={handleChange}
                  className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl pl-9 pr-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#A11213]/50 transition-colors text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider">Créditos</label>
              <div className="relative">
                <Gem  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400/60" />
                <input
                  name="credits"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="0"
                  value={form.credits === 0 ? "" : form.credits}
                  onChange={handleChange}
                  className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl pl-9 pr-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#A11213]/50 transition-colors text-sm"
                />
              </div>
            </div>
          </div>

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
              ) : isEdit ? "Guardar cambios" : "Crear paquete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
