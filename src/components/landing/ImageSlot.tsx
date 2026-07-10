// Hueco para TU imagen (teléfono, personas, mundo…). Deja `src=""` para ver el
// marcador de posición mientras subes la tuya. Las tarjetas flotan encima aparte.
export function ImageSlot({
  src,
  alt,
  ratio = "aspect-9/16",
  note = "Aquí va tu imagen",
}: {
  src?: string;
  alt: string;
  ratio?: string;
  note?: string;
}) {
  if (src) {
    return <img src={src} alt={alt} className="w-full rounded-[2rem] object-cover" />;
  }
  return (
    <div
      className={`w-full ${ratio} bg-card border-2 border-dashed border-line rounded-[2rem]
        flex flex-col items-center justify-center gap-3 text-ink-faint shadow-xl shadow-brand/5 text-center px-6`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      <p className="text-sm font-medium">{note}</p>
    </div>
  );
}
