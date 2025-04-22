import mongoose, { Schema, Document, Model } from 'mongoose';

// User Schema
export interface IUser extends Document {
  id: string;
  email: string;
  password?: string;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
});

// Chat Schema
export interface IChat extends Document {
  id: string;
  createdAt: Date;
  title: string;
  userId: string;
  visibility: 'public' | 'private';
}

const ChatSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true },
  title: { type: String, required: true },
  userId: { type: String, required: true },
  visibility: { 
    type: String, 
    enum: ['public', 'private'], 
    default: 'private', 
    required: true 
  },
});

// Message Schema
export interface IMessage extends Document {
  id: string;
  chatId: string;
  role: string;
  parts: any[];
  attachments: any[];
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  chatId: { type: String, required: true },
  role: { type: String, required: true },
  parts: { type: Array, required: true },
  attachments: { type: Array, required: true },
  createdAt: { type: Date, required: true },
});

// Vote Schema
export interface IVote extends Document {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
}

const VoteSchema: Schema = new Schema({
  chatId: { type: String, required: true },
  messageId: { type: String, required: true },
  isUpvoted: { type: Boolean, required: true },
});

// Document Schema
export interface IDocument extends Document {
  id: string;
  createdAt: Date;
  title: string;
  content?: string;
  kind: 'text' | 'code' | 'image' | 'sheet';
  userId: string;
}

const DocumentSchema: Schema = new Schema({
  id: { type: String, required: true },
  createdAt: { type: Date, required: true },
  title: { type: String, required: true },
  content: { type: String },
  kind: { 
    type: String, 
    enum: ['text', 'code', 'image', 'sheet'], 
    default: 'text', 
    required: true 
  },
  userId: { type: String, required: true },
});

// Suggestion Schema
export interface ISuggestion extends Document {
  id: string;
  documentId: string;
  documentCreatedAt: Date;
  originalText: string;
  suggestedText: string;
  description?: string;
  isResolved: boolean;
  userId: string;
  createdAt: Date;
}

const SuggestionSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  documentId: { type: String, required: true },
  documentCreatedAt: { type: Date, required: true },
  originalText: { type: String, required: true },
  suggestedText: { type: String, required: true },
  description: { type: String },
  isResolved: { type: Boolean, required: true, default: false },
  userId: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

// Create models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
export const Vote: Model<IVote> = mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);
export const Doc: Model<IDocument> = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
export const Suggestion: Model<ISuggestion> = mongoose.models.Suggestion || mongoose.model<ISuggestion>('Suggestion', SuggestionSchema);

// // Define compound unique indexes
// ChatSchema.index({ id: 1 }, { unique: true });
// MessageSchema.index({ id: 1 }, { unique: true });
// VoteSchema.index({ chatId: 1, messageId: 1 }, { unique: true });
// DocumentSchema.index({ id: 1, createdAt: 1 }, { unique: true });
// SuggestionSchema.index({ id: 1 }, { unique: true });
