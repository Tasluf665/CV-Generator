import { ENV } from './env.js';

/**
 * OpenRouter API client helper
 */
export const openRouterClient = {
  async chat(messages, options = {}) {
    if (!ENV.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ENV.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://jobflow.ai', // Optional, for OpenRouter rankings
        'X-Title': 'JobFlow AI', // Optional
      },
      body: JSON.stringify({
        model: ENV.OPENROUTER_AI_MODEL, // Default model
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.max_tokens ?? 12000,
        response_format: options.json ? { type: 'json_object' } : undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  },
};
