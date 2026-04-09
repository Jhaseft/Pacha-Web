"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, AlertTriangle, Package } from "lucide-react";
import { PackageData } from "@/types/package";
import {
  apiGetAllPackages,
  apiCreatePackage,
  apiUpdatePackage,
  apiDeletePackage,
} from "@/lib/packages";
import PackageCard from "./components/PackageCard";
import PackageModal from "./components/PackageModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageData | null>(null);

  const [deletingPkg, setDeletingPkg] = useState<PackageData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetAllPackages();
      setPackages(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Error al cargar los paquetes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  function handleOpenCreate() {
    setEditingPkg(null);
    setModalOpen(true);
  }

  function handleOpenEdit(pkg: PackageData) {
    setEditingPkg(pkg);
    setModalOpen(true);
  }

  async function handleSave(data: Omit<PackageData, "id" | "isActive">) {
    if (editingPkg?.id) {
      const updated = await apiUpdatePackage(editingPkg.id, data);
      setPackages((prev) => prev.map((p) => p.id === editingPkg.id ? { ...p, ...updated } : p));
    } else {
      const created = await apiCreatePackage(data as PackageData);
      setPackages((prev) => [...prev, created]);
    }
  }

  function handleOpenDelete(pkg: PackageData) {
    setDeletingPkg(pkg);
  }

  async function handleConfirmDelete() {
    if (!deletingPkg?.id) return;
    setIsDeleting(true);
    try {
      await apiDeletePackage(deletingPkg.id);
      setPackages((prev) => prev.filter((p) => p.id !== deletingPkg.id));
      setDeletingPkg(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-3xl font-black tracking-tight">Paquetes</h1>
          <p className="text-white/40 text-sm mt-1">Administra los paquetes de créditos disponibles</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#A11213] hover:bg-red-800 text-white font-bold px-5 py-3 rounded-xl transition-all text-sm shrink-0 shadow-lg shadow-[#A11213]/20"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Crear paquete
        </button>
      </div>

      {!loading && packages.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="bg-[#111] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-white/30" />
            <div>
              <p className="text-white/40 text-xs">Total paquetes</p>
              <p className="text-white font-black text-lg leading-tight">{packages.length}</p>
            </div>
          </div>
          <div className="bg-[#111] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <div>
              <p className="text-white/40 text-xs">Activos</p>
              <p className="text-white font-black text-lg leading-tight">
                {packages.filter((p) => p.isActive !== false).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={fetchPackages} className="ml-auto text-red-400 hover:text-red-300 text-xs font-bold underline underline-offset-2">
            Reintentar
          </button>
        </div>
      )}


      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl h-52 animate-pulse" />
          ))}
        </div>
      ) : packages.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <Package className="w-8 h-8 text-white/15" strokeWidth={1.2} />
          </div>
          <div className="text-center">
            <p className="text-white/30 font-semibold">No hay paquetes creados</p>
            <p className="text-white/15 text-sm mt-1">Crea el primer paquete para comenzar</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-[#A11213] hover:bg-red-800 text-white font-bold px-5 py-3 rounded-xl transition-all text-sm mt-2"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Crear paquete
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      <PackageModal
        open={modalOpen}
        initial={editingPkg}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        pkg={deletingPkg}
        deleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingPkg(null)}
      />
    </div>
  );
}
