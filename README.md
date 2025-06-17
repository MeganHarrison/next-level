# Next.js with Supabase AI Agents

This project is a Next.js application integrated with Supabase backend services, designed to provide AI-powered chat agents for business strategy and related domains. It leverages React Server Components, Supabase's Postgres database, and OpenAI's GPT models to deliver an interactive conversational experience.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Codebase Structure](#codebase-structure)
- [Database Schema](#database-schema)
- [API and Actions](#api-and-actions)
- [Frontend Components](#frontend-components)
- [State Management and Hooks](#state-management-and-hooks)
- [Error Handling and Logging](#error-handling-and-logging)
- [Setup and Running](#setup-and-running)
- [Contributing](#contributing)

## Project Overview

This application provides a chat interface where users can interact with AI agents specialized in business strategy. It supports multiple chat sessions (conversations), maintains chat history, and uses embeddings to provide context-aware responses.

## Architecture

- **Next.js**: Framework for React with support for server-side rendering and React Server Components.
- **Supabase**: Backend as a service providing Postgres database, authentication, and real-time capabilities.
- **OpenAI GPT**: AI model used for generating responses based on user input and context.
- **TypeScript**: Strongly typed JavaScript for improved developer experience and code quality.

## Key Features

- Multiple chat sessions (conversations) with persistent history.
- Contextual AI responses using document embeddings.
- User authentication via Supabase.
- Responsive UI with Tailwind CSS and custom components.
- Robust error handling and logging for debugging.

## Codebase Structure

- `app/`: Contains Next.js app routes and pages.
  - `agents/`: AI agent pages including the main chat interface.
  - `actions/`: Server-side actions for chat history, strategist agent queries, and more.
  - `api/`: API routes for auxiliary services.
- `components/`: Reusable UI components such as buttons, dialogs, text areas, and chat message displays.
- `utils/`: Utility functions and Supabase client setup.
- `hooks/`: Custom React hooks for state and effect management.
- `supabase/`: Database migrations and seed data.
- `README.md`: Project documentation.

## Database Schema

- **conversations**: Stores chat session metadata.
  - `id`: UUID primary key.
  - `title`: Conversation title.
  - `created_at`, `updated_at`: Timestamps.
- **messages**: Stores individual chat messages.
  - `id`: UUID primary key.
  - `session_id`: Foreign key to conversations.
  - `message`: JSONB content of the message.
  - `created_at`: Timestamp.

## API and Actions

- `chat-history-actions.ts`: Functions to create, update, retrieve, and clear conversations and messages in Supabase.
- `strategist-agent-actions.ts`: Interfaces with OpenAI to generate AI responses using embeddings and chat history.
- `api/`: Contains serverless functions for additional backend logic.

## Frontend Components

- Chat interface with message list, input box, and controls.
- Dialogs for chat history and confirmation modals.
- Dropdown menus for session management.
- Loading indicators and error message displays.

## State Management and Hooks

- React `useState` and `useEffect` for managing chat state, loading states, and session data.
- Auto-scroll behavior on new messages.
- Form handling with validation and submission logic.

## Error Handling and Logging

- Comprehensive try-catch blocks in async functions.
- Detailed error logging with Node.js `util.inspect` for deep error inspection.
- User-friendly error messages and toast notifications.
- Error messages saved to chat history for transparency.

## Setup and Running

1. Clone the repository.
2. Install dependencies with `pnpm install` or `npm install`.
3. Set up Supabase project and configure `.env` with keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `CRAWL4AI_AGENT_URL` - URL of the Crawl4AI agent server used by the proxy route
4. Run database migrations and seed data.
5. Start the development server with `pnpm dev` or `npm run dev`.
6. Access the app at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please follow the existing code style and conventions. Open issues or pull requests for bug fixes, features, or improvements.

---

This README provides a comprehensive overview of the project, its structure, and usage to help developers understand and contribute effectively.
