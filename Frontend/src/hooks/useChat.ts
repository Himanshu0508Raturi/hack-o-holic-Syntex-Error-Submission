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

  const createSession = useCallback(() => {
    const id = crypto.randomUUID();
    const session: ChatSession = { id, title: "New Chat", messages: [], createdAt: new Date() };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
    return id;
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);
      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        const session: ChatSession = { id: sessionId, title: content.slice(0, 40), messages: [], createdAt: new Date() };
        setSessions((prev) => [session, ...prev]);
        setActiveSessionId(sessionId);
      }

      const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content, timestamp: new Date() };

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
        const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: data.answer, timestamp: new Date() };
        setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, aiMsg] } : s)));
      } catch {
        setError("Unable to reach CampusAI. The server may be temporarily unavailable.");
        const errMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I couldn't get a response from CampusAI. The server might be starting up — please try again in a moment.",
          timestamp: new Date(),
        };
        setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, errMsg] } : s)));
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId]
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) setActiveSessionId(sessions.length > 1 ? sessions.find((s) => s.id !== id)?.id || null : null);
    },
    [activeSessionId, sessions]
  );

  return { sessions, activeSession, activeSessionId, setActiveSessionId, createSession, sendMessage, deleteSession, isLoading, error };
}
