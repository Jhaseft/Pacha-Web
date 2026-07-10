import { AutoplayVideo } from "@/components/AutoplayVideo";

// ▸ Link del video de demostración. Deja "" para ver el marcador de posición.
const VIDEO_INICIO = "/pacha.mp4";

export function VideoSection() {
  return (
    <section className="py-24 px-5 sm:px-8 bg-canvas">
      <div className="max-w-xs mx-auto">
        <div className="text-center mb-10">
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-3">Para nuevos usuarios</p>
          <h2 className="text-ink text-3xl sm:text-4xl font-black tracking-tight">Así funciona la app</h2>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-line shadow-xl shadow-brand/10 bg-card">
          {VIDEO_INICIO ? (
            <AutoplayVideo src={VIDEO_INICIO} className="w-full rounded-2xl" />
          ) : (
            <div className="aspect-9/16 flex flex-col items-center justify-center gap-3 text-ink-faint">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.328l5.603 3.113Z" />
              </svg>
              <p className="text-sm font-medium">Video próximamente</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
