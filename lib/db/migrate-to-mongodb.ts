import { config } from 'dotenv';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import dbConnect from './mongodb';
import { User, Chat, Message, Vote, Doc, Suggestion } from './models';
import { v4 as uuidv4 } from 'uuid';

config({
  path: '.env.local',
});

/**
 * This script migrates data from PostgreSQL to MongoDB.
 * It should be run once when transitioning from PostgreSQL to MongoDB.
 */
const migrateToMongoDB = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  console.log('⏳ Connecting to databases...');

  // Connect to PostgreSQL
  const pgClient = postgres(process.env.POSTGRES_URL);
  const db = drizzle(pgClient, { schema });

  // Connect to MongoDB
  await dbConnect();

  console.log('✅ Connected to databases');
  console.log('⏳ Starting migration...');

  try {
    // Migrate users
    console.log('⏳ Migrating users...');
    const users = await db.query.user.findMany();
    if (users.length > 0) {
      await User.deleteMany({});
      await User.insertMany(
        users.map((user) => ({
          id: user.id,
          email: user.email,
          password: user.password,
        }))
      );
    }
    console.log(`✅ Migrated ${users.length} users`);

    // Migrate chats
    console.log('⏳ Migrating chats...');
    const chats = await db.query.chat.findMany();
    if (chats.length > 0) {
      await Chat.deleteMany({});
      await Chat.insertMany(
        chats.map((chat) => ({
          id: chat.id,
          createdAt: chat.createdAt,
          title: chat.title,
          userId: chat.userId,
          visibility: chat.visibility,
        }))
      );
    }
    console.log(`✅ Migrated ${chats.length} chats`);

    // Migrate messages
    console.log('⏳ Migrating messages...');
    const messages = await db.query.message.findMany();
    if (messages.length > 0) {
      await Message.deleteMany({});
      await Message.insertMany(
        messages.map((message) => ({
          id: message.id,
          chatId: message.chatId,
          role: message.role,
          parts: message.parts,
          attachments: message.attachments,
          createdAt: message.createdAt,
        }))
      );
    }
    console.log(`✅ Migrated ${messages.length} messages`);

    // Migrate votes
    console.log('⏳ Migrating votes...');
    const votes = await db.query.vote.findMany();
    if (votes.length > 0) {
      await Vote.deleteMany({});
      await Vote.insertMany(
        votes.map((vote) => ({
          chatId: vote.chatId,
          messageId: vote.messageId,
          isUpvoted: vote.isUpvoted,
        }))
      );
    }
    console.log(`✅ Migrated ${votes.length} votes`);

    // Migrate documents
    console.log('⏳ Migrating documents...');
    const documents = await db.query.document.findMany();
    if (documents.length > 0) {
      await Doc.deleteMany({});
      await Doc.insertMany(
        documents.map((doc) => ({
          id: doc.id,
          createdAt: doc.createdAt,
          title: doc.title,
          content: doc.content,
          kind: doc.kind,
          userId: doc.userId,
        }))
      );
    }
    console.log(`✅ Migrated ${documents.length} documents`);

    // Migrate suggestions
    console.log('⏳ Migrating suggestions...');
    const suggestions = await db.query.suggestion.findMany();
    if (suggestions.length > 0) {
      await Suggestion.deleteMany({});
      await Suggestion.insertMany(
        suggestions.map((suggestion) => ({
          id: suggestion.id,
          documentId: suggestion.documentId,
          documentCreatedAt: suggestion.documentCreatedAt,
          originalText: suggestion.originalText,
          suggestedText: suggestion.suggestedText,
          description: suggestion.description,
          isResolved: suggestion.isResolved,
          userId: suggestion.userId,
          createdAt: suggestion.createdAt,
        }))
      );
    }
    console.log(`✅ Migrated ${suggestions.length} suggestions`);

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close PostgreSQL connection
    await pgClient.end();
    process.exit(0);
  }
};

migrateToMongoDB();
