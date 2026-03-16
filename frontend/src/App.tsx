import { BrowserRouter, Routes, Route } from "react-router"
import SignInPage from "./pages/SignInPage.tsx"
import SignUpPage from "./pages/SignUpPage.tsx"
import ChatAppPage from "./pages/ChatAppPage.tsx"
import { Toaster } from "sonner"
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";

function App() {
  const { isDark, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);


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
