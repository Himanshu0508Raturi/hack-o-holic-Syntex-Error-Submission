import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, Info, RefreshCw, Sun, Moon, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onNewChat: () => void;
}

export function TopNav({ theme, onToggleTheme, onNewChat }: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
        <div className="gradient-bg rounded-full p-1.5">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg text-foreground">
          Scholr<span className="text-primary">AI</span>
        </span>
      </div>

      {/* Center nav tabs */}
      <nav className="flex items-center bg-secondary/60 rounded-full p-1 gap-0.5">
        <button
          onClick={() => navigate("/")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            location.pathname === "/"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Ask
        </button>
        <button
          onClick={() => navigate("/about")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            location.pathname === "/about"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Info className="h-3.5 w-3.5" />
          About
        </button>
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="gap-1.5 rounded-full text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          New
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="rounded-full h-8 w-8"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
