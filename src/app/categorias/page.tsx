import { PageShell } from "@/components/landing/PageShell";
import { CategoriesSection } from "@/components/landing/CategoriesSection";

export const metadata = { title: "Categorías · MonetizaLab" };

export default function CategoriasPage() {
  return (
    <PageShell>
      <CategoriesSection />
    </PageShell>
  );
}
