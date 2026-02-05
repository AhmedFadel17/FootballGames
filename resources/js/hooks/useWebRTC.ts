import { useAppDispatch } from '@/store';
import { setUserMuted, setUserSpeaking } from '@/store/slices/roomSlice';
import { useEffect, useRef, useState, useCallback } from 'react';

export const useWebRTC = (channel: any, userId: number | string | undefined) => {
    const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const timeoutRefs = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});
    const iceServers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    const dispatch = useAppDispatch();

    const startAudio = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setLocalStream(stream);
            channel?.whisper('user-audio-ready', { userId });
            return stream;
        } catch (err) {
            console.error("Mic access denied", err);
        }
    }, [channel, userId]);

    const toggleMic = useCallback(() => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            const newMutedState = audioTrack.enabled;
            audioTrack.enabled = !newMutedState;

            channel.whisper('user-mute-toggled', { userId, isMuted: newMutedState });
            dispatch(setUserMuted({ userId: userId!, isMuted: newMutedState }));
            return newMutedState;
        }
    }, [localStream, channel, userId, dispatch]);

    const monitorVolume = useCallback((stream: MediaStream) => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

            if (volume > 30) {
                channel?.whisper('user-speaking', { userId, isSpeaking: true });
                dispatch(setUserSpeaking({ userId: userId!, isSpeaking: true }));

                if (timeoutRefs.current[userId as string]) {
                    clearTimeout(timeoutRefs.current[userId as string]);
                }

                timeoutRefs.current[userId as string] = setTimeout(() => {
                    channel?.whisper('user-speaking', { userId, isSpeaking: false });
                    dispatch(setUserSpeaking({ userId: userId!, isSpeaking: false }));
                }, 1000);
            }
            requestAnimationFrame(checkVolume);
        };
        checkVolume();
    }, [channel, userId, dispatch]);

    const createPeer = useCallback((remoteUserId: string, stream: MediaStream) => {
        const pc = new RTCPeerConnection(iceServers);
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                channel.whisper('webrtc-ice', { candidate: event.candidate, to: remoteUserId, from: userId });
            }
        };

        pc.ontrack = (event) => {
            const audio = new Audio();
            audio.srcObject = event.streams[0];
            audio.play();
        };

        peerConnections.current[remoteUserId] = pc;
        return pc;
    }, [channel, userId]);

    useEffect(() => {
        if (!channel || !localStream || !userId) return;

        channel.listenForWhisper('user-audio-ready', async (data: any) => {
            if (data.userId !== userId) {
                const pc = createPeer(data.userId, localStream);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                channel.whisper('webrtc-offer', { offer, to: data.userId, from: userId });
            }
        });

        channel.listenForWhisper('webrtc-offer', async (data: any) => {
            if (data.to === userId) {
                const pc = createPeer(data.from, localStream);
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                channel.whisper('webrtc-answer', { answer, to: data.from, from: userId });
            }
        });

        channel.listenForWhisper('webrtc-answer', async (data: any) => {
            if (data.to === userId) {
                const pc = peerConnections.current[data.from];

                if (pc && pc.signalingState === "have-local-offer") {
                    try {
                        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                    } catch (err) {
                        console.error("Error setting remote description:", err);
                    }
                } else {
                    console.warn("Received answer in invalid state:", pc?.signalingState);
                }
            }
        });

        channel.listenForWhisper('webrtc-ice', async (data: any) => {
            if (data.to === userId) {
                await peerConnections.current[data.from]?.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        });

        channel.listenForWhisper('user-mute-toggled', (data: any) => {
            dispatch(setUserMuted({ userId: data.userId, isMuted: data.isMuted }));
        });

        channel.listenForWhisper('user-speaking', (data: any) => {
            dispatch(setUserSpeaking({ userId: data.userId, isSpeaking: data.isSpeaking }));
        });

    }, [channel, localStream, userId, dispatch, createPeer]);

    useEffect(() => {
        return () => {
            Object.values(timeoutRefs.current).forEach(timeout => clearTimeout(timeout));
            Object.values(peerConnections.current).forEach(pc => pc.close());
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, [localStream]);

    return { startAudio, localStream, toggleMic, monitorVolume };
};