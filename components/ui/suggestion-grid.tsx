"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Badge } from "./badge";

interface SuggestedPrompt {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: string;
}

interface SuggestionGridProps {
  prompts: SuggestedPrompt[];
  onSelect: (text: string) => void;
}

export function SuggestionGrid({ prompts, onSelect }: SuggestionGridProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold mb-3">Welcome to AI Chat</h2>
            <p className="text-muted-foreground text-lg">
              Ask me anything or try one of these suggestions:
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="h-full"
            >
              <Button
                variant="outline"
                className="w-full h-full justify-start p-0 overflow-hidden border border-border/40 hover:border-border hover:bg-accent/50 transition-all group"
                onClick={() => onSelect(prompt.text)}
              >
                <div className="flex items-start w-full">
                  <div className="p-4 flex items-center justify-center h-full bg-muted/50 group-hover:bg-muted transition-colors">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatType: "mirror",
                        delay: index * 0.2
                      }}
                    >
                      {prompt.icon}
                    </motion.div>
                  </div>
                  <div className="p-4 text-left flex-1">
                    <div className="font-medium mb-1 group-hover:text-primary transition-colors">{prompt.text}</div>
                    <Badge variant="secondary" className="mt-1 bg-secondary/50 text-secondary-foreground/80">
                      {prompt.category}
                    </Badge>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 