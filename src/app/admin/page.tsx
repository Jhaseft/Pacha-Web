"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StatCard } from "../../components/admin/StatCard";
import { PlanItem } from "../../components/admin/PlanItem";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";
import { apiGetAllPackages, apiDeletePackage } from "../../lib/packages";
import { useEffect } from "react";
import { PackageData } from "@/types/package";
import { apiCountPendingWithdrawalRequests } from "@/lib/withdrawalRequest";

export default function AdminPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [stats, setStats] = useState({
    ganancias: 1202,
    solicitudesAnf: 8,
    solicitudesPago: 0,
    anfitrionas: 13,
    compras: 48,
  });

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGetAllPackages();
      setPackages(data);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWithdrawalCount = useCallback(async () => {
    try {
      const count = await apiCountPendingWithdrawalRequests();
      setStats((prev) => ({ ...prev, solicitudesPago: count }));
    } catch (e: any) {
      console.error(e.message);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
    fetchWithdrawalCount();
  }, [fetchPackages, fetchWithdrawalCount]);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await apiDeletePackage(deleteId);
      fetchPackages();
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setConfirmVisible(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="bg-[#A11213] p-3 rounded-2xl mb-4 text-center">
        <h1 className="text-white text-2xl font-black tracking-tight">Bienvenido Administrador</h1>
      </div>


      <div className="bg-[#A11213] border border-white/20 p-4 rounded-[30px] mb-4 text-center">
        <p className="text-white text-lg font-bold italic mb-1">Ganancias acumuladas</p>
        <span className="text-green-500 text-4xl font-black">{stats.ganancias} $</span>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          title="Solicitud anfitrionas"
          value={stats.solicitudesAnf}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" /></svg>}
        />
        <StatCard
          title="Solicitudes de pago"
          value={stats.solicitudesPago}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          onClick={() => router.push("/admin/withdrawalRequest/list")}
        />
        <StatCard
          title="Anfitrionas"
          value={stats.anfitrionas}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
          color="#3b82f6"
          onClick={() => router.push("/admin/anfitrionas")}
        />
        <StatCard
          title="Solicitudes de compra"
          value={stats.compras}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>}
          color="#8b5cf6"
        />
      </div>


      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/admin/createPackage"
          className="bg-red-800 hover:bg-red-700 flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Crear paquete
        </Link>
        <Link
          href="/admin/historyPayment"
          className="bg-[#1a1a1a] border border-gray-800 hover:border-gray-600 flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
          Ver pagos
        </Link>
      </div>


      <h2 className="text-white text-xl font-black mb-3 italic tracking-tight uppercase">
        Paquetes de Suscripción
      </h2>

      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="w-8 h-8 border-2 border-[#A11213] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        packages.map((item) => (
          <PlanItem
            key={item.id}
            name={item.name}
            credits={item.credits}
            price={Number(item.price)}
            onEdit={() => router.push(`/admin/editPackage?id=${item.id}`)}
            onDelete={() => handleDelete(item.id!)}
          />
        ))
      )}

      <ConfirmDialog
        visible={confirmVisible}
        title="Eliminar paquete"
        message="¿Estás seguro de que deseas eliminar este paquete?"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
