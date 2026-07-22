"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, AlertTriangle, Tag, Users, Pencil, Trash2 } from "lucide-react";
import { CategoryData } from "@/types/category";
import {
  apiGetAllCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
} from "@/lib/categories";
import CategoryModal from "./components/CategoryModal";
import DeleteCategoryModal from "./components/DeleteCategoryModal";

export default function CategoriasPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryData | null>(null);

  const [deleting, setDeleting] = useState<CategoryData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? "Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function handleOpenCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function handleOpenEdit(cat: CategoryData) {
    setEditing(cat);
    setModalOpen(true);
  }

  async function handleSave(data: {
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
  }) {
    if (editing?.id) {
      const updated = await apiUpdateCategory(editing.id, data);
      setCategories((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...updated } : c)),
      );
    } else {
      const created = await apiCreateCategory(data);
      setCategories((prev) =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name)),
      );
    }
  }

  async function handleConfirmDelete() {
    if (!deleting?.id) return;
    setIsDeleting(true);
    try {
      await apiDeleteCategory(deleting.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleting.id));
      setDeleting(null);
    } catch (err: any) {
      setError(err?.message ?? "Error al eliminar la categoría");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-white font-black text-2xl md:text-3xl tracking-tight">
            Categorías
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Gestiona las categorías con las que se clasifican los creadores.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A11213] hover:bg-red-800 text-white text-sm font-bold transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nueva categoría</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-[#A11213] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Cargando categorías...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
            <Tag className="w-7 h-7 text-white/30" />
          </div>
          <p className="text-white/50 text-sm font-medium">
            Aún no hay categorías
          </p>
          <button
            onClick={handleOpenCreate}
            className="text-[#A11213] text-sm font-bold hover:underline"
          >
            Crear la primera
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-[#111] border border-white/8 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/15 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center overflow-hidden shrink-0">
                  {cat.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Tag className="w-5 h-5 text-white/30" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold text-sm truncate">
                      {cat.name}
                    </h3>
                    <span
                      className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cat.isActive
                          ? "bg-green-500/15 text-green-400"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {cat.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs mt-0.5 line-clamp-2">
                    {cat.description || "Sin descripción"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-white/40 text-xs">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {cat.creatorsCount ?? 0} creador
                    {(cat.creatorsCount ?? 0) === 1 ? "" : "es"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(cat)}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteCategoryModal
        category={deleting}
        deleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
