const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Import routes
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');
const curriculumRoutes = require('./routes/curriculum');
const quotesRoutes = require('./routes/quotes');
const userRoutes = require('./routes/user');
const notificationsRoutes = require('./routes/notifications');
const achievementsRoutes = require('./routes/achievements');
const flashcardSetRoutes = require('./routes/flashcardSets');
const careerRoutes = require('./routes/career');
const feedbackRoutes = require('./routes/feedback');

// Use routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
// Debug middleware for progress routes
app.use('/api/progress', (req, res, next) => {
  console.log('Progress route hit:', req.method, req.url);
  next();
});
app.use('/api/progress', progressRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/flashcards', flashcardSetRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/feedback', feedbackRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running properly' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // For each collection, count documents
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`Collection ${collection.name} has ${count} documents`);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
