import Image from "next/image";
import { Phone, Gem, DollarSign, Building2, CreditCard, XCircle, CheckCircle, Copy, Mail } from "lucide-react";
import { WithdrawalRequest } from "@/types/withdrawalRequest";

interface Props {
  item: WithdrawalRequest;
  onReject: () => void;
  onApprove: () => void;
}

export function WithdrawalDetailStep({ item, onReject, onApprove }: Readonly<Props>) {
  const copy = (text: string) => navigator.clipboard.writeText(text);
  const isCrypto = item.methodType === "BYBIT" || item.methodType === "BINANCE";

  return (
    <div className="overflow-y-auto flex-1 pr-1">
      <div className="flex flex-col items-center mb-6">
        <div className="w-28 h-28 rounded-full border-4 border-[#A11213] overflow-hidden shadow-[0_0_20px_rgba(161,18,19,0.6)]">
          <Image
            src={item.anfitriona.anfitrionaProfile?.avatarUrl ?? "/placeholder.png"}
            alt={item.anfitriona.firstName ?? ""}
            width={112}
            height={112}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-white font-black text-xl mt-4 tracking-wide">
          {item.anfitriona.firstName} {item.anfitriona.lastName}
        </p>
        <button
          onClick={() => copy(item.anfitriona.phoneNumber)}
          className="flex items-center gap-1 mt-1 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
        >
          <Phone className="w-3 h-3" />
          {item.anfitriona.phoneNumber}
        </button>
      </div>

      <div className="bg-[#1a0505] border border-[#A11213] rounded-3xl p-5 mb-5 flex flex-col items-center shadow-[0_4px_20px_rgba(161,18,19,0.3)]">
        <p className="text-zinc-500 uppercase tracking-[4px] text-[10px] font-bold mb-3">Créditos Acumulados</p>
        <div className="flex items-center gap-3">
          <Gem className="w-8 h-8 text-red-500" />
          <span className="text-white font-black text-5xl">{item.currentBalance ?? 0}</span>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-zinc-800 rounded-2xl p-4 mb-3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a0505] flex items-center justify-center">
              <Gem className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest">Créditos a canjear</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-red-600 font-black text-2xl">{item.credits}</span>
            <span className="text-red-700 text-xs font-bold uppercase tracking-widest">CRED</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0d1f0d] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest">Valor</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-green-600 font-black text-2xl">{item.payoutAmount.toFixed(2)}</span>
            <span className="text-green-700 text-xs font-bold uppercase tracking-widest">
              {item.payoutCurrency === "USD" ? "USD" : "Soles"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col gap-4">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Cuenta de Destino</p>

        {item.methodType === "PAYPAL" ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center">
                <Mail className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest">PayPal</p>
                <p className="text-white font-bold text-[15px]">{item.paypalEmail}</p>
              </div>
            </div>
            <button onClick={() => copy(item.paypalEmail ?? "")} className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 transition-colors">
              <Copy className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        ) : isCrypto ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest">
                  {item.methodType === "BYBIT" ? "Bybit ID" : "Binance ID"}
                </p>
                <p className="text-white font-bold text-[15px]">{item.accountNumber}</p>
              </div>
            </div>
            <button onClick={() => copy(item.accountNumber ?? "")} className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 transition-colors">
              <Copy className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Banco</p>
                  <p className="text-white font-bold text-[15px]">{item.bankName}</p>
                </div>
              </div>
              <button onClick={() => copy(item.bankName ?? "")} className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 transition-colors">
                <Copy className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest">
                    {item.methodType === "OTHER_BANK" ? "CCI" : "Número de cuenta"}
                  </p>
                  <p className="text-white font-bold text-[15px]">{item.accountNumber}</p>
                </div>
              </div>
              <button onClick={() => copy(item.accountNumber ?? "")} className="bg-zinc-800 p-2 rounded-xl hover:bg-zinc-700 transition-colors">
                <Copy className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={onReject}
          className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <XCircle className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-300 font-black uppercase tracking-widest text-sm">Rechazar</span>
        </button>
        <button
          onClick={onApprove}
          className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 bg-[#A11213] hover:bg-red-800 transition-colors shadow-[0_4px_15px_rgba(161,18,19,0.5)]"
        >
          <CheckCircle className="w-4 h-4 text-white" />
          <span className="text-white font-black uppercase tracking-widest text-sm">Pagar</span>
        </button>
      </div>
    </div>
  );
}
