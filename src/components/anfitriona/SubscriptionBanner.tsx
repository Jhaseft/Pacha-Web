import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, ChevronRight } from 'lucide-react';
import { apiGetMyPlan } from '@/lib/subscriptions';
import type { SubscriptionPlan } from '@/types/subscriptions';
import './subscription-banner.css';

export default function SubscriptionBanner() {
  const router = useRouter();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await apiGetMyPlan();
        setPlan(data);
      } catch (error) {
        console.error('Error fetching subscription plan:', error);
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const isActive = plan?.isActive ?? false;

  return (
    <button
      onClick={() => router.push('/dashboard/subscription')}
      className="w-full mb-8 animated-border-card"
    >
      <div className={`animated-border-card-inner rounded-2xl px-4 py-3.5 flex items-center gap-3 ${
        isActive 
          ? 'bg-gradient-to-br from-[#1a1000] via-[#2a1a00] to-[#1a1000]' 
          : 'bg-gradient-to-br from-[#141414] via-[#1a1a1a] to-[#141414]'
      }`}>
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isActive ? 'bg-[#3a2200]' : 'bg-[#1a1a1a]'
        }`}>
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#F6C16A] border-t-transparent"></div>
          ) : (
            <Crown size={22} color={isActive ? '#F6C16A' : '#52525b'} />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 text-left">
          {loading ? (
            <p className="text-zinc-500 text-sm">Cargando plan...</p>
          ) : plan ? (
            <>
              <p style={{ color: isActive ? '#F6C16A' : '#a1a1aa' }} className="font-bold text-sm">
                {isActive ? '✦ Plan activo' : 'Plan inactivo'}
              </p>
              <p className="text-zinc-500 text-xs mt-0.5">
                {plan.price} créditos / mes
              </p>
            </>
          ) : (
            <>
              <p className="text-zinc-400 font-bold text-sm">Sin plan de suscripción</p>
              <p className="text-zinc-600 text-xs mt-0.5">Crea uno para monetizar más 💰</p>
            </>
          )}
        </div>

        {/* Badge + Arrow */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {!loading && plan && (
            <div style={{
              backgroundColor: isActive ? '#F6C16A25' : '#ffffff10',
              borderColor: isActive ? '#F6C16A50' : '#ffffff15',
            }} className="rounded-full px-2 py-0.5 border">
              <span style={{ color: isActive ? '#F6C16A' : '#52525b' }} className="text-xs font-bold">
                {isActive ? '● ON' : '● OFF'}
              </span>
            </div>
          )}
          <ChevronRight size={16} color={isActive ? '#F6C16A60' : '#3f3f46'} />
        </div>
      </div>
    </button>
  );
}
