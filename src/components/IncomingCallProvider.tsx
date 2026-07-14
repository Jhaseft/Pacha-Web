'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Video, PhoneOff } from 'lucide-react';
import { useCallSocket, type IncomingCallData } from '@/hooks/useCallSocket';

/**
 * Listener global de llamadas entrantes (misma lógica que el layout de
 * anfitriona en la app móvil). Se monta en el layout raíz: escucha
 * `incoming_call` por WebSocket y muestra un modal para aceptar/rechazar.
 * Al aceptar, navega a /call en modo receptor para unirse al canal de Agora.
 */
export function IncomingCallProvider() {
  const router = useRouter();
  const callSocket = useCallSocket();
  const [incoming, setIncoming] = useState<IncomingCallData | null>(null);

  useEffect(() => {
    if (!callSocket.socket) return;
    const unsub = callSocket.onIncomingCall((data) => setIncoming(data));
    return () => { unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callSocket.socket]);

  // El cliente colgó antes de que aceptáramos: el backend emite `call_ended` al
  // receptor. Cerramos el modal para que no siga sonando una llamada cancelada.
  useEffect(() => {
    if (!callSocket.socket) return;
    const unsub = callSocket.onCallEnded((data) =>
      setIncoming((prev) => (prev && prev.callId === data.callId ? null : prev)),
    );
    return () => { unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callSocket.socket]);

  // Segunda vía: la web venía cerrada y se abrió al pulsar la notificación, así
  // que el socket nunca vio la llamada. El service worker deja los datos en la
  // URL y desde aquí reconstruimos el modal.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('incomingCall') !== '1') return;

    const callId = params.get('callId');
    const callerId = params.get('callerId');
    if (!callId || !callerId) return;

    setIncoming({
      callId,
      callerId,
      receiverId: params.get('receiverId') ?? '',
      callType: (params.get('callType') as IncomingCallData['callType']) ?? 'CALL',
      callerName: params.get('callerName') || 'Cliente',
      callerAvatar: params.get('callerAvatar') || null,
      pricePerMinute: Number(params.get('pricePerMinute') ?? 0),
    });

    // Limpia la URL: al recargar no debe reaparecer una llamada ya terminada.
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  if (!incoming) return null;

  const isVideo = incoming.callType === 'VIDEO_CALL';
  const initial = (incoming.callerName || '?')[0].toUpperCase();

  const handleAccept = () => {
    callSocket.acceptCall(incoming.callId, incoming.callerId);
    const p = new URLSearchParams({
      mode: 'receive',
      callId: incoming.callId,
      callerId: incoming.callerId,
      name: incoming.callerName,
      avatar: incoming.callerAvatar ?? '',
      callType: incoming.callType,
      price: String(incoming.pricePerMinute),
    });
    setIncoming(null);
    router.push(`/call?${p.toString()}`);
  };

  const handleReject = () => {
    callSocket.rejectCall(incoming.callId, incoming.callerId);
    setIncoming(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/65">
      <div
        className={`w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl px-7 pt-6 pb-10 text-white flex flex-col items-center bg-linear-to-b ${
          isVideo ? 'from-[#0a1a2e] to-[#081520]' : 'from-[#0f1a10] to-[#081008]'
        }`}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mb-7" />

        <div className="flex items-center gap-2 mb-6 text-white/60 text-sm">
          {isVideo ? <Video size={18} /> : <Phone size={18} />}
          <span>{isVideo ? 'Video llamada entrante' : 'Llamada entrante'}</span>
        </div>

        {/* Avatar con anillos */}
        <div className="relative flex items-center justify-center mb-5">
          <span className="absolute w-32 h-32 rounded-full border-2 border-green-400/60 animate-ping" />
          {incoming.callerAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={incoming.callerAvatar}
              alt={incoming.callerName}
              className="w-28 h-28 rounded-full object-cover border-3 border-green-400/50"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-[#1e3a5f] border-3 border-green-400/50 flex items-center justify-center text-4xl font-bold">
              {initial}
            </div>
          )}
        </div>

        <p className="text-2xl font-bold mb-1.5 text-center">{incoming.callerName || 'Cliente'}</p>

        {incoming.pricePerMinute > 0 && (
          <div className="flex items-center gap-1.5 bg-green-400/15 text-green-400 text-[13px] font-semibold px-3.5 py-1.5 rounded-full mb-9">
            {incoming.pricePerMinute} crédito{incoming.pricePerMinute !== 1 ? 's' : ''}/min · tus ganancias
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center gap-2.5">
            <button
              onClick={handleReject}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg shadow-red-600/40 transition-colors"
              aria-label="Rechazar"
            >
              <PhoneOff size={26} />
            </button>
            <span className="text-white/50 text-xs">Rechazar</span>
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <button
              onClick={handleAccept}
              className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center shadow-lg shadow-green-600/40 transition-colors"
              aria-label="Aceptar"
            >
              {isVideo ? <Video size={26} /> : <Phone size={26} />}
            </button>
            <span className="text-white/50 text-xs">Aceptar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
