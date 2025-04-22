import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { xai } from '@ai-sdk/xai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { isTestEnvironment } from '../../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from '../models.test';
import { getProviderConfig } from './config';

// Get provider configuration
const config = getProviderConfig();

// Test environment provider
const testProvider = customProvider({
  languageModels: {
    'chat-model': chatModel,
    'chat-model-reasoning': reasoningModel,
    'title-model': titleModel,
    'artifact-model': artifactModel,
  },
});

// xAI provider
const xaiProvider = customProvider({
  languageModels: {
    'xai-grok-2': xai('grok-2-1212'),
    'xai-grok-3-mini': wrapLanguageModel({
      model: xai('grok-3-mini-beta'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
  },
  imageModels: {
    'xai-image': xai.image('grok-2-image'),
  },
});

// OpenAI provider
const openaiProvider = customProvider({
  languageModels: {
    'openai-gpt-4o': openai('gpt-4o'),
    'openai-gpt-4o-mini': openai('gpt-4o-mini'),
    'openai-gpt-3.5-turbo': openai('gpt-3.5-turbo'),
  },
  imageModels: {
    'openai-dall-e-3': openai.image('dall-e-3'),
  },
});

// Anthropic provider
const anthropicProvider = customProvider({
  languageModels: {
    'anthropic-claude-3-opus': anthropic('claude-3-opus-20240229'),
    'anthropic-claude-3-sonnet': anthropic('claude-3-sonnet-20240229'),
    'anthropic-claude-3-haiku': anthropic('claude-3-haiku-20240307'),
  },
});

// Google provider
const googleProvider = customProvider({
  languageModels: {
    'google-gemini-1.5-pro': google('gemini-1.5-pro'),
    'google-gemini-1.5-flash': google('gemini-1.5-flash'),
  },
  // imageModels: {
  //   'google-gemini-vision': google.image('gemini-1.5-pro-vision'),
  // },
});

// Combined provider
export const aiProvider = isTestEnvironment
  ? testProvider
  : {
      languageModel: (modelId: string) => {
        // Handle legacy model IDs
        if (modelId === 'chat-model') {
          modelId = 'xai-grok-2';
        } else if (modelId === 'chat-model-reasoning') {
          modelId = 'xai-grok-3-mini';
        } else if (modelId === 'title-model' || modelId === 'artifact-model') {
          modelId = 'xai-grok-2';
        }

        // xAI models
        if (modelId.startsWith('xai-') && config.xai.enabled) {
          return xaiProvider.languageModel(modelId);
        }
        // OpenAI models
        if (modelId.startsWith('openai-') && config.openai.enabled) {
          return openaiProvider.languageModel(modelId);
        }
        // Anthropic models
        if (modelId.startsWith('anthropic-') && config.anthropic.enabled) {
          return anthropicProvider.languageModel(modelId);
        }
        // Google models
        if (modelId.startsWith('google-') && config.google.enabled) {
          return googleProvider.languageModel(modelId);
        }

        // Find first available provider
        if (config.xai.enabled) {
          return xaiProvider.languageModel('xai-grok-2');
        } else if (config.openai.enabled) {
          return openaiProvider.languageModel('openai-gpt-3.5-turbo');
        } else if (config.anthropic.enabled) {
          return anthropicProvider.languageModel('anthropic-claude-3-haiku');
        } else if (config.google.enabled) {
          return googleProvider.languageModel('google-gemini-1.5-flash');
        }

        // Fallback to xAI (will likely fail without API key, but prevents crashes)
        console.warn(`No provider available for model ${modelId}. Using xAI as fallback, but it will not work without an API key.`);
        return xaiProvider.languageModel('xai-grok-2');
      },
      imageModel: (modelId: string) => {
        // Handle legacy model IDs
        if (modelId === 'small-model') {
          modelId = 'xai-image';
        }

        // xAI models
        if (modelId.startsWith('xai-') && config.xai.enabled) {
          return xaiProvider.imageModel(modelId);
        }
        // OpenAI models
        if (modelId.startsWith('openai-') && config.openai.enabled) {
          return openaiProvider.imageModel(modelId);
        }
        // Google models
        if (modelId.startsWith('google-') && config.google.enabled) {
          return googleProvider.imageModel(modelId);
        }

        // Find first available provider
        if (config.xai.enabled) {
          return xaiProvider.imageModel('xai-image');
        } else if (config.openai.enabled) {
          return openaiProvider.imageModel('openai-dall-e-3');
        } else if (config.google.enabled) {
          return googleProvider.imageModel('google-gemini-vision');
        }

        // Fallback to xAI (will likely fail without API key, but prevents crashes)
        console.warn(`No provider available for image model ${modelId}. Using xAI as fallback, but it will not work without an API key.`);
        return xaiProvider.imageModel('xai-image');
      },
    };

// Export the provider for use in the application
export const myProvider = aiProvider;
