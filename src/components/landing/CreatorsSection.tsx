import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "./PageHeader";
import { ImageSlot } from "./ImageSlot";
import { CtaBanner } from "./CtaBanner";
import { getPublicHostesses, type Anfitriona } from "@/lib/hostesses";

const LIMIT = 8;
/** La landing se regenera cada 5 min en lugar de pegarle a la API por visita. */
const REVALIDATE_SECONDS = 300;

async function loadCreators(): Promise<Anfitriona[]> {
  try {
    const res = await getPublicHostesses(1, LIMIT, { revalidate: REVALIDATE_SECONDS });
    return res.anfitrionas;
  } catch {
    // Si la API está caída la landing sigue en pie, solo sin el grid.
    return [];
  }
}

export async function CreatorsSection() {
  const creators = await loadCreators();

  return (
    <section className="px-5 sm:px-8 lg:px-20 xl:px-32 pb-24">
      <PageHeader
        badge="Creadores"
        title={<>Descubre a <span className="text-brand">nuestros creadores</span></>}
        subtitle="Conecta con creadores auténticos de toda Latinoamérica. Encuentra a quienes comparten tu pasión y vive experiencias únicas."
      />

      {creators.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {creators.map((c) => (
            <CreatorCard key={c.id} creator={c} />
          ))}
        </div>
      ) : (
        <p className="text-ink-faint text-center max-w-6xl mx-auto py-12">
          Estamos preparando nuevos perfiles. Vuelve en un momento.
        </p>
      )}

      <div className="max-w-6xl mx-auto">
        <CtaBanner
          title="¿Quieres aparecer aquí y monetizar tu comunidad?"
          subtitle="Crea tu perfil de creador gratis y empieza a generar ingresos hoy."
        />
      </div>
    </section>
  );
}

function CreatorCard({ creator: c }: { creator: Anfitriona }) {
  const img = c.images[0] || c.avatar;
  const href = c.username
    ? `/@${encodeURIComponent(c.username)}`
    : `/anfitrionas/${c.id}`;

  return (
    <div className="bg-card border border-line rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-brand/10 hover:border-brand/40 transition-all group">
      <div className="relative overflow-hidden">
        {img ? (
          <div className="relative aspect-4/5">
            <Image
              src={img}
              alt={c.name}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        ) : (
          <ImageSlot src="" alt={c.name} ratio="aspect-4/5" note="Foto" />
        )}
        {c.isOnline && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-ink text-[10px] font-bold uppercase tracking-wide">Online</span>
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-0.5">
          <h3 className="text-ink font-black text-base truncate">{c.name}</h3>
          <svg className="w-4 h-4 text-brand shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="m9 20.42-6.21-6.21 2.83-2.83L9 14.77l9.88-9.89 2.83 2.83L9 20.42Z" /></svg>
        </div>
        <p className="text-ink-faint text-xs mb-3 truncate">
          {c.username ? `@${c.username}` : " "}
        </p>
        {/* Muchos perfiles vienen sin tarifa y con 0 likes: no mostramos ceros. */}
        {(c.credits > 0 || c.likesCount > 0) && (
          <div className="flex items-center justify-between text-xs text-ink-soft mb-4">
            {c.credits > 0 && (
              <span className="bg-brand-soft text-brand font-bold rounded-full px-2 py-0.5">
                {c.credits} créditos
              </span>
            )}
            {c.likesCount > 0 && (
              <span className="font-semibold ml-auto">{c.likesCount.toLocaleString()} likes</span>
            )}
          </div>
        )}
        <Link
          href={href}
          className="block text-center bg-linear-to-r from-brand to-brand-violet text-white text-sm font-black py-2.5 rounded-xl hover:from-brand-strong hover:to-brand transition-all"
        >
          Conectar
        </Link>
      </div>
    </div>
  );
}
