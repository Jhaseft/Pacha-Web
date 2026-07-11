'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';
import { getAgoraToken } from '@/lib/callsApi';

interface UseAgoraCallOptions {
  channelName: string;
  uid: number;
  isVideo: boolean;
  enabled: boolean;
}

/**
 * Motor de llamadas Agora para web (agora-rtc-sdk-ng).
 * Misma lógica que el hook móvil: se une al canal, publica micrófono
 * (+ cámara en video), suscribe al remoto y expone controles.
 */
export function useAgoraCall({ channelName, uid, isVideo, enabled }: UseAgoraCallOptions) {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const micRef = useRef<IMicrophoneAudioTrack | null>(null);
  const camRef = useRef<ICameraVideoTrack | null>(null);
  const cancelRef = useRef(false);

  const [joined, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState<number | null>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<IRemoteVideoTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    cancelRef.current = false;
    void setup();
    return () => {
      cancelRef.current = true;
      void teardown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  async function setup() {
    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      if (cancelRef.current) return;

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      clientRef.current = client;

      client.on('user-published', async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === 'audio') {
          remoteUser.audioTrack?.play();
          setRemoteUid((prev) => prev ?? (remoteUser.uid as number));
        }
        if (mediaType === 'video') {
          setRemoteVideoTrack(remoteUser.videoTrack ?? null);
          setRemoteUid(remoteUser.uid as number);
        }
      });

      client.on('user-unpublished', (_remoteUser, mediaType) => {
        if (mediaType === 'video') setRemoteVideoTrack(null);
      });

      client.on('user-left', () => {
        setRemoteVideoTrack(null);
        setRemoteUid(null);
      });

      const { token, appId } = await getAgoraToken(channelName, uid);
      if (cancelRef.current) return;

      await client.join(appId, channelName, token, uid);
      if (cancelRef.current) {
        await teardown();
        return;
      }
      setJoined(true);

      const mic = await AgoraRTC.createMicrophoneAudioTrack();
      micRef.current = mic;
      const tracks: (IMicrophoneAudioTrack | ICameraVideoTrack)[] = [mic];

      if (isVideo) {
        const cam = await AgoraRTC.createCameraVideoTrack();
        camRef.current = cam;
        setLocalVideoTrack(cam);
        tracks.push(cam);
      }

      if (cancelRef.current) {
        await teardown();
        return;
      }
      await client.publish(tracks);
    } catch (e) {
      console.error('[Agora] Setup failed:', e);
    }
  }

  async function teardown() {
    try {
      micRef.current?.stop();
      micRef.current?.close();
      camRef.current?.stop();
      camRef.current?.close();
      micRef.current = null;
      camRef.current = null;
      setLocalVideoTrack(null);
      setRemoteVideoTrack(null);
      const client = clientRef.current;
      if (client) {
        await client.leave().catch(() => {});
        client.removeAllListeners();
      }
      clientRef.current = null;
      setJoined(false);
      setRemoteUid(null);
    } catch {
      /* noop */
    }
  }

  function toggleMute() {
    const next = !muted;
    void micRef.current?.setMuted(next);
    setMuted(next);
  }

  function toggleCamera() {
    const next = !cameraOff;
    void camRef.current?.setEnabled(!next);
    setCameraOff(next);
  }

  async function switchCamera() {
    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const cams = await AgoraRTC.getCameras();
      const cam = camRef.current;
      if (!cam || cams.length < 2) return;
      const currentId = cam.getTrackLabel();
      const next = cams.find((c) => c.label !== currentId) ?? cams[0];
      await cam.setDevice(next.deviceId);
    } catch {
      /* noop */
    }
  }

  function leave() {
    cancelRef.current = true;
    void teardown();
  }

  return {
    joined,
    remoteUid,
    remoteVideoTrack,
    localVideoTrack,
    muted,
    cameraOff,
    toggleMute,
    toggleCamera,
    switchCamera,
    leave,
  };
}
