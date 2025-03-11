import { Message } from "../types/chat";

// Define the Mistral API types
interface MistralMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface MistralCompletionRequest {
  model: string;
  messages: MistralMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
  safe_prompt?: boolean;
  random_seed?: number;
}

interface MistralCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class MistralService {
  private apiKey: string;
  private baseUrl: string = "https://api.mistral.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Convert our app's message format to Mistral's format
  private formatMessages(messages: Message[]): MistralMessage[] {
    return messages.map(message => ({
      role: message.role,
      content: message.content
    }));
  }

  // Get a completion from Mistral API
  async getCompletion(
    messages: Message[],
    model: string = "mistral-small-latest",
    options: {
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<string> {
    const formattedMessages = this.formatMessages(messages);
    
    const requestBody: MistralCompletionRequest = {
      model,
      messages: formattedMessages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1000,
      stream: options.stream ?? false
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Mistral API error: ${errorData.error?.message || response.statusText}`);
      }

      const data: MistralCompletionResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling Mistral API:", error);
      throw error;
    }
  }

  // Stream a completion from Mistral API
  async streamCompletion(
    messages: Message[],
    model: string = "mistral-small-latest",
    options: {
      temperature?: number;
      maxTokens?: number;
      onChunk: (chunk: string) => void;
      onComplete: (fullResponse: string) => void;
    }
  ): Promise<void> {
    const formattedMessages = this.formatMessages(messages);
    
    const requestBody: MistralCompletionRequest = {
      model,
      messages: formattedMessages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1000,
      stream: true
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Mistral API error: ${errorData.error?.message || response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk
          .split("\n")
          .filter(line => line.trim() !== "" && line.startsWith("data: "));
        
        for (const line of lines) {
          const jsonStr = line.replace("data: ", "").trim();
          if (jsonStr === "[DONE]") continue;
          
          try {
            const json = JSON.parse(jsonStr);
            const content = json.choices[0]?.delta?.content || "";
            if (content) {
              options.onChunk(content);
              fullResponse += content;
            }
          } catch (e) {
            console.error("Error parsing JSON from stream:", e);
          }
        }
      }

      options.onComplete(fullResponse);
    } catch (error) {
      console.error("Error streaming from Mistral API:", error);
      throw error;
    }
  }
}

// Create a singleton instance
let mistralService: MistralService | null = null;

export function getMistralService(): MistralService {
  if (!mistralService) {
    const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || "";
    if (!apiKey) {
      console.warn("Mistral API key not found. Please set NEXT_PUBLIC_MISTRAL_API_KEY environment variable.");
    }
    mistralService = new MistralService(apiKey);
  }
  return mistralService;
} 