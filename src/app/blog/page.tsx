import { PageShell } from "@/components/landing/PageShell";
import { BlogSection } from "@/components/landing/BlogSection";

export const metadata = { title: "Blog · MonetizaLab" };

export default function BlogPage() {
  return (
    <PageShell>
      <BlogSection />
    </PageShell>
  );
}
