declare global {
  interface Window {
    __ENV?: {
      XAI_API_KEY?: string;
      OPENAI_API_KEY?: string;
      ANTHROPIC_API_KEY?: string;
      GOOGLE_API_KEY?: string;
      MONGODB_URI?: string;
    };
  }
}

export {};
