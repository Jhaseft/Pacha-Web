import { RegisterLink } from "@/components/RegisterLink";

// Banner morado de llamada a la acción (pie de las secciones Misión / Visión).
export function CtaBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mt-16 rounded-3xl bg-linear-to-r from-brand to-brand-violet px-7 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl shadow-brand/25">
      <div className="flex items-center gap-4 text-center sm:text-left">
        <span className="hidden sm:flex w-12 h-12 shrink-0 rounded-2xl bg-white/15 items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1L12 2Z" /></svg>
        </span>
        <div>
          <p className="text-white font-black text-lg sm:text-xl leading-snug">{title}</p>
          {subtitle && <p className="text-white/80 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
      <RegisterLink className="shrink-0 bg-white text-brand font-black text-sm px-6 py-3.5 rounded-2xl hover:bg-white/90 transition-all flex items-center gap-2 whitespace-nowrap">
        Quiero ser creador
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
      </RegisterLink>
    </div>
  );
}
