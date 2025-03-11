"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Paperclip, Send } from "lucide-react";
import { FileUpload } from "./file-upload";
import { ModelSelector } from "./model-selector";
import { ModelType } from "@/types/chat";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  placeholder?: string;
  isLoading?: boolean;
  onFileSelect: (files: File[]) => void;
  onFileRemove: (file: File) => void;
  selectedFiles: File[];
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Message...",
  isLoading = false,
  onFileSelect,
  onFileRemove,
  selectedFiles,
  selectedModel,
  onModelChange,
}: ChatInputProps) {
  const [showFileUpload, setShowFileUpload] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showFileUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <FileUpload
              onFilesSelected={onFileSelect}
              selectedFiles={selectedFiles}
              onFileRemove={onFileRemove}
              acceptedFileTypes=".pdf"
              maxSize={20}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col gap-2 bg-background border shadow-sm hover:shadow-md transition-all rounded-xl p-2.5 dark:bg-[#212121] dark:border-[#333]">
        <div className="flex items-center gap-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[40px] max-h-[200px] p-2 text-base placeholder:text-muted-foreground dark:text-zinc-200 dark:placeholder:text-zinc-500"
            style={{ outline: 'none' }}
          />
          
          <Button
            size="icon"
            disabled={isLoading || (!value.trim() && selectedFiles.length === 0)}
            onClick={onSend}
            className={cn(
              "h-9 w-9 rounded-full flex-shrink-0 transition-all",
              (!value.trim() && selectedFiles.length === 0) 
                ? "opacity-70 bg-muted text-muted-foreground dark:bg-[#333] dark:text-zinc-500" 
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 px-2">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setShowFileUpload(!showFileUpload)}
            className={cn(
              "h-7 w-7 rounded-full flex-shrink-0 transition-colors",
              showFileUpload ? "bg-primary/10 text-primary dark:bg-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-[#262626]"
            )}
          >
            <Paperclip className="h-3.5 w-3.5" />
          </Button>

          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={onModelChange}
            className="flex-shrink-0"
          />

          <div className="flex-1 text-xs text-right text-muted-foreground dark:text-zinc-500">
            <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded-md border text-xs font-mono dark:bg-[#262626] dark:border-[#333]">Enter</kbd> to send</span>
          </div>
        </div>
      </div>
    </div>
  );
} 