'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getPublicHostessProfileByUsername,
  unlockGalleryImage,
  AnfitrioneProfileDetail,
  GalleryImage,
} from '@/lib/hostessService';
import Image from 'next/image';
import { ArrowLeft, Loader2, AlertCircle, Lock, LockOpen, Check, X } from 'lucide-react';
import ImageViewer from '@/components/hostess/ImageViewer';

interface DesbloquearPageProps {
  params: Promise<{ username: string }>;
}

function extractMessage(e: unknown): string {
  if (typeof e === 'object' && e !== null && 'response' in e) {
    const r = (e as { response?: { data?: { message?: unknown; error?: unknown } } }).response;
    const raw = r?.data?.message ?? r?.data?.error;
    if (Array.isArray(raw)) return raw.join(', ');
    if (typeof raw === 'string') return raw;
  }
  return e instanceof Error ? e.message : '';
}

export default function DesbloquearPage({ params }: DesbloquearPageProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [profile, setProfile] = useState<AnfitrioneProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Desbloqueo
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [pending, setPending] = useState<GalleryImage | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [insufficient, setInsufficient] = useState(false);

  useEffect(() => {
    params.then((p) => setUsername(p.username));
  }, [params]);

  useEffect(() => {
    if (!username) return;
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicHostessProfileByUsername(username);
      setProfile(data);
    } catch {
      setError('No se pudo cargar el álbum exclusivo.');
    } finally {
      setLoading(false);
    }
  };

  const premiumImages = profile?.galleryImages.filter((img) => img.isPremium) ?? [];
  const isUnlocked = (img: GalleryImage) =>
    img.isUnlockedByViewer || unlockedIds.has(img.id);
  const lockedCount = premiumImages.filter((img) => !isUnlocked(img)).length;

  const confirmUnlock = async () => {
    if (!pending || !profile) return;
    const img = pending;
    setPending(null);
    setUnlockingId(img.id);
    setActionError(null);
    setInsufficient(false);
    try {
      await unlockGalleryImage(profile.id, img.id);
      setUnlockedIds((prev) => new Set(prev).add(img.id));
    } catch (e) {
      const msg = extractMessage(e);
      const low = msg.toLowerCase();
      if (low.includes('insuf') || low.includes('saldo') || low.includes('credit')) {
        setInsufficient(true);
        setActionError('No tienes créditos suficientes para desbloquear esta foto.');
      } else {
        setActionError(msg || 'No se pudo desbloquear la imagen. Intenta de nuevo.');
      }
    } finally {
      setUnlockingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Loader2 size={32} className="text-brand animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4">
        <AlertCircle size={48} className="text-ink-faint mb-4" />
        <p className="text-ink text-center mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-linear-to-r from-brand to-brand-violet hover:from-brand-strong hover:to-brand text-white px-6 py-2 rounded-full font-bold transition"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* El sidebar (PC) y el bottom-nav (móvil) los aporta el layout raíz.
          Aquí el contenido va en columna tipo vista teléfono. */}
      <div className="max-w-lg mx-auto">
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-line px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-canvas-alt rounded-full transition"
          >
            <ArrowLeft size={22} className="text-ink" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-ink font-bold truncate">{profile?.name}</h1>
            <p className="text-ink-faint text-xs">
              Galería Exclusiva · {lockedCount} foto{lockedCount !== 1 ? 's' : ''} bloqueada{lockedCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Aviso de error de acción (p. ej. saldo insuficiente) */}
        {actionError && (
          <div className="mx-4 mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-red-600 text-sm flex-1">{actionError}</p>
            {insufficient && (
              <Link
                href="/dashboard/creditos"
                className="bg-linear-to-r from-brand to-brand-violet text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
              >
                Recargar
              </Link>
            )}
            <button onClick={() => setActionError(null)} className="text-ink-faint hover:text-ink shrink-0">
              <X size={16} />
            </button>
          </div>
        )}

        {premiumImages.length === 0 ? (
          <div className="text-center py-20 px-6">
            <p className="text-ink-faint text-sm">No hay contenido exclusivo por el momento.</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 gap-2">
            {premiumImages.map((img) => {
              const unlocked = isUnlocked(img);
              const busy = unlockingId === img.id;
              return (
                <button
                  key={img.id}
                  onClick={() =>
                    unlocked ? setViewingImage(img.imageUrl) : !busy && setPending(img)
                  }
                  disabled={busy}
                  className="relative aspect-square rounded-lg overflow-hidden bg-canvas-alt group"
                >
                  <Image
                    src={img.imageUrl}
                    alt={unlocked ? 'Contenido exclusivo' : 'Contenido bloqueado'}
                    fill
                    sizes="(max-width: 512px) 50vw, 256px"
                    className={
                      unlocked
                        ? 'object-cover'
                        : 'object-cover blur-xl scale-125 select-none'
                    }
                  />

                  {unlocked ? (
                    <span className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow">
                      <Check size={12} className="text-white" />
                    </span>
                  ) : (
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                      {busy ? (
                        <Loader2 size={26} className="text-white animate-spin" />
                      ) : (
                        <>
                          <Lock size={30} className="text-white mb-1" />
                          {img.unlockCredits != null && (
                            <p className="text-white text-xs font-semibold">{img.unlockCredits} cr</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de confirmación de desbloqueo */}
      {pending && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
          onClick={() => setPending(null)}
        >
          <div
            className="w-full max-w-sm bg-card rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-44">
              <Image
                src={pending.imageUrl}
                alt=""
                fill
                sizes="360px"
                className="object-cover blur-2xl scale-125 select-none"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="bg-black/50 rounded-full p-4">
                  <LockOpen size={30} className="text-white" />
                </span>
              </div>
            </div>

            <div className="p-5 text-center">
              <h3 className="text-ink font-black text-lg">¿Desbloquear foto?</h3>
              <p className="text-ink-soft text-sm mt-1">
                Se descontarán{' '}
                <span className="text-brand font-bold">
                  {pending.unlockCredits ?? '?'} créditos
                </span>{' '}
                de tu saldo.
              </p>
            </div>

            <div className="flex border-t border-line">
              <button
                onClick={() => setPending(null)}
                className="flex-1 py-4 text-ink-soft font-semibold hover:bg-canvas-alt transition-colors border-r border-line"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUnlock}
                className="flex-1 py-4 text-brand font-black hover:bg-brand-soft transition-colors"
              >
                Desbloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingImage && <ImageViewer uri={viewingImage} onClose={() => setViewingImage(null)} />}
    </div>
  );
}
