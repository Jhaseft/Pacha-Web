import Image from "next/image";
import { Upload } from "lucide-react";

interface Props {
  receipt: { uri: string } | null;
  loading: boolean;
  onPickReceipt: (file: File) => void;
  onConfirm: () => void;
}

export function WithdrawalApproveStep({ receipt, loading, onPickReceipt, onConfirm }: Props) {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <p className="text-zinc-400 text-sm">Sube el comprobante de pago para aprobar la solicitud.</p>

      <label className="bg-[#1a1a1a] border border-dashed border-zinc-600 rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-zinc-400 transition-colors">
        <Upload className="w-8 h-8 text-[#A11213]" />
        <span className="text-zinc-400 text-sm">Haz clic para seleccionar imagen</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onPickReceipt(e.target.files[0])}
        />
      </label>

      {receipt && (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-[#A11213]">
          <Image src={receipt.uri} alt="Comprobante" fill className="object-cover" />
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={loading}
        className="bg-[#A11213] py-4 rounded-2xl flex items-center justify-center hover:bg-red-800 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-white font-black uppercase tracking-widest">Confirmar Pago</span>
        )}
      </button>
    </div>
  );
}
