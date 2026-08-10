import { PageHeader } from "./PageHeader";
import { CtaBanner } from "./CtaBanner";
import { getActiveCategories } from "@/lib/categories";
import type { CategoryData } from "@/types/category";

/** La landing se regenera cada 30 min; las categorías cambian poco. */
const REVALIDATE_SECONDS = 1800;

// La BD no guarda color por categoría: se asigna uno estable a partir del
// nombre para que la tarjeta conserve su acento visual.
const PALETTE = [
  "#a855f7", "#22c55e", "#ec4899", "#3b82f6", "#f97316", "#f43f5e",
  "#8b5cf6", "#10b981", "#06b6d4", "#6366f1", "#ef4444", "#eab308",
];

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  return PALETTE[hash % PALETTE.length];
}

async function loadCategories(): Promise<CategoryData[]> {
  try {
    return await getActiveCategories({ revalidate: REVALIDATE_SECONDS });
  } catch {
    // Si la API está caída la landing sigue en pie, solo sin el grid.
    return [];
  }
}

export async function CategoriesSection() {
  const categories = await loadCategories();

  return (
    <section className="px-5 sm:px-8 lg:px-20 xl:px-32 pb-24">
      <PageHeader
        badge="Categorías"
        title={<>Explora creadores <span className="text-brand">por categoría</span></>}
        subtitle="Encuentra creadores de contenido en diferentes categorías. Conecta con quienes más te inspiran y disfruta de contenido único."
      />

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((c) => (
            <CategoryCard key={c.id ?? c.name} category={c} />
          ))}
        </div>
      ) : (
        <p className="text-ink-faint text-center max-w-6xl mx-auto py-12">
          Estamos organizando las categorías. Vuelve en un momento.
        </p>
      )}

      <div className="max-w-6xl mx-auto">
        <CtaBanner
          title="¿No encuentras tu categoría? Únete y sé parte de MonetizaLab."
          subtitle="Miles de creadores ya están monetizando su contenido."
        />
      </div>
    </section>
  );
}

function CategoryCard({ category: c }: { category: CategoryData }) {
  const color = colorFor(c.name);

  return (
    <article className="group h-full flex flex-col bg-card border border-line rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/10">
      {/* `icon` en la BD es la URL de la imagen (así lo edita el admin).
          Sin imagen queda solo el fondo teñido con el color de la categoría. */}
      <div className="relative aspect-4/3 overflow-hidden" style={{ backgroundColor: `${color}1a` }}>
        {c.icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.icon}
            alt={c.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        )}

        {/* Velo inferior: da contraste al título sobre cualquier foto. */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Hoy varias categorías vienen en 0: mejor ocultar el badge que mostrar "0 creadores". */}
        {c.creatorsCount != null && c.creatorsCount > 0 && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-ink text-[11px] font-bold rounded-full px-2.5 py-1 shadow-sm">
            <svg className="w-3 h-3 text-brand" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" /></svg>
            {c.creatorsCount} {c.creatorsCount === 1 ? "creador" : "creadores"}
          </span>
        )}

        <h3 className="absolute inset-x-4 bottom-3 text-white font-black text-lg leading-tight drop-shadow-md">
          {c.name}
        </h3>
      </div>

      <div className="flex-1 p-5">
        {/* Acento en el color de la categoría; se alarga al pasar el mouse. */}
        <span
          className="block h-0.5 w-8 rounded-full mb-3 transition-all duration-300 group-hover:w-14"
          style={{ backgroundColor: color }}
        />
        {c.description && (
          <p className="text-ink-soft text-sm leading-relaxed line-clamp-2">{c.description}</p>
        )}
      </div>
    </article>
  );
}
