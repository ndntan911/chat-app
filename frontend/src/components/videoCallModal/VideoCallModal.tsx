import { useWebRTCStore } from "@/stores/userWebRTCStore";

const VideoCallModal = () => {
    const { localVideoRef, remoteVideoRef, callState, startCall, endCall } = useWebRTCStore();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />

            {callState === 'idle' && (
                <button onClick={startCall}>📞 Start Call</button>
            )}
            {callState !== 'idle' && (
                <button onClick={endCall} className="end-btn">🔴 End Call</button>
            )}
        </div>
    );
}

export default VideoCallModal;
