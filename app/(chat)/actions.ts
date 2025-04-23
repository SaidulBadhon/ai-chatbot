'use server';

import { generateText, Message } from 'ai';
import { cookies } from 'next/headers';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisibility as updateChatVisibilityServer,
} from '@/lib/server-api-client';
import { VisibilityType } from '@/components/visibility-selector';
import { aiProvider } from '@/lib/ai/providers';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const { text: title } = await generateText({
    model: aiProvider.languageModel('title-model'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  try {
    const message = await getMessageById(id);

    if (message) {
      await deleteMessagesByChatIdAfterTimestamp(message.chatId, message?.createdAt);
    }
  } catch (error) {
    console.error('Error deleting trailing messages:', error);
  }
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  try {
    await updateChatVisibilityServer(chatId, visibility);
  } catch (error) {
    console.error('Error updating chat visibility:', error);
  }
}
