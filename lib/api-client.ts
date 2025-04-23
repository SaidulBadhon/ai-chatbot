'use client';

import { UIMessage } from 'ai';

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

export async function createUser(email: string, password: string) {
  return fetchAPI('/user', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser(email: string, password: string) {
  return fetchAPI('/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Chat API
export async function getChatsByUserId(userId: string, limit = 20, startingAfter?: string, endingBefore?: string) {
  let url = `/chat/user/${userId}?limit=${limit}`;

  if (startingAfter) {
    url += `&startingAfter=${startingAfter}`;
  } else if (endingBefore) {
    url += `&endingBefore=${endingBefore}`;
  }

  return fetchAPI(url);
}

export async function getChatById(id: string) {
  return fetchAPI(`/chat/${id}`);
}

export async function createChat(userId: string, title: string) {
  return fetchAPI('/chat', {
    method: 'POST',
    body: JSON.stringify({ userId, title }),
  });
}

export async function deleteChatById(id: string) {
  return fetchAPI(`/chat/${id}`, {
    method: 'DELETE',
  });
}

export async function updateChatVisibility(id: string, visibility: 'public' | 'private') {
  return fetchAPI(`/chat/${id}/visibility`, {
    method: 'PATCH',
    body: JSON.stringify({ visibility }),
  });
}

// Message API
export async function getMessagesByChatId(chatId: string) {
  return fetchAPI(`/chat/${chatId}/messages`);
}

export async function createMessages(messages: any[]) {
  return fetchAPI('/chat/messages', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  });
}

export async function deleteMessagesByChatIdAfterTimestamp(chatId: string, timestamp: Date) {
  return fetchAPI(`/chat/${chatId}/messages`, {
    method: 'DELETE',
    body: JSON.stringify({ timestamp }),
  });
}

export async function voteMessage(chatId: string, messageId: string, type: 'up' | 'down') {
  return fetchAPI(`/chat/${chatId}/message/${messageId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  });
}

export async function getVotesByChatId(chatId: string) {
  return fetchAPI(`/chat/${chatId}/votes`);
}

// Document API
export async function getDocumentsById(id: string) {
  return fetchAPI(`/document/all/${id}`);
}

export async function getDocumentById(id: string) {
  return fetchAPI(`/document/${id}`);
}

export async function createDocument(id: string, title: string, kind: string, content: string, userId: string) {
  return fetchAPI('/document', {
    method: 'POST',
    body: JSON.stringify({ id, title, kind, content, userId }),
  });
}

export async function deleteDocumentsByIdAfterTimestamp(id: string, timestamp: Date) {
  return fetchAPI(`/document/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ timestamp }),
  });
}

// Suggestion API
export async function getSuggestionsByDocumentId(documentId: string) {
  return fetchAPI(`/suggestion/document/${documentId}`);
}

export async function createSuggestions(suggestions: any[]) {
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

// File Upload API
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE_URL}/files/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'An error occurred while uploading the file.');
    }

    const data = await response.json();
    return {
      url: `${API_BASE_URL}/files${data.url}`,
      name: data.pathname,
      contentType: data.contentType,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
