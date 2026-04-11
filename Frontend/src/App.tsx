import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { TopNav } from "@/components/TopNav";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme";
import { Toaster } from "@/components/ui/toaster";
import ChatPage from "@/pages/Chat";
import AboutPage from "@/pages/About";
import NotFound from "@/pages/NotFound";

function AppLayout() {
  const chat = useChat();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleNewChat = () => {
    chat.createSession();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <TopNav theme={theme} onToggleTheme={toggleTheme} onNewChat={handleNewChat} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <ChatPage
                session={chat.activeSession}
                isLoading={chat.isLoading}
                error={chat.error}
                onSend={chat.sendMessage}
                onSendAudio={chat.sendAudio}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

const App = () => (
  <BrowserRouter>
    <Toaster />
    <AppLayout />
  </BrowserRouter>
);

export default App;
