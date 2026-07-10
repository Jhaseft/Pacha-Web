import Link from "next/link";
import { PageHeader } from "./PageHeader";
import { ImageSlot } from "./ImageSlot";
import { CtaBanner } from "./CtaBanner";

// Página inventada (no venía en los mockups). Pon las fotos en `img`.
const FILTERS = ["Todos", "Lifestyle", "Fitness", "Gaming", "Belleza", "Música", "Moda", "Tecnología"];

const CREATORS = [
  { name: "Vale López", handle: "@valelopez", category: "Lifestyle", followers: "125K", online: true, img: "" },
  { name: "Camila Torres", handle: "@camitorres", category: "Fitness", followers: "98K", online: false, img: "" },
  { name: "Andrés Ruiz", handle: "@andresruiz", category: "Gaming", followers: "210K", online: true, img: "" },
  { name: "Luciana Mendoza", handle: "@lumendoza", category: "Belleza", followers: "156K", online: false, img: "" },
  { name: "Diego Salas", handle: "@diegosalas", category: "Música", followers: "87K", online: true, img: "" },
  { name: "Sofía Ramírez", handle: "@sofiaramirez", category: "Moda", followers: "143K", online: false, img: "" },
  { name: "Mateo Flores", handle: "@mateoflores", category: "Tecnología", followers: "76K", online: false, img: "" },
  { name: "Renata Ríos", handle: "@renatarios", category: "Viajes", followers: "112K", online: true, img: "" },
];

export function CreatorsSection() {
  return (
    <section className="px-5 sm:px-8 lg:px-20 xl:px-32 pb-24">
      <PageHeader
        badge="Creadores"
        title={<>Descubre a <span className="text-brand">nuestros creadores</span></>}
        subtitle="Conecta con creadores auténticos de toda Latinoamérica. Encuentra a quienes comparten tu pasión y vive experiencias únicas."
      />

      {/* Filtros (decorativos) */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
        {FILTERS.map((f, i) => (
          <span
            key={f}
            className={`text-sm font-semibold rounded-full px-4 py-2 cursor-pointer transition-all ${
              i === 0 ? "bg-brand text-white shadow-lg shadow-brand/25" : "bg-card border border-line text-ink-soft hover:border-brand/40 hover:text-brand"
            }`}
          >
            {f}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {CREATORS.map((c) => (
          <div key={c.handle} className="bg-card border border-line rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-brand/10 hover:border-brand/40 transition-all group">
            <div className="relative overflow-hidden">
              <ImageSlot src={c.img} alt={c.name} ratio="aspect-4/5" note="Foto" />
              {c.online && (
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
              <p className="text-ink-faint text-xs mb-3">{c.handle}</p>
              <div className="flex items-center justify-between text-xs text-ink-soft mb-4">
                <span className="bg-brand-soft text-brand font-bold rounded-full px-2 py-0.5">{c.category}</span>
                <span className="font-semibold">{c.followers} seguidores</span>
              </div>
              <Link
                href="/login/cliente"
                className="block text-center bg-linear-to-r from-brand to-brand-violet text-white text-sm font-black py-2.5 rounded-xl hover:from-brand-strong hover:to-brand transition-all"
              >
                Conectar
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        <CtaBanner
          title="¿Quieres aparecer aquí y monetizar tu comunidad?"
          subtitle="Crea tu perfil de creador gratis y empieza a generar ingresos hoy."
        />
      </div>
    </section>
  );
}
