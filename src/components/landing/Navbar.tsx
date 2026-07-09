"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RegisterLink } from "@/components/RegisterLink";
import { MobileMenu } from "@/components/MobileMenu";
import { NAV_LINKS } from "@/lib/navLinks";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo — reemplaza el cuadro "M" por tu <Image src="/logo-monetiza.svg" /> */}
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="https://res.cloudinary.com/dnbklbswg/image/upload/v1783607654/1000040485-removebg-preview_glnmou.png"
            alt="MonetizaLab"
            className="w-9 h-9 object-contain"
          />

          <span className="text-ink font-black text-lg tracking-tight">
            Monetiza<span className="text-brand">Lab</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-soft">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${active ? "text-brand font-semibold" : "hover:text-ink"}`}
              >
                {link.label}
                {active && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-brand" />}
              </Link>
            );
          })}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="text-ink-soft hover:text-ink text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-soft transition-all"
          >
            Iniciar sesión
          </Link>
          <RegisterLink className="bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand text-white text-sm font-black px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-brand/25">
            Quiero ser creador
          </RegisterLink>
        </div>

        <MobileMenu />
      </div>
    </nav>
  );
}
