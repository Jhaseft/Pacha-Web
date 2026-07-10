import { PageShell } from "@/components/landing/PageShell";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";

export const metadata = { title: "Cómo funciona · MonetizaLab" };

export default function ComoFuncionaPage() {
  return (
    <PageShell>
      <HowItWorksSection />
    </PageShell>
  );
}
