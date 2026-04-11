import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-xl p-4">
      <div className="max-w-3xl mx-auto">
        <div className="glass rounded-2xl flex items-end gap-2 p-2 transition-all focus-within:glow focus-within:border-primary/50">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Ask CampusAI anything..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground min-h-[40px] max-h-[150px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="gradient-bg rounded-xl h-10 w-10 flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send className="h-4 w-4 text-primary-foreground" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">CampusAI may produce inaccurate information. Verify important details.</p>
      </div>
    </div>
  );
}
