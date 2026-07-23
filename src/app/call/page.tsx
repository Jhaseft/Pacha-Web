'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, MicOff, Video, VideoOff, SwitchCamera, Phone, Wallet } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCallSocket, type CallType } from '@/hooks/useCallSocket';
import { useAgoraCall } from '@/hooks/useAgoraCall';
import { uidFromUserId } from '@/lib/callsApi';
import { apiGetMyWallet } from '@/lib/flow';

type CallState = 'ringing' | 'connected' | 'rejected' | 'ended';

function CallContent() {
  const { user, token, isHydrated } = useAuth();
  const router = useRouter();
  const search = useSearchParams();

  // Modo receptor: la anfitriona ya aceptó desde el modal de llamada entrante.
  const isReceiver = search.get('mode') === 'receive';
  const callerId = search.get('callerId') ?? '';
  const anfitrionaId = search.get('anfitrionaId') ?? '';
  const otherUserId = isReceiver ? callerId : anfitrionaId;
  const anfitrionaName = search.get('anfitrionaName') ?? search.get('name') ?? 'Creador de contenido';
  const anfitrionaAvatar = search.get('anfitrionaAvatar') ?? search.get('avatar') ?? '';
  const callType = (search.get('callType') ?? 'CALL') as CallType;
  const price = Number(search.get('pricePerMinute') ?? search.get('price') ?? 0);
  const isVideo = callType === 'VIDEO_CALL';

  // A dónde volver al terminar la llamada. Si el perfil lo indicó (returnTo)
  // vamos ahí explícitamente; si no, retrocedemos en el historial.
  const returnTo = search.get('returnTo');
  const goBack = () => {
    if (returnTo && returnTo.startsWith('/')) router.replace(returnTo);
    else router.back();
  };

  const callIdRef = useRef(search.get('callId') || `${user?.id ?? 'anon'}_${Date.now()}`);
  const callId = callIdRef.current;
  const uid = user?.id ? uidFromUserId(user.id) : 0;

  const [callState, setCallState] = useState<CallState>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [billing, setBilling] = useState<{ creditsCharged: number; minutesBilled: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const callSocket = useCallSocket();
  const agora = useAgoraCall({ channelName: callId, uid, isVideo, enabled: callState === 'connected' });

  const endedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remoteRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLDivElement>(null);

  // ── Auth guard ──
  useEffect(() => {
    if (isHydrated && !user) router.replace('/login');
  }, [isHydrated, user, router]);

  // ── Ciclo de vida de la llamada (misma lógica que móvil) ──
  useEffect(() => {
    if (!user?.id || !otherUserId || !callSocket.socket) return;
    let active = true;
    const unsubs: Array<() => void> = [];

    const endNow = (reason: string) => {
      if (endedRef.current) return;
      endedRef.current = true;
      callSocket.endCall(callId, otherUserId);
      agora.leave();
      if (timerRef.current) clearInterval(timerRef.current);
      setToast(reason);
      setCallState('ended');
      setTimeout(goBack, 3500);
    };

    // Eventos comunes a ambos lados una vez conectados.
    const commonListeners = () => {
      unsubs.push(
        callSocket.onCallEnded(() => {
          endedRef.current = true;
          setCallState('ended');
          if (timerRef.current) clearInterval(timerRef.current);
          agora.leave();
          setTimeout(goBack, 3500);
        }),
        callSocket.onCallBilled((d) =>
          setBilling({ creditsCharged: d.creditsCharged, minutesBilled: d.minutesBilled }),
        ),
        callSocket.onCallWarning((d) => {
          if (d.balance <= 0) endNow('Se agotaron tus créditos');
          else setToast(`⚠️ Saldo bajo · te quedan ${d.balance} crédito${d.balance !== 1 ? 's' : ''}`);
        }),
      );
    };

    // Lado receptor (anfitriona): ya aceptó en el modal → conecta directo.
    if (isReceiver) {
      setCallState('connected');
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      commonListeners();
      return () => {
        active = false;
        unsubs.forEach((u) => u());
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }

    // Lado que llama (cliente): solicita la llamada y espera aceptación.
    const setupCaller = () => {
      callSocket.requestCall({
        callId,
        callerId: user.id,
        receiverId: otherUserId,
        callType,
        callerName: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Cliente',
        callerAvatar: null,
        pricePerMinute: price,
      });

      unsubs.push(
        callSocket.onCallAccepted(() => {
          setCallState('connected');
          timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
        }),
        callSocket.onCallRejected(() => {
          setCallState('rejected');
          setTimeout(goBack, 2500);
        }),
      );
      commonListeners();
    };

    const walletPromise = token ? apiGetMyWallet(token) : Promise.reject();
    walletPromise
      .then((w) => {
        if (!active) return;
        if (price > 0 && Number(w.balance) < price) {
          setToast(`Saldo insuficiente · te llevamos a comprar créditos`);
          setTimeout(() => router.replace('/dashboard/creditos'), 2000);
          return;
        }
        setupCaller();
      })
      .catch(() => {
        if (active) setupCaller();
      });

    return () => {
      active = false;
      unsubs.forEach((u) => u());
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, otherUserId, callSocket.socket]);

  // ── Reproducir video remoto / local en sus contenedores ──
  useEffect(() => {
    if (agora.remoteVideoTrack && remoteRef.current) {
      agora.remoteVideoTrack.play(remoteRef.current);
    }
  }, [agora.remoteVideoTrack]);

  useEffect(() => {
    if (agora.localVideoTrack && localRef.current) {
      agora.localVideoTrack.play(localRef.current);
    }
  }, [agora.localVideoTrack]);

  function handleHangUp() {
    if (endedRef.current) return;
    endedRef.current = true;
    callSocket.endCall(callId, otherUserId);
    agora.leave();
    if (timerRef.current) clearInterval(timerRef.current);
    setCallState('ended');
    setTimeout(goBack, 3000);
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  }

  const showVideoBg = isVideo && callState === 'connected' && agora.remoteVideoTrack !== null;
  const showEnded = callState === 'rejected' || callState === 'ended';
  const showAvatar = !isVideo || callState !== 'connected';

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white overflow-hidden select-none">
      {/* Video remoto a pantalla completa */}
      <div ref={remoteRef} className={`absolute inset-0 ${showVideoBg ? '' : 'hidden'}`} />
      {!showVideoBg && (
        <div className="absolute inset-0 bg-linear-to-b from-[#1a0a2e] via-[#0d1a2e] to-neutral-950" />
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 inset-x-4 z-30 bg-red-600/90 backdrop-blur text-white text-sm text-center rounded-xl py-2.5 px-4 shadow-lg">
          {toast}
        </div>
      )}

      {/* PiP video local */}
      {isVideo && callState === 'connected' && (
        <div className="absolute top-16 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-brand z-20 bg-neutral-900 shadow-xl">
          <div ref={localRef} className="w-full h-full [&_video]:object-cover" />
          {agora.cameraOff && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-neutral-900 text-white/50">
              <VideoOff size={26} />
              <span className="text-[10px]">Cámara apagada</span>
            </div>
          )}
          <span className="absolute bottom-1.5 inset-x-0 text-center text-[10px] font-semibold">
            <span className="bg-black/50 px-2 py-0.5 rounded">Tú</span>
          </span>
        </div>
      )}

      {/* Overlay UI */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between py-10 px-6">
        {/* Superior: avatar + nombre + estado */}
        <div className="flex flex-col items-center gap-4 pt-10 text-center">
          {showAvatar && (
            <div className="relative flex items-center justify-center">
              {callState === 'ringing' && (
                <span className="absolute w-40 h-40 rounded-full border-2 border-brand-violet/40 animate-ping" />
              )}
              {anfitrionaAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={anfitrionaAvatar}
                  alt={anfitrionaName}
                  className="w-36 h-36 rounded-full object-cover border-3 border-white/50"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-linear-to-tr from-brand to-brand-violet flex items-center justify-center text-5xl font-black border-3 border-white/40">
                  {(anfitrionaName || '?')[0].toUpperCase()}
                </div>
              )}
            </div>
          )}

          <h1 className="text-2xl font-bold">{anfitrionaName}</h1>

          {callState === 'ringing' && (
            <p className="text-white/70 text-base">Llamando…</p>
          )}
          {callState === 'connected' && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">
                  {isVideo ? 'Videollamada activa' : 'En llamada'}
                </span>
              </div>
              <span className="text-slate-200 text-2xl font-light tracking-widest tabular-nums">
                {fmt(seconds)}
              </span>
              <span className="text-white/40 text-xs">
                {price} crédito{price !== 1 ? 's' : ''}/min
              </span>
            </div>
          )}
        </div>

        {/* Inferior: controles + colgar */}
        <div className="w-full flex flex-col items-center gap-6">
          {callState === 'connected' && (
            <div className="flex items-center justify-center gap-5 flex-wrap">
              <ControlBtn
                icon={agora.muted ? <MicOff size={22} /> : <Mic size={22} />}
                label={agora.muted ? 'Activar' : 'Silenciar'}
                active={agora.muted}
                onClick={agora.toggleMute}
              />
              {isVideo && (
                <>
                  <ControlBtn
                    icon={agora.cameraOff ? <VideoOff size={22} /> : <Video size={22} />}
                    label={agora.cameraOff ? 'Activar cám' : 'Apagar cám'}
                    active={agora.cameraOff}
                    onClick={agora.toggleCamera}
                  />
                  <ControlBtn
                    icon={<SwitchCamera size={22} />}
                    label="Girar"
                    onClick={agora.switchCamera}
                  />
                </>
              )}
            </div>
          )}

          <button
            onClick={handleHangUp}
            className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg shadow-red-600/40 transition-colors"
            aria-label="Colgar"
          >
            <Phone size={30} className="rotate-[135deg]" />
          </button>
        </div>
      </div>

      {/* Overlay fin de llamada */}
      {showEnded && (
        <div className="absolute inset-0 z-40 bg-black/75 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <Phone size={44} className="text-red-500 rotate-[135deg]" />
          <p className="text-xl font-semibold">
            {callState === 'rejected' ? 'Llamada rechazada' : 'Llamada finalizada'}
          </p>
          {seconds > 0 && (
            <p className="text-white/50 text-sm">Duración: {fmt(seconds)}</p>
          )}
          {billing && billing.creditsCharged > 0 && (
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-600/40 rounded-full px-4 py-2 mt-1">
              <Wallet size={16} className="text-red-400" />
              <span className="text-red-400 text-sm font-semibold">
                -{billing.creditsCharged} crédito{billing.creditsCharged !== 1 ? 's' : ''} cobrados
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ControlBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 min-w-16">
      <span
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
          active ? 'bg-white text-neutral-900' : 'bg-white/15 text-white hover:bg-white/25'
        }`}
      >
        {icon}
      </span>
      <span className="text-white/70 text-[11px]">{label}</span>
    </button>
  );
}

export default function CallPage() {
  return (
    <Suspense>
      <CallContent />
    </Suspense>
  );
}
