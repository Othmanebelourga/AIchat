"use client";

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '../../lib/utils';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map common language names to their prism-supported identifiers
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'jsx',
    'tsx': 'tsx',
    'py': 'python',
    'rb': 'ruby',
    'go': 'go',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'php': 'php',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'yaml': 'yaml',
    'md': 'markdown',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'shell': 'bash',
    'text': 'text',
    'plaintext': 'text',
  };

  const normalizedLanguage = languageMap[language.toLowerCase()] || language;

  // Custom styles to override the default dark theme
  const customDarkTheme = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: '#212121', // Slightly lighter than #1a1a1a
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: '#212121', // Slightly lighter than #1a1a1a
    },
  };

  return (
    <div className="relative my-4 rounded-md overflow-hidden border dark:border-[#333]">
      <div className="flex items-center justify-between px-4 py-1.5 bg-muted/50 dark:bg-[#262626] border-b dark:border-[#333]">
        <span className="text-xs font-mono text-muted-foreground dark:text-zinc-300">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "p-1 rounded-md text-muted-foreground dark:text-zinc-300 hover:bg-muted/50 dark:hover:bg-[#333] transition-colors",
            copied && "text-green-500"
          )}
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="dark:bg-[#212121]">
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={isDark ? customDarkTheme : oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            background: 'transparent',
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1em',
            color: isDark ? '#666' : '#999',
            textAlign: 'right',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
} 