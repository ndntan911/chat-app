// useWebRTC.js
import { useSocketStore } from '@/stores/useSocketStore';
import { create } from 'zustand';
import type { WebRTCState } from '@/types/store';
import { createRef } from 'react';

const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export const useWebRTCStore = create<WebRTCState>((set, get) => ({
    localVideoRef: createRef(),
    remoteVideoRef: createRef(),
    pcRef: createRef(),
    callState: 'idle',
    roomId: '',
    getLocalStream: async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            get().localVideoRef.current!.srcObject = stream;
            return stream;
        } catch (error) {
            handleMediaError(error);
            throw error;
        }
    },
    createPeerConnection: (stream: MediaStream) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.ontrack = (e) => { get().remoteVideoRef.current!.srcObject = e.streams[0]; };
        pc.onicecandidate = (e) => {
            if (e.candidate) useSocketStore.getState().socket?.emit('ice-candidate', { roomId: get().roomId, candidate: e.candidate });
        };
        get().pcRef.current = pc;
        return pc;
    },
    startCall: async () => {
        try {
            set({ callState: 'calling' });
            const stream = await get().getLocalStream();
            const pc = get().createPeerConnection(stream);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            useSocketStore.getState().socket?.emit('offer', { roomId: get().roomId, offer });
        } catch (error) {
            console.error('Error starting call:', error);
        }
    },
    endCall: () => {
        get().pcRef.current?.close();
        set({ callState: 'idle' });
    },
    connectWebRTC: (roomId: string) => {
        set({ roomId });
        const socket = useSocketStore.getState().socket;

        socket?.on('offer', async ({ offer }) => {
            const stream = await get().getLocalStream();
            const pc = get().createPeerConnection(stream);
            await pc.setRemoteDescription(offer);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket?.emit('answer', { roomId, answer });
            set({ callState: 'connected' });
        });

        socket?.on('answer', async ({ answer }) => {
            await get().pcRef.current?.setRemoteDescription(answer);
            set({ callState: 'connected' });
        });

        socket?.on('ice-candidate', ({ candidate }) => {
            get().pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
        });
    },
    disconnectWebRTC: () => {
        useSocketStore.getState().socket?.off('offer').off('answer').off('ice-candidate');
    }
}))

const handleMediaError = (err) => {
    switch (err.name) {
        case 'NotFoundError':
        case 'DevicesNotFoundError':
            console.error('No camera/mic found. Check device is connected.');
            alert('No camera or microphone found. Please connect a device and try again.');
            break;
        case 'NotAllowedError':
        case 'PermissionDeniedError':
            console.error('Permission denied by user or browser.');
            alert('Camera/mic access was blocked. Please allow permissions and reload.');
            break;
        case 'NotReadableError':
            console.error('Device is in use by another app.');
            alert('Camera or mic is being used by another application.');
            break;
        case 'OverconstrainedError':
            console.error('Constraints cannot be satisfied:', err.constraint);
            break;
        default:
            console.error('getUserMedia error:', err.name, err.message);
    }
};