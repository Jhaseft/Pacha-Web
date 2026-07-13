"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { User as UserIcon, ChevronRight, LogOut } from "lucide-react";

export default function PerfilPage() {
  const { user, isHydrated, logout } = useAuth();
  const router = useRouter();
  const [confirmLogout, setConfirmLogout] = useState(false);

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

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const mainItems = [
    { label: "Mis datos", href: "/dashboard/mis-datos" },
    { label: "Billetera", href: "/dashboard/creditos" },
    { label: "Historial", href: "/dashboard/historial" },
    { label: "Mis suscripciones", href: "/dashboard/mis-suscripciones" },
  ];

  const secondaryItems = [
    { label: "Ayuda", href: "/usuario" },
    { label: "Términos y condiciones", href: "/terminos" },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-lg mx-auto px-4">
        <header className="pt-8 pb-6">
          <h1 className="text-ink font-black text-2xl">Perfil</h1>
        </header>

        {/* Resumen del usuario */}
        <div className="flex items-center gap-4 bg-card border border-line rounded-3xl px-5 py-4 mb-4">
          <div className="w-14 h-14 rounded-full border-2 border-brand flex items-center justify-center shrink-0">
            <UserIcon size={30} className="text-brand" />
          </div>
          <div className="min-w-0">
            <p className="text-ink font-bold text-lg truncate">{user.phoneNumber}</p>
            {displayName && <p className="text-brand/80 text-sm truncate">{displayName}</p>}
            {user.email && <p className="text-ink-faint text-xs truncate">{user.email}</p>}
          </div>
        </div>

        {/* Sección principal */}
        <div className="bg-card border border-line rounded-3xl divide-y divide-line mb-4">
          {mainItems.map((item) => (
            <MenuLink key={item.label} href={item.href} label={item.label} />
          ))}
        </div>

    
        <div className="bg-card border border-line rounded-3xl divide-y divide-line mb-6">
          {secondaryItems.map((item) => (
            <MenuLink key={item.label} href={item.href} label={item.label} />
          ))}
        </div>

        <button
          onClick={() => setConfirmLogout(true)}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-4 rounded-2xl transition-colors mb-10"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>

      {/* Confirmación de cierre de sesión */}
      {confirmLogout && (
        <div
          onClick={() => setConfirmLogout(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-card border border-line rounded-3xl p-6"
          >
            <h3 className="text-ink text-lg font-black">Cerrar sesión</h3>
            <p className="text-ink-soft text-sm mt-2">¿Estás seguro de que quieres salir?</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 bg-canvas-alt text-ink font-semibold py-3 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-2xl transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-5 py-4 hover:bg-canvas-alt transition-colors">
      <span className="text-ink text-sm">{label}</span>
      <ChevronRight size={18} className="text-ink-faint ml-auto" />
    </Link>
  );
}
