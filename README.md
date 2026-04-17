# AI Interview Agents Platform

A modern web application that enables organizations to conduct AI-powered video interviews with intelligent agents. Built as an internship project at **Folio3** by a team of 5 interns.

## Overview

This platform allows users to create AI interview agents with custom instructions, schedule and conduct video meetings, and analyze interview results through transcriptions, recordings, and AI-generated summaries. The application features real-time video calls, automated transcription, and post-interview analytics.

## Features

### Core Functionality
- **AI Interview Agents**: Create custom AI agents with specific instructions for different interview types
- **Video Meetings**: Schedule and conduct live video interviews with AI agents
- **Real-time Communication**: HD video calls with automatic recording and transcription
- **Meeting Management**: Create, update, cancel, and manage interview sessions
- **Transcript Analysis**: Searchable transcripts with speaker identification and timestamps
- **Recording Playback**: Access recorded interviews with full video playback
- **AI Chat Interface**: Post-interview chat with AI agents for follow-up questions

### User Management
- **Authentication**: Email/password and social login (GitHub, Google) via Better Auth
- **User Profiles**: User account management with avatar generation
- **Dashboard**: Overview of meetings, agents, and recent activity
- **Settings**: Account and notification preferences

### Analytics & Insights
- **Meeting Statistics**: Track total meetings, active sessions, and upcoming interviews
- **Agent Performance**: Monitor agent usage across different meetings
- **Recent Activity**: Timeline of recent meetings and agent creations
- **Meeting Duration**: Automatic calculation of interview lengths

### Technical Features
- **Progressive Web App (PWA)**: Installable app with offline support and push notifications
- **Responsive Design**: Mobile-first design with full tablet and desktop support
- **Real-time Updates**: Live meeting status updates and notifications
- **Search & Filtering**: Advanced filtering for meetings and agents
- **Data Pagination**: Efficient data loading with pagination support

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - User interface library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & Database
- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Primary database (via Neon)
- **Better Auth** - Authentication and session management

### Real-time & Communication
- **Stream Video SDK** - Video calling infrastructure
- **Stream Chat SDK** - Real-time messaging
- **OpenAI API** - AI agent intelligence and chat responses
- **Inngest** - Background job processing

### Development Tools
- **ESLint** - Code linting
- **Drizzle Kit** - Database migrations and studio
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Date-fns** - Date manipulation

## Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Users**: User accounts with authentication data
- **Agents**: AI interview agents with custom instructions
- **Meetings**: Interview sessions with status tracking
- **Sessions**: User authentication sessions

Meeting statuses include: `upcoming`, `active`, `completed`, `processing`, `cancelled`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes and webhooks
│   └── call/              # Video call interface
├── components/            # Shared UI components
├── modules/               # Feature-based modules
│   ├── agents/           # Agent management
│   ├── auth/             # Authentication
│   ├── billing/          # Subscription management (WIP)
│   ├── call/             # Video calling
│   ├── dashboard/        # Dashboard overview
│   ├── landing/          # Marketing pages
│   ├── meetings/         # Meeting management
│   └── settings/         # User preferences
├── db/                   # Database configuration and schema
├── lib/                  # Utility libraries and configurations
└── trpc/                 # API layer setup
```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stream.io account (for video/chat)
- OpenAI API key
- GitHub/Google OAuth credentials (optional)

### Environment Variables
Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database

# Authentication
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stream.io
NEXT_PUBLIC_STREAM_VIDEO_API_KEY=your_stream_video_key
STREAM_VIDEO_SECRET_KEY=your_stream_video_secret
NEXT_PUBLIC_STREAM_CHAT_API_KEY=your_stream_chat_key
STREAM_CHAT_SECRET_KEY=your_stream_chat_secret

# OpenAI
OPENAI_SECRET_KEY=your_openai_api_key

# PWA
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### Development Setup

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd folio-interns
npm install
```

2. **Setup database:**
```bash
npm run db:push    # Push schema to database
npm run db:studio  # Open Drizzle Studio (optional)
```

3. **Start development server:**
```bash
npm run dev
```

4. **Access the application:**
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio
- `npm run dev:webhook` - Start webhook development server

## Key Features Implementation

### Meeting Workflow
1. **Create Agent**: Define AI agent with custom instructions
2. **Schedule Meeting**: Create meeting with selected agent
3. **Join Video Call**: Access meeting through call interface
4. **AI Participation**: Agent automatically joins and conducts interview
5. **Recording & Transcription**: Automatic processing via webhooks
6. **Analysis**: View transcript, recording, and AI-generated summary

### Real-time Integration
- Stream.io webhook handling for call events
- Automatic agent connection using OpenAI Realtime API
- Post-meeting processing with Inngest background jobs
- Real-time chat interface for post-interview discussions

### PWA Capabilities
- Service worker for offline functionality
- Push notification support
- App installation prompts
- Cached routes for improved performance

## API Architecture

The application uses tRPC for type-safe API communication with the following main routers:

- **Meetings Router**: CRUD operations for meetings, transcript handling, token generation
- **Agents Router**: Agent management and configuration
- **Dashboard Router**: Analytics and overview data
- **Auth Router**: User authentication and session management

## Deployment Considerations

The application is configured for deployment with:
- Static optimization enabled
- Image optimization with WebP/AVIF support
- Security headers for production
- PWA manifest and service worker
- Webhook endpoints for Stream.io integration

## Development Status

**Completed Features:**
- Core meeting and agent management
- Video calling with AI agents
- Authentication and user management
- Transcript analysis and recording playback
- PWA implementation
- Real-time chat interface

**Work in Progress:**
- Billing and subscription system
- Advanced analytics dashboard
- Usage tracking and limits

## Contributing

This project was developed as part of an internship program at Folio3. The codebase follows modern development practices with TypeScript, proper error handling, and component-based architecture.

## License

This project is private and proprietary to Folio3.
