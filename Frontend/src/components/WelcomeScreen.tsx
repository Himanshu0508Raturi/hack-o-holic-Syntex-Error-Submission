import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Search, FileText, Bell, BookOpenCheck, DollarSign, Mic, Square } from "lucide-react";

const categories = [
  { icon: FileText, label: "Academics", color: "hsl(var(--category-notes))" },
  { icon: Bell, label: "Notices", color: "hsl(var(--category-notices))" },
  { icon: BookOpenCheck, label: "PYQs", color: "hsl(var(--category-pyqs))" },
  { icon: DollarSign, label: "Fee Structure", color: "hsl(var(--category-syllabus))" },
];

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
  onAudioSend: (audioBlob: Blob) => Promise<void>;
  isLoading: boolean;
}

export function WelcomeScreen({ onSuggestionClick, onAudioSend, isLoading }: WelcomeScreenProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // ✅ NEW
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSuggestionClick(input.trim());
    setInput("");
  };

  const startRecording = async () => {
    if (isLoading || isRecording || isProcessing) return;

    setRecordingError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // ✅ Force stable format
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      chunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        mediaRecorderRef.current = null;
        setIsRecording(false);

        if (!blob.size) {
          setRecordingError("No audio captured. Please try again.");
          return;
        }

        // ✅ Processing state
        setIsProcessing(true);
        try {
          await onAudioSend(blob);
        } catch {
          setRecordingError("Failed to send audio. Try again.");
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);

    } catch {
      setRecordingError("Microphone access denied or unavailable.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="gradient-bg rounded-full p-5 w-20 h-20 mx-auto mb-8 flex items-center justify-center glow">
            <GraduationCap className="h-9 w-9 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-4xl font-extrabold mb-3 text-foreground"
        >
          What do you want to{" "}
          <span className="text-primary">know?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-muted-foreground mb-10 text-base"
        >
          Ask about academics, past year questions, exam notices, or faculty —
          <br className="hidden sm:block" />
          all in one place.
        </motion.p>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-3"
        >
          <div className="glass rounded-2xl flex items-center gap-3 px-5 py-3 transition-all focus-within:glow focus-within:border-primary/50">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Ask anything about academics, PYQs, notices, faculty..."
              rows={1}
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground min-h-[24px] max-h-[120px] py-0.5"
            />

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading || isProcessing}
              className={`rounded-xl p-2 transition-colors ${
                isRecording ? "bg-destructive/20 text-destructive" : "bg-primary/15 text-primary"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              title={isRecording ? "Stop recording" : "Record audio"}
            >
              {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-2.5">
            ⌘ Enter to ask · Shift+Enter for new line
          </p>

          {/* ✅ Status Indicators */}
          {isRecording && (
            <p className="text-xs text-primary mt-1">🎤 Recording...</p>
          )}
          {isProcessing && (
            <p className="text-xs text-muted-foreground mt-1">⏳ Processing...</p>
          )}

          {recordingError && (
            <p className="text-xs text-destructive mt-1">{recordingError}</p>
          )}
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                let query: string;
                if (cat.label === "Academics") {
                  query = "tell me about the academics of graphic era hill university";
                } else if (cat.label === "Notices") {
                  query = "give the latest notice about pbl from department";
                } else if (cat.label === "Fee Structure") {
                  query = "btech cse fee structure";
                } else if (cat.label === "PYQs") {
                  query = "btech cse 6th sem tcs601 mid pyq";
                } else {
                  query = `Show me ${cat.label.toLowerCase()}`;
                }
                onSuggestionClick(query);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-card/50 hover:bg-card transition-all text-sm font-medium text-foreground group"
            >
              <cat.icon className="h-4 w-4 transition-transform group-hover:scale-110" style={{ color: cat.color }} />
              <span>{cat.label}</span>
            </button>
          ))}
        </motion.div>

      </div>
    </div>
  );
}