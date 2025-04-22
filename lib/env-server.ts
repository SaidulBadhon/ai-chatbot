// This file is used to set up environment variables for the server
// We only expose the presence of API keys, not the actual keys themselves

export function setupPublicEnv() {
  // Set public environment variables to indicate if API keys are present
  process.env.NEXT_PUBLIC_HAS_XAI_API_KEY = process.env.XAI_API_KEY ? 'true' : '';
  process.env.NEXT_PUBLIC_HAS_OPENAI_API_KEY = process.env.OPENAI_API_KEY ? 'true' : '';
  process.env.NEXT_PUBLIC_HAS_ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ? 'true' : '';
  process.env.NEXT_PUBLIC_HAS_GOOGLE_API_KEY = process.env.GOOGLE_API_KEY ? 'true' : '';
}
