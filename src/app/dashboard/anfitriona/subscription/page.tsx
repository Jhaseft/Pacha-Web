'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiGetMyPlan, apiUpsertMyPlan, apiToggleMyPlan } from '@/lib/subscriptions';
import type { SubscriptionPlan } from '@/types/subscriptions';
import PageHeader from '@/components/common/PageHeader';
import SubscriptionStatusCard from '@/components/anfitriona/subscription/SubscriptionStatusCard';
import SubscriptionPriceForm from '@/components/anfitriona/subscription/SubscriptionPriceForm';
import SubscriptionEmptyState from '@/components/anfitriona/subscription/SubscriptionEmptyState';

export default function SubscriptionPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuth();

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'ANFITRIONA') {
      router.push('/dashboard');
    }
  }, [isHydrated, isAuthenticated, user?.role, router]);

  // El backend responde 404 cuando la anfitriona aún no creó su plan.
  const loadPlan = useCallback(async () => {
    try {
      setPlan(await apiGetMyPlan());
    } catch {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const handleSave = async (price: number) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await apiUpsertMyPlan(price);
      setSuccess(plan ? 'Precio actualizado correctamente.' : 'Plan creado correctamente.');
      setPlan(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar el plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!plan) return;
    setToggling(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiToggleMyPlan();
      setPlan((prev) => (prev ? { ...prev, isActive: res.isActive } : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cambiar el estado.');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <div className="w-full max-w-lg mx-auto px-4 sm:px-5 py-6 flex-1 flex flex-col">
        <PageHeader title="Suscripciones" description="Gestiona tu plan mensual" />

        {/* Info banner */}
        <div className="rounded-2xl border border-[#a844f2]/25 bg-[#a844f2]/5 p-4 flex items-start gap-3 mb-4">
          <Info size={18} color="#a844f2" className="shrink-0 mt-0.5" />
          <p className="text-ink-faint text-xs leading-5">
            Los clientes que se suscriban pagarán el precio mensual en créditos y tendrán acceso a
            tu contenido exclusivo.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm mb-4">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-4 flex-1">
          {plan ? (
            <SubscriptionStatusCard plan={plan} toggling={toggling} onToggle={handleToggle} />
          ) : (
            <SubscriptionEmptyState />
          )}

          <SubscriptionPriceForm initialPrice={plan?.price} saving={saving} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
