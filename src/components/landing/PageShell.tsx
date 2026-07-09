import { Navbar } from "./Navbar";
import { LandingFooter } from "@/components/LandingFooter";
import { AppDownloadButton } from "@/components/AppDownloadButton";

// Envoltura común de las páginas de la landing: navbar fijo + contenido + footer.
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-ink overflow-x-hidden pb-24 md:pb-0">
      <Navbar />
      <main>{children}</main>
      <LandingFooter />
      <AppDownloadButton />
    </div>
  );
}
