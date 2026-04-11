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
  onSendAudio: (audioBlob: Blob) => Promise<void>;
}

export default function ChatPage({
  session,
  isLoading,
  error,
  onSend,
  onSendAudio,
}: ChatPageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ Better scroll trigger
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [session?.messages.length, isLoading]);

  const hasMessages = session && session.messages.length > 0;

  // ✅ Welcome screen (with voice)
  if (!hasMessages) {
    return (
      <WelcomeScreen
        onSuggestionClick={onSend}
        onAudioSend={onSendAudio}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-6">

          {/* ✅ Safe optional chaining */}
          {session?.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* ✅ Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* ✅ Error display */}
          {error && (
            <div className="text-sm text-destructive text-center">
              {error}
            </div>
          )}

        </div>
      </div>

      {/* ⚠️ Currently text-only (voice only in welcome screen) */}
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
}