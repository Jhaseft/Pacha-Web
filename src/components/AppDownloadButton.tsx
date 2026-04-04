const APK_URL =
  "https://github.com/Jhaseft/Pachamama_Frontend/releases/download/apk/application-a1a328cb-2cf5-45ba-8332-c5fe8190b862.1.apk";

export function AppDownloadButton() {
  return (
    <a
      href={APK_URL}
      download
      title="Descargar aplicación Android"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-3
        bg-[#A11213] hover:bg-[#8a0f10] active:scale-95
        text-white font-black
        pl-4 pr-5 py-3.5 rounded-2xl
        shadow-[0_6px_30px_rgba(161,18,19,0.6)]
        hover:shadow-[0_8px_40px_rgba(161,18,19,0.75)]
        transition-all duration-200"
    >
      {/* Android icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 shrink-0"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M17.523 15.341a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-11.046 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM2.1 8.4h19.8A1.1 1.1 0 0 1 23 9.5v6a1.1 1.1 0 0 1-1.1 1.1H21v2.65a.75.75 0 0 1-1.5 0V16.6H4.5v2.65a.75.75 0 0 1-1.5 0V16.6h-.9A1.1 1.1 0 0 1 1 15.5v-6A1.1 1.1 0 0 1 2.1 8.4Zm.9 1.5v5h18v-5H3ZM8.22 2.47a.75.75 0 0 1 1.02-.28L12 3.8l2.76-1.61a.75.75 0 1 1 .75 1.3L13.5 4.8V7.4h-3V4.8L8.5 3.49a.75.75 0 0 1-.28-1.02Z" />
      </svg>

      <span className="flex flex-col leading-tight">
        <span className="text-white/70 text-[10px] font-semibold uppercase tracking-widest leading-none">
          Descargar app
        </span>
        <span className="text-sm leading-tight">Android .apk</span>
      </span>
    </a>
  );
}
