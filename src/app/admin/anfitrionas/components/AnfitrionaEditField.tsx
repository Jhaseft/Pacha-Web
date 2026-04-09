"use client";

import { User, AlignLeft, Gem, Mail } from "lucide-react";

type IconName = "user" | "text" | "diamond" | "email";

interface Props {
  label: string;
  icon: IconName;
  value: string;
  editing: boolean;
  type?: string;
  multiline?: boolean;
  onChange: (val: string) => void;
  isLast?: boolean;
  error?: string;
}

const ICONS: Record<IconName, React.ReactNode> = {
  user:    <User    size={18} className="text-[#A11B1B]" />,
  text:    <AlignLeft size={18} className="text-[#A11B1B]" />,
  diamond: <Gem     size={18} className="text-[#A11B1B]" />,
  email:   <Mail    size={18} className="text-[#A11B1B]" />,
};

export default function AnfitrionaEditField({ label, icon, value, editing, type = "text", multiline, onChange, isLast, error }: Props) {
  return (
    <div className={`flex ${multiline ? "items-start" : "items-center"} px-4 py-4 gap-3 ${!isLast ? "border-b border-zinc-800" : ""}`}>
      <div className={`w-9 h-9 rounded-xl bg-[#1a0505] flex items-center justify-center shrink-0 ${multiline ? "mt-1" : ""}`}>
        {ICONS[icon]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">{label}</p>
        {editing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={3}
              className="w-full bg-transparent text-white text-[15px] font-semibold border-b border-[#A11B1B] pb-1 outline-none resize-none placeholder-zinc-600"
            />
          ) : (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              type={type}
              className="w-full bg-transparent text-white text-[15px] font-semibold border-b border-[#A11B1B] pb-1 outline-none placeholder-zinc-600"
            />
          )
        ) : (
          <p className="text-white text-[15px] font-semibold break-words">{value || "—"}</p>
        )}
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
}
