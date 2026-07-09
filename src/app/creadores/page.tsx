import { PageShell } from "@/components/landing/PageShell";
import { CreatorsSection } from "@/components/landing/CreatorsSection";

export const metadata = { title: "Creadores · MonetizaLab" };

export default function CreadoresPage() {
  return (
    <PageShell>
      <CreatorsSection />
    </PageShell>
  );
}
