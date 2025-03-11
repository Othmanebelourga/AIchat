"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bot, User, Paperclip, FileText, Info } from "lucide-react";
import { cn, parseCodeBlocks } from "../../lib/utils";
import { CodeBlock } from "./code-block";
import ReactMarkdown from 'react-markdown';

interface MessageCardProps {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  attachments?: File[];
  isNew?: boolean;
}

export function MessageCard({
  content,
  role,
  timestamp,
  attachments,
  isNew,
}: MessageCardProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Parse content for code blocks
  const contentParts = parseCodeBlocks(content);

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative px-4 py-5",
        role === "assistant" ? "bg-muted/20 dark:bg-[#1f1f1f]" : 
        role === "system" ? "bg-primary/5 dark:bg-[#1f1f1f]" : "bg-background dark:bg-[#1a1a1a]/60"
      )}
    >
      <div className="mx-auto flex gap-3 items-start">
        <div className={cn(
          "flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-md border dark:border-[#333]",
          role === "assistant" 
            ? "bg-primary/10 text-primary dark:bg-[#333] dark:text-white" 
            : role === "system"
            ? "bg-primary/5 text-primary dark:bg-[#333] dark:text-white"
            : "bg-muted/50 text-foreground dark:bg-[#262626] dark:text-white"
        )}>
          {role === "assistant" ? (
            <Bot className="h-4 w-4" />
          ) : role === "system" ? (
            <Info className="h-4 w-4" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>

        <div className="flex-1">
          <div className="prose prose-sm dark:prose-invert max-w-none dark:text-zinc-200">
            {contentParts.map((part, index) => {
              if (typeof part === 'string') {
                return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
              } else {
                return (
                  <CodeBlock 
                    key={index} 
                    language={part.language} 
                    code={part.code} 
                  />
                );
              }
            })}
          </div>

          {attachments && attachments.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 dark:bg-[#262626] px-2 py-1 rounded-md border dark:border-[#333]"
                >
                  {file.type.startsWith("image/") ? (
                    <FileText className="h-3 w-3" />
                  ) : (
                    <Paperclip className="h-3 w-3" />
                  )}
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-1.5 text-xs text-muted-foreground/80 dark:text-zinc-400">
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 