import { getErrorMessage, safeJson, safeText } from '@minimal-rpg/utils';

/**
 * OpenRouter LLM adapter
 *
 * OpenRouter provides a unified API gateway to multiple LLM providers.
 * This adapter is compatible with OpenAI's chat completions API, making
 * migration from Ollama straightforward.
 *
 * Recommended models for RPG narrator/character actor:
 * - anthropic/claude-3.5-sonnet (best quality, moderate filtering)
 * - mistralai/mistral-large-2411 (excellent balance, low filtering)
 * - deepseek/deepseek-chat (budget option, low filtering)
 *
 * @see https://openrouter.ai/docs for full documentation
 */

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterChatResponse {
  message?: { role: 'assistant'; content: string };
  error?: string;
}

interface ChatWithOpenRouterOptions {
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  timeoutMs?: number;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

interface OpenRouterResponse {
  id?: string;
  choices?: {
    message?: {
      role?: string;
      content?: string;
    };
  }[];
  error?: {
    message?: string;
    code?: string;
  };
}

/**
 * Send a chat completion request to OpenRouter
 *
 * OpenRouter uses OpenAI-compatible API format, so this function
 * is very similar to standard OpenAI integration.
 *
 * @param opts - Configuration options for the request
 * @returns Promise resolving to chat response or error
 */
export async function chatWithOpenRouter(
  opts: ChatWithOpenRouterOptions
): Promise<OpenRouterChatResponse> {
  const { apiKey, model, messages, timeoutMs = 120_000, options = {} } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

    // Build request body (OpenAI-compatible format)
    const body = {
      model,
      messages,
      temperature: options.temperature,
      top_p: options.top_p,
      max_tokens: options.max_tokens,
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/ceponatia/rpg-light', // Optional: for rankings
        'X-Title': 'RPG-Light', // Optional: show in OpenRouter dashboard
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await safeText(res);
      return { error: `OpenRouter error ${res.status}: ${text}` };
    }

    const payload = (await safeJson<OpenRouterResponse>(res)) ?? {};

    // Extract assistant message from OpenAI-compatible response
    const assistantReply = extractAssistantContent(payload);
    if (assistantReply) {
      return { message: { role: 'assistant', content: assistantReply } };
    }

    // Check for error in response
    if (payload.error) {
      return { error: `OpenRouter API error: ${payload.error.message ?? 'Unknown error'}` };
    }

    return { error: 'Invalid OpenRouter response' };
  } catch (error) {
    const msg = getErrorMessage(error, 'Unknown error');
    return { error: `OpenRouter request failed: ${msg}` };
  } finally {
    clearTimeout(timer);
  }
}

function extractAssistantContent(payload: OpenRouterResponse | null | undefined): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  // OpenAI-compatible format: choices[0].message.content
  if (Array.isArray(payload.choices) && payload.choices.length > 0) {
    const choice = payload.choices[0];
    if (choice) {
      const content = choice.message?.content;
      if (typeof content === 'string') {
        return content;
      }
    }
  }

  return null;
}
