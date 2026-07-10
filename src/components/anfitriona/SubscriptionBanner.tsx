'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, ChevronRight } from 'lucide-react';
import { apiGetMyPlan } from '@/lib/subscriptions';
import type { SubscriptionPlan } from '@/types/subscriptions';
import './SubscriptionBanner.css';

export function SubscriptionBanner() {
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
    <>
      <button
        onClick={() => router.push('/dashboard/subscription')}
        style={{
          width: '100%',
          marginBottom: '2rem',
        }}
        className="subscription-banner-animated-border"
      >
        <div
          className="subscription-banner-animated-border-inner"
          style={{
            borderRadius: '1rem',
            padding: '0.875rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: isActive
              ? 'linear-gradient(to bottom right, #1a1000, #2a1a00, #1a1000)'
              : 'linear-gradient(to bottom right, #141414, #1a1a1a, #141414)',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              backgroundColor: isActive ? '#3a2200' : '#1a1a1a',
            }}
          >
            {loading ? (
              <div
                style={{
                  animation: 'spin 1s linear infinite',
                  borderRadius: '50%',
                  height: '1rem',
                  width: '1rem',
                  border: '2px solid #F6C16A',
                  borderTopColor: 'transparent',
                }}
              />
            ) : (
              <Crown size={22} color={isActive ? '#F6C16A' : '#52525b'} />
            )}
          </div>

          {/* Text */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            {loading ? (
              <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Cargando plan...</p>
            ) : plan ? (
              <>
                <p
                  style={{
                    color: isActive ? '#F6C16A' : '#a1a1aa',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                  }}
                >
                  {isActive ? '✦ Plan activo' : 'Plan inactivo'}
                </p>
                <p style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '0.125rem' }}>
                  {plan.price} créditos / mes
                </p>
              </>
            ) : (
              <>
                <p
                  style={{
                    color: '#d4d4d8',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                  }}
                >
                  Sin plan de suscripción
                </p>
                <p style={{ color: '#71717a', fontSize: '0.75rem', marginTop: '0.125rem' }}>
                  Crea uno para monetizar más 💰
                </p>
              </>
            )}
          </div>

          {/* Badge + Arrow */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.25rem',
              flexShrink: 0,
            }}
          >
            {!loading && plan && (
              <div
                style={{
                  backgroundColor: isActive ? '#F6C16A25' : '#ffffff10',
                  borderColor: isActive ? '#F6C16A50' : '#ffffff15',
                  borderRadius: '9999px',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.125rem',
                  paddingBottom: '0.125rem',
                  border: '1px solid',
                }}
              >
                <span
                  style={{
                    color: isActive ? '#F6C16A' : '#52525b',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {isActive ? '● ON' : '● OFF'}
                </span>
              </div>
            )}
            <ChevronRight size={16} color={isActive ? '#F6C16A60' : '#3f3f46'} />
          </div>
        </div>
      </button>
    </>
  );
}
