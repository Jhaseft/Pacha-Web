"use client";

import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { WithdrawalRequest } from "@/types/withdrawalRequest";
import { apiUpdateWithdrawalStatus } from "@/lib/paymentRequest";
import { WithdrawalDetailStep } from "./WithdrawalDetailStep";
import { WithdrawalRejectStep } from "./WithdrawalRejectStep";
import { WithdrawalApproveStep } from "./WithdrawalApproveStep";

type Step = "detail" | "reject" | "approve";

const stepTitle: Record<Step, string> = {
  detail:  "Detalle de Solicitud",
  reject:  "Motivo de Rechazo",
  approve: "Subir Comprobante",
};

interface Props {
  visible: boolean;
  item: WithdrawalRequest | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function WithdrawalDetailModal({ visible, item, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("detail");
  const [rejectionReason, setRejectionReason] = useState("");
  const [receipt, setReceipt] = useState<{ uri: string; name: string; type: string; file: File } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!visible || !item) return null;

  const reset = () => { setStep("detail"); setRejectionReason(""); setReceipt(null); };
  const handleClose = () => { reset(); onClose(); };

  const handlePickReceipt = (file: File) => {
    setReceipt({ uri: URL.createObjectURL(file), name: file.name, type: file.type, file });
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) return;
    setLoading(true);
    try {
      await apiUpdateWithdrawalStatus(item.id, { status: "REJECTED", rejectionReason });
      reset(); onSuccess();
    } catch (e: any) {
      console.error(e.message);
    } finally { setLoading(false); }
  };

  const handleApproveConfirm = async () => {
    if (!receipt) return;
    setLoading(true);
    try {
      await apiUpdateWithdrawalStatus(item.id, { status: "APPROVED", receipt });
      reset(); onSuccess();
    } catch (e: any) {
      console.error(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div
        className="bg-[#121212] rounded-[40px] px-6 pt-4 pb-6 border border-zinc-800 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 shrink-0">
          <button
            onClick={() => step !== "detail" && setStep("detail")}
            className="p-1"
          >
            <ArrowLeft className={`w-6 h-6 ${step !== "detail" ? "text-white" : "text-transparent"}`} />
          </button>
          <span className="text-white font-black text-lg italic">{stepTitle[step]}</span>
          <button onClick={handleClose} className="bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {step === "detail" && (
          <WithdrawalDetailStep item={item} onReject={() => setStep("reject")} onApprove={() => setStep("approve")} />
        )}
        {step === "reject" && (
          <WithdrawalRejectStep value={rejectionReason} onChange={setRejectionReason} loading={loading} onConfirm={handleRejectConfirm} />
        )}
        {step === "approve" && (
          <WithdrawalApproveStep receipt={receipt} loading={loading} onPickReceipt={handlePickReceipt} onConfirm={handleApproveConfirm} />
        )}
      </div>
    </div>
  );
}
