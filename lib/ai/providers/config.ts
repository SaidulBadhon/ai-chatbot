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

  console.log("XXXXXX ===== === = = == =xXXX",process.env.OPENAI_API_KEY)
  return {
    xai: {
      enabled: Boolean(process.env.XAI_API_KEY),
    },
    openai: {
      enabled: Boolean(process.env.OPENAI_API_KEY),
    },
    anthropic: {
      enabled: Boolean(process.env.ANTHROPIC_API_KEY),
    },
    google: {
      enabled: Boolean(process.env.GOOGLE_API_KEY),
    },
  };
}

// Get available providers
export function getAvailableProviders(): string[] {
  const config = getProviderConfig();
  const providers: string[] = [];

  if (config.xai.enabled) providers.push('xai');
  if (config.openai.enabled) providers.push('openai');
  if (config.anthropic.enabled) providers.push('anthropic');
  if (config.google.enabled) providers.push('google');

  return providers;
}
