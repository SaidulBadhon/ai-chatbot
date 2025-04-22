'use client';

// This file is used to safely expose environment variables to the client
// We only expose the presence of API keys, not the actual keys themselves

export function initClientEnv() {
  if (typeof window !== 'undefined') {
    window.__ENV = {
      XAI_API_KEY: process.env.NEXT_PUBLIC_HAS_XAI_API_KEY || '',
      OPENAI_API_KEY: process.env.NEXT_PUBLIC_HAS_OPENAI_API_KEY || '',
      ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_HAS_ANTHROPIC_API_KEY || '',
      GOOGLE_API_KEY: process.env.NEXT_PUBLIC_HAS_GOOGLE_API_KEY || '',
    };
  }
}
