import { useState, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  // =========================
  // CREATE SESSION
  // =========================
  const createSession = useCallback(() => {
    const id = crypto.randomUUID();
    const session: ChatSession = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
    return id;
  }, []);

  // =========================
  // DELETE SESSION (FIXED)
  // =========================
  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) {
        const remaining = sessions.filter((s) => s.id !== id);
        setActiveSessionId(remaining.length ? remaining[0].id : null);
      }
    },
    [activeSessionId, sessions]
  );

  // =========================
  // TEXT MESSAGE
  // =========================
  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);

      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        const session: ChatSession = {
          id: sessionId,
          title: content.slice(0, 40),
          messages: [],
          createdAt: new Date(),
        };
        setSessions((prev) => [session, ...prev]);
        setActiveSessionId(sessionId);
      }

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const updated = { ...s, messages: [...s.messages, userMsg] };
          if (s.messages.length === 0) updated.title = content.slice(0, 40);
          return updated;
        })
      );

      setIsLoading(true);

      try {
        const res = await fetch("https://raturihimanshu077-scholarai.hf.space/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: content }),
        });

        if (!res.ok) throw new Error("Failed to get response");

        const data = await res.json();

        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer || "No response received.",
          timestamp: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, messages: [...s.messages, aiMsg] } : s
          )
        );
      } catch {
        setError("Unable to reach CampusAI. The server may be temporarily unavailable.");

        const errMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I couldn't get a response from CampusAI. Please try again in a moment.",
          timestamp: new Date(),
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, messages: [...s.messages, errMsg] } : s
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId]
  );

  // =========================
  // VOICE MESSAGE (IMPROVED)
  // =========================
  const sendAudio = useCallback(
    async (audioBlob: Blob) => {
      setError(null);

      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        const session: ChatSession = {
          id: sessionId,
          title: "Voice Query",
          messages: [],
          createdAt: new Date(),
        };
        setSessions((prev) => [session, ...prev]);
        setActiveSessionId(sessionId);
      }

      // Temporary message
      const tempMsgId = crypto.randomUUID();

      const tempMsg: ChatMessage = {
        id: tempMsgId,
        role: "user",
        content: "🎤 Listening...",
        timestamp: new Date(),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: [...s.messages, tempMsg] }
            : s
        )
      );

      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");

        const res = await fetch("https://raturihimanshu077-scholarai.hf.space/voice", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Voice API failed");

        const data = await res.json();

        const transcription = data.transcribed_text || "Voice input";
        const answer = data.answer || "No response generated.";

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== sessionId) return s;

            const updatedMessages = s.messages.map((msg) =>
              msg.id === tempMsgId
                ? { ...msg, content: transcription }
                : msg
            );

            return {
              ...s,
              messages: [
                ...updatedMessages,
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: answer,
                  timestamp: new Date(),
                },
              ],
            };
          })
        );
      } catch {
        setError("Voice request failed");

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: [
                    ...s.messages,
                    {
                      id: crypto.randomUUID(),
                      role: "assistant",
                      content: "Failed to process voice. Try again.",
                      timestamp: new Date(),
                    },
                  ],
                }
              : s
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId]
  );

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    sendMessage,
    sendAudio,
    deleteSession,
    isLoading,
    error,
  };
}