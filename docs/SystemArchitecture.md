# Study Companion System Architecture

## System Overview
The Study Companion is a web-based learning platform that provides interactive study tools and personalized learning experiences.

## Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   React UI   │  │    Vite      │  │   Axios      │         │
│  │  Components  │  │   (Build)    │  │   (HTTP)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────────────────────────│──────────────────│────────────────┘
                           │                   │
                           ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (Express)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Auth API    │  │   Quiz API   │  │  User API    │         │
│  │  Endpoints   │  │  Endpoints   │  │  Endpoints   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────────────│───────────│────────────────│─────────────────┘
                │           │                │
                ▼           ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Service Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Auth Service │  │ Quiz Service │  │ User Service │         │
│  │  (JWT)       │  │ (Gemini AI)  │  │ (MongoDB)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────────────│───────────│────────────────│─────────────────┘
                │           │                │
                ▼           ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   MongoDB    │  │  Google      │  │   Local      │         │
│  │  Database    │  │  Gemini API  │  │   Storage    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Client Layer
- **React UI Components**: Frontend interface components
- **Vite**: Build tool and development server
- **Axios**: HTTP client for API communication

### API Layer
- **Auth API**: Handles user authentication and authorization
- **Quiz API**: Manages quiz generation and submission
- **User API**: Handles user data and preferences

### Service Layer
- **Auth Service**: JWT-based authentication
- **Quiz Service**: Integration with Google Gemini AI
- **User Service**: User data management

### Data Layer
- **MongoDB**: Primary database for user data
- **Google Gemini API**: AI service for quiz generation
- **Local Storage**: Client-side data persistence

## Key Technologies
- Frontend: React, Vite, Axios
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- AI Integration: Google Gemini API

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Environment variable configuration
- Secure HTTP headers
