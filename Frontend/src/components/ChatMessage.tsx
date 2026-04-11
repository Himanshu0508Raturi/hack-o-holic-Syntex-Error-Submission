import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMsg } from "@/hooks/useChat";

export function ChatMessage({ message }: { message: ChatMsg }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="gradient-bg rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isUser ? "bg-primary text-primary-foreground" : "glass"}`}>
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="bg-secondary rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-start">
      <div className="gradient-bg rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="glass rounded-2xl px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span key={i} className="block h-2 w-2 rounded-full bg-primary animate-typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </motion.div>
  );
}
