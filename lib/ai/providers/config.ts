// Provider configuration
export interface ProviderConfig {
  xai: {
    enabled: boolean;
  };
  openai: {
    enabled: boolean;
  };
  anthropic: {
    enabled: boolean;
  };
  google: {
    enabled: boolean;
  };
}

// Check if a provider is enabled based on environment variables
export function getProviderConfig(): ProviderConfig {
  // Check if we're running on the client or server
  if (typeof window !== 'undefined' && window.__ENV) {
    // Client-side: use the window.__ENV object
    return {
      xai: {
        enabled: Boolean(window.__ENV.XAI_API_KEY),
      },
      openai: {
        enabled: Boolean(window.__ENV.OPENAI_API_KEY),
      },
      anthropic: {
        enabled: Boolean(window.__ENV.ANTHROPIC_API_KEY),
      },
      google: {
        enabled: Boolean(window.__ENV.GOOGLE_API_KEY),
      },
    };
  } else {
    // Server-side: use process.env
    return {
      xai: {
        enabled: Boolean(process.env.XAI_API_KEY || process.env.NEXT_PUBLIC_HAS_XAI_API_KEY),
      },
      openai: {
        enabled: Boolean(process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_HAS_OPENAI_API_KEY),
      },
      anthropic: {
        enabled: Boolean(process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_HAS_ANTHROPIC_API_KEY),
      },
      google: {
        enabled: Boolean(process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_HAS_GOOGLE_API_KEY),
      },
    };
  }
}

// Get available providers
export function getAvailableProviders(): string[] {
  const config = getProviderConfig();
  const providers: string[] = [];

  if (config.xai.enabled) providers.push('xai');
  if (config.openai.enabled) providers.push('openai');
  if (config.anthropic.enabled) providers.push('anthropic');
  if (config.google.enabled) providers.push('google');

  // Always return at least one provider (xAI as fallback) to prevent crashes
  if (providers.length === 0) {
    console.warn('No AI providers configured. Using xAI as fallback, but it will not work without an API key.');
    providers.push('xai');
  }

  return providers;
}
