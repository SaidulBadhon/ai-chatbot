# Vercal AI Chatbot

A modern AI chatbot application with a clean architecture, separating frontend and backend concerns.

## Project Structure

This project is split into two parts:

1. **Frontend**: A Next.js application that handles the user interface and client-side logic
2. **Backend**: A separate Bun/Hono/Mongoose application that provides the API

## Features

- **Multiple AI Providers**: Support for xAI, OpenAI, Anthropic, and Google AI
- **Chat History**: Save and revisit previous conversations
- **File Uploads**: Share images and other files with the AI
- **Document Editing**: Collaborative document editing with AI assistance
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ for the frontend
- Bun for the backend
- MongoDB instance (local or cloud)

### Installation

#### Frontend (This Repository)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your configuration:

   ```
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:8000/api

   # Authentication
   AUTH_SECRET=your_auth_secret_here

   # AI Provider API Keys (optional, can be configured in backend)
   NEXT_PUBLIC_HAS_XAI_API_KEY=true
   NEXT_PUBLIC_HAS_OPENAI_API_KEY=true
   NEXT_PUBLIC_HAS_ANTHROPIC_API_KEY=true
   NEXT_PUBLIC_HAS_GOOGLE_API_KEY=true
   ```

#### Backend (Separate Repository)

1. Clone the backend repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Create a `.env` file with your configuration:

   ```
   # Server Configuration
   PORT=8000

   # MongoDB Connection String
   MONGODB_URI=your_mongodb_connection_string

   # JWT Secret for Authentication
   JWT_SECRET=your_jwt_secret_here

   # AI Provider API Keys
   XAI_API_KEY=your_xai_api_key
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   GOOGLE_API_KEY=your_google_api_key
   ```

### Running the Application

#### Development Mode

Start both the frontend and backend servers:

```bash
# In the frontend directory
npm run dev

# In the backend directory
bun run dev
```

Or use the provided script to start both servers:

```bash
./run-dev.sh
```

#### Production Mode

For production deployment, build and start each application separately:

```bash
# Frontend
npm run build
npm start

# Backend
bun run build
bun run serve
```

## API Endpoints

The backend provides the following API endpoints:

### User API

- `GET /api/user/:email` - Get user by email
- `POST /api/user` - Create a new user
- `POST /api/user/login` - Login user

### Chat API

- `GET /api/chat/user/:id` - Get chats by user ID
- `GET /api/chat/:id` - Get chat by ID
- `POST /api/chat` - Create a new chat
- `DELETE /api/chat/:id` - Delete chat by ID
- `PATCH /api/chat/:id/visibility` - Update chat visibility

### Message API

- `GET /api/chat/:chatId/messages` - Get messages by chat ID
- `GET /api/chat/message/:id` - Get message by ID
- `POST /api/chat/messages` - Create messages
- `DELETE /api/chat/:chatId/messages` - Delete messages by chat ID after timestamp
- `GET /api/chat/:chatId/votes` - Get votes by chat ID
- `POST /api/chat/:chatId/message/:messageId/vote` - Vote on a message

### Document API

- `GET /api/document/all/:id` - Get documents by ID
- `GET /api/document/:id` - Get document by ID
- `POST /api/document` - Create a new document
- `DELETE /api/document/:id` - Delete documents by ID after timestamp

### Suggestion API

- `GET /api/suggestion/document/:documentId` - Get suggestions by document ID
- `POST /api/suggestion` - Create suggestions
- `PATCH /api/suggestion/:id` - Update suggestion

## License

This project is licensed under the MIT License.
