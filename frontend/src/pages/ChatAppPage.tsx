import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { useWebRTCStore } from "@/stores/userWebRTCStore";
import { useEffect } from "react";
import VideoCallModal from "@/components/videoCallModal/VideoCallModal";

const ChatAppPage = () => {
    const { callState } = useWebRTCStore();

    return (
        <SidebarProvider>
            <AppSidebar />

            <div className="flex h-screen w-full p-2">
                <ChatWindowLayout />
            </div>

            {(callState === 'calling' || callState === 'connected') && (
                <VideoCallModal />
            )}
        </SidebarProvider>
    )
}

export default ChatAppPage