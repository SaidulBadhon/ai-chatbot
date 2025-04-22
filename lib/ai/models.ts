export const DEFAULT_CHAT_MODEL: string = 'xai-grok-2';

interface ChatModel {
  id: string;
  name: string;
  description: string;
  provider: 'xai' | 'openai' | 'anthropic' | 'google';
}

export const chatModels: Array<ChatModel> = [
  // xAI Models
  {
    id: 'xai-grok-2',
    name: 'xAI Grok-2',
    description: 'xAI Grok-2 model for general-purpose chat',
    provider: 'xai',
  },
  {
    id: 'xai-grok-3-mini',
    name: 'xAI Grok-3 Mini',
    description: 'xAI Grok-3 Mini with advanced reasoning capabilities',
    provider: 'xai',
  },

  // OpenAI Models
  {
    id: 'openai-gpt-4o',
    name: 'OpenAI GPT-4o',
    description: 'OpenAI GPT-4o - most advanced OpenAI model',
    provider: 'openai',
  },
  {
    id: 'openai-gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    description: 'OpenAI GPT-4o Mini - faster and more efficient',
    provider: 'openai',
  },
  {
    id: 'openai-gpt-3.5-turbo',
    name: 'OpenAI GPT-3.5 Turbo',
    description: 'OpenAI GPT-3.5 Turbo - fast and cost-effective',
    provider: 'openai',
  },

  // Anthropic Models
  {
    id: 'anthropic-claude-3-opus',
    name: 'Anthropic Claude 3 Opus',
    description: 'Anthropic Claude 3 Opus - most capable Claude model',
    provider: 'anthropic',
  },
  {
    id: 'anthropic-claude-3-sonnet',
    name: 'Anthropic Claude 3 Sonnet',
    description: 'Anthropic Claude 3 Sonnet - balanced performance',
    provider: 'anthropic',
  },
  {
    id: 'anthropic-claude-3-haiku',
    name: 'Anthropic Claude 3 Haiku',
    description: 'Anthropic Claude 3 Haiku - fastest Claude model',
    provider: 'anthropic',
  },

  // Google Models
  {
    id: 'google-gemini-1.5-pro',
    name: 'Google Gemini 1.5 Pro',
    description: 'Google Gemini 1.5 Pro - advanced capabilities',
    provider: 'google',
  },
  {
    id: 'google-gemini-1.5-flash',
    name: 'Google Gemini 1.5 Flash',
    description: 'Google Gemini 1.5 Flash - fast and efficient',
    provider: 'google',
  },
];

// Filter models based on available providers
export function getAvailableModels(): Array<ChatModel> {
  // Check if we're running on the server
  if (typeof window === 'undefined') {
    // During server-side rendering, return a default model to prevent hydration issues
    return [chatModels.find(model => model.id === 'xai-grok-2')] as Array<ChatModel>;
  }

  try {
    // Import here to avoid circular dependencies
    const { getAvailableProviders } = require('./providers/config');
    const availableProviders = getAvailableProviders();

    const filteredModels = chatModels.filter(model => availableProviders.includes(model.provider));

    // If no models are available, return at least one model to prevent crashes
    if (filteredModels.length === 0) {
      console.warn('No AI models available. Using xAI Grok-2 as fallback, but it will not work without an API key.');
      return [chatModels.find(model => model.id === 'xai-grok-2')] as Array<ChatModel>;
    }

    return filteredModels;
  } catch (error) {
    console.error('Error getting available models:', error);
    // Return a default model in case of error
    return [chatModels.find(model => model.id === 'xai-grok-2')] as Array<ChatModel>;
  }
}
