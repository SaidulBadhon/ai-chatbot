'use server';

import { getSuggestionsByDocumentId } from '@/lib/server-api-client';

export async function getSuggestions({ documentId }: { documentId: string }) {
  try {
    const suggestions = await getSuggestionsByDocumentId(documentId);
    return suggestions ?? [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}
