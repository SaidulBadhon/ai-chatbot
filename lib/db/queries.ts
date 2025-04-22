import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import dbConnect from './mongodb';
import { User, Chat, Message, Vote, Doc, Suggestion } from './models';
import type { IUser, IChat, IMessage, IVote, IDocument, ISuggestion } from './models';
import type { ArtifactKind } from '@/components/artifact';
import { v4 as uuidv4 } from 'uuid';

export async function getUser(email: string): Promise<Array<IUser>> {
  try {
    await dbConnect();
    const users = await User.find({ email });
    return users;
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    await dbConnect();
    return await User.create({ id: uuidv4(), email, password: hash });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    await dbConnect();
    return await Chat.create({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility: 'private'
    });
  } catch (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await dbConnect();
    await Vote.deleteMany({ chatId: id });
    await Message.deleteMany({ chatId: id });

    return await Chat.deleteOne({ id });
  } catch (error) {
    console.error('Failed to delete chat by id from database');
    throw error;
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    await dbConnect();
    const extendedLimit = limit + 1;
    let query: any = { userId: id };

    if (startingAfter) {
      const selectedChat = await Chat.findOne({ id: startingAfter });
      if (!selectedChat) {
        throw new Error(`Chat with id ${startingAfter} not found`);
      }
      query.createdAt = { $gt: selectedChat.createdAt };
    } else if (endingBefore) {
      const selectedChat = await Chat.findOne({ id: endingBefore });
      if (!selectedChat) {
        throw new Error(`Chat with id ${endingBefore} not found`);
      }
      query.createdAt = { $lt: selectedChat.createdAt };
    }

    const filteredChats = await Chat.find(query)
      .sort({ createdAt: -1 })
      .limit(extendedLimit);

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    console.error('Failed to get chats by user from database');
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    await dbConnect();
    const selectedChat = await Chat.findOne({ id });
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database');
    throw error;
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<IMessage>;
}) {
  try {
    await dbConnect();
    return await Message.insertMany(messages);
  } catch (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    await dbConnect();
    return await Message.find({ chatId: id }).sort({ createdAt: 1 });
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    await dbConnect();
    const existingVote = await Vote.findOne({ messageId });

    if (existingVote) {
      return await Vote.updateOne(
        { messageId, chatId },
        { isUpvoted: type === 'up' }
      );
    }
    return await Vote.create({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch (error) {
    console.error('Failed to upvote message in database', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    await dbConnect();
    return await Vote.find({ chatId: id });
  } catch (error) {
    console.error('Failed to get votes by chat id from database', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    await dbConnect();
    return await Doc.create({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to save document in database');
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    await dbConnect();
    const documents = await Doc.find({ id }).sort({ createdAt: 1 });

    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    await dbConnect();
    const selectedDocument = await Doc.findOne({ id }).sort({ createdAt: -1 });

    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await dbConnect();
    await Suggestion.deleteMany({
      documentId: id,
      documentCreatedAt: { $gt: timestamp }
    });

    return await Doc.deleteMany({
      id,
      createdAt: { $gt: timestamp }
    });
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database',
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<ISuggestion>;
}) {
  try {
    await dbConnect();
    return await Suggestion.insertMany(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions in database');
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    await dbConnect();
    return await Suggestion.find({ documentId });
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database',
    );
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    await dbConnect();
    return await Message.find({ id });
  } catch (error) {
    console.error('Failed to get message by id from database');
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    await dbConnect();
    const messagesToDelete = await Message.find({
      chatId,
      createdAt: { $gte: timestamp }
    }).select('id');

    const messageIds = messagesToDelete.map(message => message.id);

    if (messageIds.length > 0) {
      await Vote.deleteMany({
        chatId,
        messageId: { $in: messageIds }
      });

      return await Message.deleteMany({
        chatId,
        id: { $in: messageIds }
      });
    }
  } catch (error) {
    console.error(
      'Failed to delete messages by id after timestamp from database',
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    await dbConnect();
    return await Chat.updateOne({ id: chatId }, { visibility });
  } catch (error) {
    console.error('Failed to update chat visibility in database');
    throw error;
  }
}
