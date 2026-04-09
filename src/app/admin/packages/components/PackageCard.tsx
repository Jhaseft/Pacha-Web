"use client";

import { Package, Pencil, Trash2, Gem} from "lucide-react";
import { PackageData } from "@/types/package";

interface PackageCardProps {
  pkg: PackageData;
  onEdit: (pkg: PackageData) => void;
  onDelete: (pkg: PackageData) => void;
}

export default function PackageCard({ pkg, onEdit, onDelete }: PackageCardProps) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all flex flex-col">
     
      <div className="bg-linear-to-br from-[#A11213]/20 to-[#7a0d0e]/10 px-5 pt-5 pb-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#A11213]/20 border border-[#A11213]/30 flex items-center justify-center shrink-0">
          <Package className="w-6 h-6 text-[#A11213]" strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white font-bold text-base truncate leading-tight">{pkg.name}</p>
          {pkg.isActive !== undefined && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold mt-0.5 px-2 py-0.5 rounded-full
              ${pkg.isActive ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>
              <span className={`w-1 h-1 rounded-full ${pkg.isActive ? "bg-green-400" : "bg-white/20"}`} />
              {pkg.isActive ? "Activo" : "Inactivo"}
            </span>
          )}
        </div>
      </div>

  
      <div className="grid grid-cols-2 divide-x divide-white/5 border-t border-white/5">
        <div className="px-5 py-4">
          <p className="text-white/30 text-[11px] font-semibold uppercase tracking-wider mb-1">Precio</p>
          <p className="text-white font-black text-xl leading-none">
            Soles/ <span>{Number(pkg.price).toFixed(2)}</span>
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-white/30 text-[11px] font-semibold uppercase tracking-wider mb-1">Créditos</p>
          <div className="flex items-center gap-1.5">
            <Gem className="w-4 h-4 text-yellow-400/80" />
            <p className="text-white font-black text-xl leading-none">{pkg.credits}</p>
          </div>
        </div>
      </div>

  
      <div className="flex items-center gap-2 border-t border-white/5 px-4 py-3 mt-auto">
        <button
          onClick={() => onEdit(pkg)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </button>
        <button
          onClick={() => onDelete(pkg)}
          className="flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eliminar
        </button>
      </div>
    </div>
  );
}
