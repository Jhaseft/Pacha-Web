"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  {
    label: "Inicio",
    href: "/admin",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: "Clientes",
    href: "/admin/clientes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    label: "Anfitrionas",
    href: "/admin/anfitrionas",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    label: "Retiros",
    href: "/admin/withdrawalRequest/list",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    label: "Paquetes",
    href: "/admin/packages",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7.5 12 3l9 4.5M3 7.5v9L12 21m-9-13.5L12 12m9-4.5v9L12 21m0-9v9"
        />
      </svg>
    ),
  },
  {
    label: "Historial de pagos",
    href: "/admin/historyPayment",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
  },

];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isHydrated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "ADMIN") { router.replace("/login"); return; }
  }, [isHydrated, user, router]);

  // Cierra el menú mobile al cambiar de ruta
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#A11213] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Cargando panel...</p>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "AD";

  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">

      {/* ── Mobile topbar ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#A11213] flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Image src="/logofull.jpeg" alt="Pachamama" width={32} height={32} className="rounded-lg object-cover ring-2 ring-white/20" />
          <span className="text-white font-black text-base tracking-tight">Pachamama</span>
        </div>
        <button onClick={() => setMenuOpen((v) => !v)} className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </header>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="md:hidden fixed top-14.25 left-0 right-0 z-30 bg-linear-to-b from-[#A11213] to-[#7a0d0e] border-b border-red-800/60 flex flex-col px-3 py-3 shadow-xl">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                  ${isActive ? "bg-white text-[#A11213]" : "text-red-100 hover:bg-white/10 hover:text-white"}`}
              >
                <span className={isActive ? "text-[#A11213]" : ""}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          <div className="h-px bg-white/10 my-2" />
          <button
            onClick={() => { logout(); router.replace("/login"); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-200/80 hover:bg-white/10 hover:text-white transition-colors w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-linear-to-b from-[#A11213] to-[#7a0d0e] shadow-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6">
          <Image src="/logofull.jpeg" alt="Pachamama" width={40} height={40} className="rounded-xl object-cover shadow-lg ring-2 ring-white/20" />
          <div>
            <p className="text-white font-black text-base tracking-tight leading-tight">Pachamama</p>
            <p className="text-red-200/70 text-[10px] font-medium uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <div className="mx-4 h-px bg-white/10 mb-4" />
        <p className="text-red-200/50 text-[10px] font-bold uppercase tracking-widest px-5 mb-2">Menú</p>

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150
                  ${isActive ? "bg-white text-[#A11213] shadow-md" : "text-red-100 hover:bg-white/10 hover:text-white"}`}
              >
                <span className={isActive ? "text-[#A11213]" : ""}>{item.icon}</span>
                {item.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#A11213]" />}
              </Link>
            );
          })}
        </nav>

        {/* User chip + logout */}
        <div className="mx-4 h-px bg-white/10 mt-4 mb-3" />
        <div className="px-3 pb-5 flex flex-col gap-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">
                {user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Administrador"}
              </p>
              <p className="text-red-200/60 text-[10px] truncate">{user.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.replace("/login"); }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-200/70 hover:bg-white/10 hover:text-white transition-all w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop topbar */}
        <header className="hidden md:flex bg-[#111] border-b border-white/5 px-8 py-4 items-center justify-between shrink-0">
          <p className="text-white/40 text-sm">
            {new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white/40 text-xs">Sistema activo</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pt-14.25 md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
