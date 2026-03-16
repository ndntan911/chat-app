import { BrowserRouter, Routes, Route } from "react-router"
import SignInPage from "./pages/SignInPage.tsx"
import SignUpPage from "./pages/SignUpPage.tsx"
import ChatAppPage from "./pages/ChatAppPage.tsx"
import { Toaster } from "sonner"
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useSocketStore } from "./stores/useSocketStore";
import { useAuthStore } from "./stores/useAuthStore";

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [accessToken]);

  return (
    <>
      <TooltipProvider>
        <Toaster richColors />
        <BrowserRouter>
          <Routes>
            {/* public routes */}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ChatAppPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </>
  )
}

export default App
