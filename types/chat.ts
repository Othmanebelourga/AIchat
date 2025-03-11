export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: File[];
  isNew?: boolean;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: string;
}

export type ModelType = "mistral-tiny" | "mistral-small" | "mistral-medium" | "mistral-large";

export interface ChatSettings {
  model: ModelType;
  temperature: number;
  streamResponse: boolean;
  maxTokens: number;
} 