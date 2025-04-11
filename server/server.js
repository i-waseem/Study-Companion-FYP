// Load environment variables first
const path = require('path');
require('dotenv').config();

// Debug environment variables
console.log('Environment variables loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Present' : 'Missing',
  MONGODB_URI: process.env.MONGODB_URI ? 'Present' : 'Missing',
  JWT_SECRET: process.env.JWT_SECRET ? 'Present' : 'Missing'
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Log environment variables (excluding sensitive data)
console.log('Environment check:', {
  port: process.env.PORT,
  hasGeminiKey: !!process.env.GEMINI_API_KEY,
  hasMongoUri: !!process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV
});

// CORS configuration - must be before other middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false
}));

// Add headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Enable pre-flight requests for all routes
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure cookie settings
app.use((req, res, next) => {
  // Ensure consistent cookie settings across the app
  res.cookie = function(name, value, options = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };
    return express.response.cookie.call(this, name, value, { ...defaultOptions, ...options });
  };
  
  res.clearCookie = function(name, options = {}) {
    const defaultOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    };
    return express.response.clearCookie.call(this, name, { ...defaultOptions, ...options });
  };
  
  next();
});

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  console.log('Cookies:', req.cookies);
  next();
});

// Check if JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in environment variables');
  process.exit(1);
}

// Import routes
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const curriculumRoutes = require('./routes/curriculum');
const quotesRoutes = require('./routes/quotes');
const userRoutes = require('./routes/user');
const notificationsRoutes = require('./routes/notifications');
const achievementsRoutes = require('./routes/achievements');
const progressRoutes = require('./routes/progress');
const flashcardSetsRoutes = require('./routes/flashcardSets');
const flashcardsNewRoutes = require('./routes/flashcardsNew');
const careerRoutes = require('./routes/career');
const feedbackRoutes = require('./routes/feedback');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/flashcards', flashcardSetsRoutes);
app.use('/api/flashcards-new', flashcardsNewRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/feedback', feedbackRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running properly' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Keep the process running in development
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the process running in development
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');

    // Schedule inactive user check (every day at midnight)
    const { checkInactiveUsers } = require('./controllers/notificationController');
    const cron = require('node-cron');
    cron.schedule('0 0 * * *', checkInactiveUsers);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('Setting up routes...');
      console.log(`Server is running on port ${PORT}`);
      console.log('Environment:', {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Not set',
        PORT: process.env.PORT
      });
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
