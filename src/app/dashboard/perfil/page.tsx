"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gem, Mail, Phone, FileText, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function PerfilPage() {
  const { user, isHydrated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "Usuario";
  const initials = (user.firstName?.[0] ?? "U").toUpperCase();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-lg mx-auto px-4">
        <header className="pt-8 pb-6">
          <h1 className="text-ink font-black text-2xl">Perfil</h1>
        </header>

        {/* Tarjeta de usuario */}
        <div className="flex items-center gap-4 bg-card border border-line rounded-3xl p-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-brand to-brand-violet flex items-center justify-center text-white text-2xl font-black shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-ink font-black text-lg truncate">{fullName}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider text-brand bg-brand-soft px-2 py-0.5 rounded-full">
              {user.role === "ANFITRIONA" ? "Anfitriona" : "Cliente"}
            </span>
          </div>
        </div>

        {/* Datos */}
        <div className="bg-card border border-line rounded-3xl divide-y divide-line mb-6">
          <div className="flex items-center gap-3 px-5 py-4">
            <Mail size={18} className="text-ink-faint shrink-0" />
            <span className="text-ink-soft text-sm">Correo</span>
            <span className="text-ink text-sm ml-auto truncate">{user.email ?? "—"}</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <Phone size={18} className="text-ink-faint shrink-0" />
            <span className="text-ink-soft text-sm">Teléfono</span>
            <span className="text-ink text-sm ml-auto truncate">{user.phoneNumber ?? "—"}</span>
          </div>
        </div>

        {/* Accesos */}
        <div className="bg-card border border-line rounded-3xl divide-y divide-line mb-6">
          <MenuLink href="/dashboard/creditos" icon={<Gem size={18} className="text-brand" />} label="Mis créditos" />
          <MenuLink href="/terminos" icon={<FileText size={18} className="text-ink-faint" />} label="Términos y condiciones" />
          <MenuLink href="/usuario" icon={<HelpCircle size={18} className="text-ink-faint" />} label="Ayuda" />
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-4 rounded-2xl transition-colors mb-10"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-5 py-4 hover:bg-canvas-alt transition-colors">
      {icon}
      <span className="text-ink text-sm">{label}</span>
      <ChevronRight size={18} className="text-ink-faint ml-auto" />
    </Link>
  );
}
