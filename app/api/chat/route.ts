import { NextRequest, NextResponse } from "next/server";
import { Message } from "../../../types/chat";

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

// Format messages for Mistral API
function formatMessages(messages: Message[]): MistralMessage[] {
  return messages.map(message => ({
    role: message.role,
    content: message.content
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model, temperature, maxTokens, stream } = await req.json();
    
    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Mistral API key not configured" },
        { status: 500 }
      );
    }

    const formattedMessages = formatMessages(messages);
    
    const requestBody: MistralCompletionRequest = {
      model: model || "mistral-small-latest",
      messages: formattedMessages,
      temperature: temperature ?? 0.7,
      max_tokens: maxTokens ?? 1000,
      stream: stream ?? false
    };

    // If streaming is requested, handle differently
    if (stream) {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: `Mistral API error: ${errorData.error?.message || response.statusText}` },
          { status: response.status }
        );
      }

      // Return the stream directly
      return new NextResponse(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        }
      });
    } else {
      // Non-streaming request
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: `Mistral API error: ${errorData.error?.message || response.statusText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 