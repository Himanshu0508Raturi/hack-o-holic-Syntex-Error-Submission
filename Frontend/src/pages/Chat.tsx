import { useEffect, useRef } from "react";
import { ChatMessage, TypingIndicator } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import type { ChatSession } from "@/hooks/useChat";

interface ChatPageProps {
  session: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  onSend: (message: string) => void;
}

export default function ChatPage({ session, isLoading, error, onSend }: ChatPageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [session?.messages, isLoading]);

  const hasMessages = session && session.messages.length > 0;

  if (!hasMessages) {
    return <WelcomeScreen onSuggestionClick={onSend} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {session.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      </div>
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
}
