"use client";

import { X, Pencil, Save, Loader2 } from "lucide-react";

interface Props {
  editing: boolean;
  saving: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AnfitrionaDetailHeader({ editing, saving, onClose, onEdit, onSave, onCancel }: Props) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 shrink-0">
      <p className="text-white text-base font-black flex-1 min-w-0 truncate">Detalle Anfitriona</p>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={editing ? onSave : onEdit}
          disabled={saving}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50
            ${editing ? "bg-green-700 text-white hover:bg-green-600" : "bg-[#1a1a1a] text-white hover:bg-white/10"}`}
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : editing ? <Save size={13} /> : <Pencil size={13} />}
          {saving ? "Guardando..." : editing ? "Guardar" : "Editar"}
        </button>

        {editing && (
          <button onClick={onCancel} className="flex items-center gap-1.5 bg-red-700 rounded-full px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition-colors">
            <X size={13} />
            Deshacer
          </button>
        )}

        <button onClick={onClose} className="bg-[#1a1a1a] rounded-full p-2 hover:bg-white/10 transition-colors shrink-0">
          <X size={15} className="text-zinc-400" />
        </button>
      </div>
    </div>
  );
}
