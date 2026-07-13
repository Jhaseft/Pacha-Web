'use client';

import { useMemo } from 'react';
import { useAppSocket } from '@/context/SocketContext';

export type CallType = 'CALL' | 'VIDEO_CALL';

export interface IncomingCallData {
  callId: string;
  callerId: string;
  receiverId: string;
  callType: CallType;
  callerName: string;
  callerAvatar: string | null;
  pricePerMinute: number;
}

/**
 * Señalización de llamadas por WebSocket sobre la conexión compartida
 * (SocketProvider). Expone emisores/suscriptores del ciclo de vida de la
 * llamada. `socket` se expone para que los efectos dependan de su disponibilidad.
 */
export function useCallSocket() {
  const socket = useAppSocket();

  return useMemo(
    () => ({
      socket,
      requestCall(data: IncomingCallData) {
        socket?.emit('call_request', data);
      },
      acceptCall(callId: string, callerId: string) {
        socket?.emit('call_accepted', { callId, callerId });
      },
      rejectCall(callId: string, callerId: string) {
        socket?.emit('call_rejected', { callId, callerId });
      },
      endCall(callId: string, otherUserId: string) {
        socket?.emit('call_ended', { callId, otherUserId });
      },
      onIncomingCall(cb: (data: IncomingCallData) => void) {
        socket?.on('incoming_call', cb);
        return () => socket?.off('incoming_call', cb);
      },
      onCallRinging(cb: (data: { callId: string }) => void) {
        socket?.on('call_ringing', cb);
        return () => socket?.off('call_ringing', cb);
      },
      onCallAccepted(cb: (data: { callId: string }) => void) {
        socket?.on('call_accepted', cb);
        return () => socket?.off('call_accepted', cb);
      },
      onCallRejected(cb: (data: { callId: string }) => void) {
        socket?.on('call_rejected', cb);
        return () => socket?.off('call_rejected', cb);
      },
      onCallEnded(cb: (data: { callId: string }) => void) {
        socket?.on('call_ended', cb);
        return () => socket?.off('call_ended', cb);
      },
      onCallBilled(
        cb: (data: { creditsCharged: number; minutesBilled: number; durationSeconds: number }) => void,
      ) {
        socket?.on('call_billed', cb);
        return () => socket?.off('call_billed', cb);
      },
      onCallWarning(cb: (data: { balance: number }) => void) {
        socket?.on('call_warning', cb);
        return () => socket?.off('call_warning', cb);
      },
    }),
    [socket],
  );
}
