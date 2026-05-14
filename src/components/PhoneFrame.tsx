export function PhoneFrame({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="absolute inset-0 rounded-[3rem] bg-[#A11213]/20 blur-3xl scale-110 pointer-events-none" />
      <div
        className="relative w-56 sm:w-64 bg-[#111] rounded-[3rem] border-[3px] border-white/10 shadow-2xl overflow-hidden"
        style={{ aspectRatio: "9/19" }}
      >
        {/* Status bar */}
        <div className="bg-[#111] flex items-center justify-between px-5 pt-3 pb-1.5">
          <span className="text-white text-[9px] font-semibold">9:41</span>
          <div className="w-14 h-4 bg-black rounded-full border border-white/10" />
          <div className="flex items-center gap-0.5">
            {[6, 10, 14].map((h) => (
              <div key={h} className="w-[3px] rounded-sm bg-white/50" style={{ height: `${h}px` }} />
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
