"use client";

interface PlanItemProps {
  name: string;
  credits: number;
  price: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlanItem({ name, credits, price, onEdit, onDelete }: PlanItemProps) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex items-center justify-between mb-3">
      <div className="flex flex-col gap-1">
        <span className="text-white font-black text-base">{name}</span>
        <span className="text-gray-400 text-sm">{credits} créditos · <span className="text-green-500 font-bold">${price}</span></span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
