"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user, isHydrated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace("/login");
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-white text-3xl font-bold mb-2">
          ¡Hola, {user.firstName ?? "Usuario"}!
        </h1>
        <p className="text-white/70 text-base mb-1">
          {user.email ?? user.phoneNumber}
        </p>
        <span className="inline-block text-xs font-medium bg-red-600 text-white px-3 py-1 rounded-full mb-8">
          {user.role}
        </span>

        <p className="text-white/50 text-sm mb-10">
          El panel web está en construcción.
        </p>

        <button
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="w-full border border-white/30 text-white rounded-full py-3 hover:bg-white/10 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
