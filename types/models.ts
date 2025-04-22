// User Interface
export interface IUser {
  id: string;
  email: string;
  password?: string;
}

// Chat Interface
export interface IChat {
  id: string;
  createdAt: Date;
  title: string;
  userId: string;
  visibility: 'public' | 'private';
}

// Message Interface
export interface IMessage {
  id: string;
  chatId: string;
  role: string;
  parts: any[];
  attachments: any[];
  createdAt: Date;
}

// Vote Interface
export interface IVote {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
}

// Document Interface
export interface IDocument {
  id: string;
  createdAt: Date;
  title: string;
  content?: string;
  kind: 'text' | 'code' | 'image' | 'sheet';
  userId: string;
}

// Suggestion Interface
export interface ISuggestion {
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
