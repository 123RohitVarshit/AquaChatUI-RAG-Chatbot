# Neer Sahayak - Water Filter Chatbot Frontend

## Overview
A modern, water-themed chatbot frontend application called "Neer Sahayak" (Water Helper) that provides expert assistance for water filters and purification systems. Built with React, TypeScript, and Tailwind CSS, featuring a beautiful glass-morphism design with streaming responses.

## Tech Stack
- **Frontend**: React 18, TypeScript, Wouter (routing)
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend Integration**: Express.js proxy to FastAPI backend
- **Features**: Streaming responses, markdown rendering, responsive design

## Project Structure
```
client/
  src/
    components/
      ChatHeader.tsx       - Header with branding and water droplet icon
      ChatMessage.tsx      - Message bubble with markdown support
      ChatInput.tsx        - Input area with send button
      TypingIndicator.tsx  - Animated typing dots
      MessageSkeleton.tsx  - Loading skeleton placeholder
      SuggestionChips.tsx  - Quick suggestion buttons
      EmptyState.tsx       - Welcome screen
    pages/
      chat.tsx            - Main chat interface
    lib/
      useChat.ts          - Custom hook for chat state management
shared/
  schema.ts              - TypeScript interfaces for messages and API
server/
  routes.ts              - API proxy to FastAPI backend
```

## Key Features
1. **Beautiful Water Theme**: Cyan and teal color palette with gradient effects
2. **Streaming Responses**: Character-by-character message display for natural feel
3. **Markdown Support**: Rich text formatting for bot responses (bold, lists, links)
4. **Glass-Morphism**: Modern backdrop-blur effects on chat container
5. **Responsive Design**: Mobile-first layout with smooth animations
6. **Suggestion Chips**: Quick-start questions for common queries
7. **Error Handling**: Retry button on failures with user-friendly messages
8. **Auto-Scroll**: Smooth scrolling to latest messages

## Environment Variables
- `BACKEND_API_URL`: URL of the FastAPI backend (default: http://localhost:8000)

## Design System
- **Primary Color**: Cyan (190 91% 42%) - Water blue for bot elements
- **Accent Color**: Teal (172 66% 50%) - User messages and highlights
- **Fonts**: Inter (UI), Poppins (headings)
- **Animations**: Fade-in-up (300ms), pulse-dot, shimmer effects
- **Spacing**: Consistent padding and gaps following design guidelines

## Backend API Integration
The frontend proxies requests to a FastAPI backend at `/api/chat`:

**Request:**
```json
{
  "query": "What's the best RO purifier for high TDS water?"
}
```

**Response:**
```json
{
  "answer": "Based on your water quality...",
  "status": "success",
  "context_used": true,
  "num_sources": 3
}
```
