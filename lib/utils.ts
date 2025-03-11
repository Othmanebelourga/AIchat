import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CodeBlock {
  language: string;
  code: string;
}

export function parseCodeBlocks(content: string): (string | CodeBlock)[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: (string | CodeBlock)[] = [];
  
  let lastIndex = 0;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    
    // Add the code block
    const language = match[1] || 'text';
    const code = match[2];
    parts.push({ language, code });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text after the last code block
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }
  
  return parts;
}
