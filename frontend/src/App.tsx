import { BrowserRouter, Routes, Route } from "react-router"
import SignInPage from "./pages/SignInPage.tsx"
import SignUpPage from "./pages/SignUpPage.tsx"
import ChatAppPage from "./pages/ChatAppPage.tsx"
import { Toaster } from "sonner"

function App() {

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* protected routes */}
          <Route path="/" element={<ChatAppPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
