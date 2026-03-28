interface Props {
  value: string;
  onChange: (text: string) => void;
  loading: boolean;
  onConfirm: () => void;
}

export function WithdrawalRejectStep({ value, onChange, loading, onConfirm }: Props) {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <p className="text-zinc-400 text-sm">Explica el motivo por el cual rechazas esta solicitud.</p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej: El comprobante no es legible..."
        rows={5}
        className="bg-[#1a1a1a] border border-zinc-700 rounded-2xl p-4 text-white placeholder-zinc-600 resize-none focus:outline-none focus:border-zinc-500"
      />

      <button
        onClick={onConfirm}
        disabled={loading}
        className="bg-zinc-800 border border-zinc-700 py-4 rounded-2xl flex items-center justify-center mt-2 hover:bg-zinc-700 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="text-white font-black uppercase tracking-widest">Confirmar Rechazo</span>
        )}
      </button>
    </div>
  );
}
