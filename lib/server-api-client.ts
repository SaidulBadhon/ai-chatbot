// Server-side API client for Next.js server components

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8011/api/v1';

// Helper function for making API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store', // Disable caching for server components
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred while fetching the data.');
  }

  return response.json();
}

// User API
export async function getUser(email: string) {
  return fetchAPI(`/user/${email}`);
}

export async function loginUser(email: string, password: string) {
  return fetchAPI('/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function createUser(email: string, password: string) {
  return fetchAPI('/user', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Chat API
export async function getChatById(id: string) {
  return fetchAPI(`/chat/${id}`);
}

export async function getMessagesByChatId(id: string) {
  return fetchAPI(`/chat/${id}/messages`);
}

export async function getMessageById(id: string) {
  return fetchAPI(`/chat/message/${id}`);
}

export async function deleteMessagesByChatIdAfterTimestamp(chatId: string, timestamp: Date) {
  return fetchAPI(`/chat/${chatId}/messages`, {
    method: 'DELETE',
    body: JSON.stringify({ timestamp }),
  });
}

export async function updateChatVisibility(chatId: string, visibility: string) {
  return fetchAPI(`/chat/${chatId}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({ visibility }),
  });
}

// Document API
export async function getDocumentById(id: string) {
  return fetchAPI(`/document/${id}`);
}

export async function getDocumentsById(id: string) {
  return fetchAPI(`/document/all/${id}`);
}

export async function saveDocument(document: {
  id: string;
  title: string;
  content: string;
  kind: string;
  userId: string;
}) {
  return fetchAPI('/document', {
    method: 'POST',
    body: JSON.stringify(document),
  });
}

// Suggestion API
export async function getSuggestionsByDocumentId(documentId: string) {
  return fetchAPI(`/suggestion/document/${documentId}`);
}

export async function saveSuggestions(suggestions: Array<{
  id: string;
  documentId: string;
  originalText: string;
  suggestedText: string;
  description?: string;
  userId: string;
}>) {
  return fetchAPI('/suggestion', {
    method: 'POST',
    body: JSON.stringify({ suggestions }),
  });
}

export async function updateSuggestion(id: string, isResolved: boolean) {
  return fetchAPI(`/suggestion/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isResolved }),
  });
}
