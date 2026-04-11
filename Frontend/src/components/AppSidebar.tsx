import { MessageSquare, Plus, Info, Trash2, Sun, Moon, GraduationCap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { ChatSession } from "@/hooks/useChat";

interface AppSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function AppSidebar({ sessions, activeSessionId, onSelectSession, onNewChat, onDeleteSession, theme, onToggleTheme }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="gradient-bg rounded-lg p-1.5 flex-shrink-0">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-bold text-lg gradient-text">CampusAI</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <div className="px-2 mb-2">
              <Button onClick={onNewChat} variant="outline" className="w-full justify-start gap-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5">
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            </div>
          )}
          {collapsed && (
            <div className="px-1 mb-2">
              <Button onClick={onNewChat} variant="outline" size="icon" className="w-full border-dashed border-primary/30">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Chat</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/about" end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                    <Info className="h-4 w-4 mr-2" />
                    {!collapsed && <span>About</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && sessions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sessions.map((s) => (
                  <SidebarMenuItem key={s.id}>
                    <SidebarMenuButton
                      onClick={() => {
                        onSelectSession(s.id);
                        if (location.pathname !== "/") window.location.href = "/";
                      }}
                      className={`group justify-between ${s.id === activeSessionId ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                    >
                      <span className="truncate text-sm">{s.title}</span>
                      <Trash2
                        className="h-3 w-3 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity flex-shrink-0"
                        onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id); }}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Button variant="ghost" size={collapsed ? "icon" : "default"} onClick={onToggleTheme} className="w-full justify-start gap-2">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!collapsed && (theme === "dark" ? "Light Mode" : "Dark Mode")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
