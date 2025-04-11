This is the prototype for the# Study Companion - Final Year Project

An intelligent study companion application that helps students with flashcards, quizzes, and career guidance using AI.

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/i-waseem/Study-Companion-FYP.git
cd Study-Companion-FYP
```

2. Set up environment variables:

In `/client/.env`:
```
VITE_GEMINI_API_KEY=your-api-key
```

In `/server/.env`:
```
GEMINI_API_KEY=your-api-key
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=5000
```

3. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

4. Start the application:

In one terminal (server):
```bash
cd server
npm run dev
```

In another terminal (client):
```bash
cd client
npm run dev
```

5. Open http://localhost:5173 in your browser

## Features

- Interactive Flashcards with AI-enhanced explanations
- Smart Quiz Generation based on curriculum
- Career Guidance with AI recommendations
- Progress Tracking
- User Authentication
- Curriculum Management

## Technologies Used

- Frontend: React, Vite, Ant Design
- Backend: Node.js, Express
- Database: MongoDB
- AI: Google's Gemini API

Current Status
This is only a prototype. The final version will be ready by the end of my final year, with more features and improvements to come.

Tech Used
Frontend: React.js, Bootstrap
Backend: Node.js, Express.js
Database: MongoDB
AI: Google Gemini API
