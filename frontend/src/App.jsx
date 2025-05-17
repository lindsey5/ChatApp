import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/login";
import UserLayout from "./layouts/userLayout";
import Chat from "./pages/chat";
import Chatbot from "./pages/chatbot/chatbot";
import Signup from "./pages/auth/signup";
import Settings from "./pages/settings";

function App() {
  return <BrowserRouter>
  <Routes>
        <Route element={<UserLayout />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/" element={<LoginPage />}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />}/>
      </Routes>
  </BrowserRouter>
}

export default App
