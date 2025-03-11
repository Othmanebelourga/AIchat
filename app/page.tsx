"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Badge } from "../components/ui/badge";
import { useTheme } from "next-themes";
import { MessageCard } from "../components/ui/message-card";
import { ChatInput } from "../components/ui/chat-input";
import { SuggestionGrid } from "../components/ui/suggestion-grid";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  MessageSquare,
  Bot,
  User,
  Settings,
  Loader2,
  Trash2,
  Plus,
  Sparkles,
  Brain,
  Code,
  PenTool,
  MessageCircle,
  X,
} from "lucide-react";
import { UserMenu } from "../components/ui/user-menu";
import { useChat } from "../hooks/use-chat";
import { ModelType } from "../types/chat";

// Dynamically import icons that might cause hydration issues
const DynamicPaperclip = dynamic(
  () => import("lucide-react").then((mod) => mod.Paperclip),
  { ssr: false }
);

const DynamicFileText = dynamic(
  () => import("lucide-react").then((mod) => mod.FileText),
  { ssr: false }
);

// Add these dynamic imports
const DynamicSun = dynamic(
  () => import("lucide-react").then((mod) => mod.Sun),
  { ssr: false }
);

const DynamicMoon = dynamic(
  () => import("lucide-react").then((mod) => mod.Moon),
  { ssr: false }
);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: File[];
  isNew?: boolean;
}

interface SuggestedPrompt {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: string;
}

const suggestedPrompts: SuggestedPrompt[] = [
  {
    id: "1",
    text: "Explain how quantum computing works",
    icon: <Brain className="h-5 w-5 text-blue-500" />,
    category: "Science",
  },
  {
    id: "2",
    text: "Write a React component for a todo list",
    icon: <Code className="h-5 w-5 text-emerald-500" />,
    category: "Programming",
  },
  {
    id: "3",
    text: "Help me write a professional email",
    icon: <PenTool className="h-5 w-5 text-purple-500" />,
    category: "Writing",
  },
  {
    id: "4",
    text: "Generate creative story ideas",
    icon: <Sparkles className="h-5 w-5 text-amber-500" />,
    category: "Creative",
  },
];

const rotatingPlaceholders = [
  "Ask me anything...",
  "What's on your mind?",
  "How can I help you today?",
  "Need help with a task?",
];

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<ModelType>("mistral-small");
  const [placeholder, setPlaceholder] = useState(rotatingPlaceholders[0]);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  // Use our custom chat hook
  const {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    error,
    selectedFiles,
    handleFileSelect,
    handleFileRemove,
    clearChat
  } = useChat({
    model: selectedModel,
    streamResponse: true,
    temperature: 0.7,
    maxTokens: 1000
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(
        rotatingPlaceholders[
          Math.floor(Math.random() * rotatingPlaceholders.length)
        ]
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar toggle button */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            className="w-80 border-r bg-card/50 backdrop-blur-sm dark:bg-[#1a1a1a] dark:border-[#333] p-6 flex flex-col z-20 fixed md:relative h-full"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">AI Chat</h1>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="hover:bg-muted dark:hover:bg-[#262626]"
                      >
                        {theme === "dark" ? (
                          <DynamicSun className="h-5 w-5" />
                        ) : (
                          <DynamicMoon className="h-5 w-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle theme</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="hover:bg-muted dark:hover:bg-[#262626]"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Close sidebar</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Button
              variant="outline"
              className="mb-8 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors dark:border-[#333] dark:hover:bg-primary/20"
              onClick={clearChat}
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>

            {messages.length > 0 && (
              <Button
                variant="ghost"
                className="mt-auto mb-4 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 dark:hover:bg-destructive/20"
                onClick={clearChat}
              >
                <Trash2 className="h-4 w-4" />
                Clear Chat
              </Button>
            )}

            <UserMenu />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background dark:bg-[#1a1a1a]">
        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="max-w-3xl mx-auto py-8">
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                  attachments={message.attachments}
                  isNew={message.isNew}
                />
              ))}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-md dark:bg-destructive/20">
                  <p className="text-sm">Error: {error}</p>
                </div>
              )}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h2 className="text-lg font-medium text-muted-foreground mb-2">Welcome to AI Chat</h2>
                  <p className="text-sm text-muted-foreground/80">Start a conversation by typing a message below.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 dark:bg-[#1a1a1a]">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSend={handleSend}
              placeholder={placeholder}
              isLoading={isLoading}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFiles={selectedFiles}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}