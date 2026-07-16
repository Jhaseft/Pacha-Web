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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 size={36} className="text-secondary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
        <AlertCircle size={48} className="text-white/40 mb-4" />
        <p className="text-white text-center mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-linear-to-r from-secondary to-purple hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold transition"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface/85 backdrop-blur-md border-b border-surface-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition shrink-0"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>

          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/15 shrink-0">
            <Image
              src={profile?.avatar || profile?.coverImage || '/no_image.svg'}
              alt={profile?.name || ''}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold truncate">{profile?.name}</h1>
            <p className="text-white/50 text-xs flex items-center gap-1">
              <Lock size={11} className="text-secondary" />
              Galería exclusiva · {lockedCount} foto{lockedCount !== 1 ? 's' : ''} bloqueada{lockedCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Aviso de error de acción (p. ej. saldo insuficiente) */}
        {actionError && (
          <div className="mx-4 mt-4 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3">
            <AlertCircle size={18} className="text-red-400 shrink-0" />
            <p className="text-red-300 text-sm flex-1">{actionError}</p>
            {insufficient && (
              <Link
                href="/dashboard/creditos"
                className="bg-linear-to-r from-secondary to-purple text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
              >
                Recargar
              </Link>
            )}
            <button onClick={() => setActionError(null)} className="text-white/40 hover:text-white shrink-0">
              <X size={16} />
            </button>
          </div>
        )}

        {premiumImages.length === 0 ? (
          <div className="text-center py-24 px-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Lock size={24} className="text-white/40" />
            </div>
            <p className="text-white/50 text-sm">No hay contenido exclusivo por el momento.</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-surface-border bg-surface-card"
                >
                  <Image
                    src={img.imageUrl}
                    alt={unlocked ? 'Contenido exclusivo' : 'Contenido bloqueado'}
                    fill
                    sizes="(max-width: 640px) 50vw, 256px"
                    className={
                      unlocked
                        ? 'object-cover group-hover:scale-105 transition duration-300'
                        : 'object-cover blur-md scale-110 select-none'
                    }
                  />

                  {unlocked ? (
                    <span className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1 shadow-lg">
                      <Check size={12} className="text-white" />
                    </span>
                  ) : (
                    <>
                      {/* Capa ligera + degradado inferior */}
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        {busy ? (
                          <Loader2 size={26} className="text-white animate-spin" />
                        ) : (
                          <div className="rounded-full bg-black/40 backdrop-blur-sm p-2.5">
                            <Lock size={20} className="text-white" />
                          </div>
                        )}
                      </div>
                      {!busy && img.unlockCredits != null && (
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-secondary/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
                          {img.unlockCredits} cr
                        </span>
                      )}
                    </>
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
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPending(null)}
        >
          <div
            className="w-full max-w-sm bg-surface-card border border-surface-border rounded-3xl overflow-hidden shadow-2xl"
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
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-linear-to-br from-secondary to-purple rounded-full p-4 shadow-lg shadow-secondary/40">
                  <LockOpen size={30} className="text-white" />
                </span>
              </div>
            </div>

            <div className="p-5 text-center">
              <h3 className="text-white font-black text-lg">¿Desbloquear foto?</h3>
              <p className="text-white/70 text-sm mt-1">
                Se descontarán{' '}
                <span className="text-secondary font-bold">
                  {pending.unlockCredits ?? '?'} créditos
                </span>{' '}
                de tu saldo.
              </p>
            </div>

            <div className="flex border-t border-surface-border">
              <button
                onClick={() => setPending(null)}
                className="flex-1 py-4 text-white/70 font-semibold hover:bg-white/5 transition-colors border-r border-surface-border"
              >
                Cancelar
              </button>
              <button
                onClick={confirmUnlock}
                className="flex-1 py-4 text-secondary font-black hover:bg-secondary/10 transition-colors"
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
