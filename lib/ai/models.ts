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
  // Import here to avoid circular dependencies
  const { getAvailableProviders } = require('./providers/config');
  const availableProviders = getAvailableProviders();

  return chatModels.filter(model => availableProviders.includes(model.provider));
}
