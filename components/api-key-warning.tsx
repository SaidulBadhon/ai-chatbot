'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from './icons';

export function ApiKeyWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Only run this check on the client side
    try {
      // Check if any API keys are configured in the environment
      const hasXaiKey = Boolean(window.__ENV?.XAI_API_KEY);
      const hasOpenAiKey = Boolean(window.__ENV?.OPENAI_API_KEY);
      const hasAnthropicKey = Boolean(window.__ENV?.ANTHROPIC_API_KEY);
      const hasGoogleKey = Boolean(window.__ENV?.GOOGLE_API_KEY);

      // Show warning if no API keys are configured
      setShowWarning(!(hasXaiKey || hasOpenAiKey || hasAnthropicKey || hasGoogleKey));
    } catch (error) {
      // Default to not showing the warning if there's an error
      setShowWarning(false);
    }
  }, []);

  // Don't render anything during server-side rendering to prevent hydration issues
  if (typeof window === 'undefined') {
    return null;
  }

  if (!showWarning) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Missing API Keys</AlertTitle>
      <AlertDescription>
        No AI provider API keys are configured. Please add at least one API key to your .env.local file.
        <br />
        <br />
        <code>
          # xAI: XAI_API_KEY=your_key_here
          <br />
          # OpenAI: OPENAI_API_KEY=your_key_here
          <br />
          # Anthropic: ANTHROPIC_API_KEY=your_key_here
          <br />
          # Google: GOOGLE_API_KEY=your_key_here
        </code>
      </AlertDescription>
    </Alert>
  );
}

// Add this to global.d.ts or create a new file called env.d.ts
declare global {
  interface Window {
    __ENV?: {
      XAI_API_KEY?: string;
      OPENAI_API_KEY?: string;
      ANTHROPIC_API_KEY?: string;
      GOOGLE_API_KEY?: string;
    };
  }
}
