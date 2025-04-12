const mongoose = require('mongoose');

const flashcardProgressSchema = new mongoose.Schema({
  cardId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['learning', 'reviewing', 'mastered'], default: 'learning' },
  lastReviewed: { type: Date },
  nextReview: { type: Date },
  repetitions: { type: Number, default: 0 },
  confidence: { type: Number, min: 0, max: 100, default: 0 }
});

const studySessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  timeOfDay: { type: String, enum: ['morning', 'afternoon', 'evening', 'night'] },
  subject: String,
  topic: String,
  type: { type: String, enum: ['quiz', 'flashcard', 'notes', 'career'], required: true },
  data: mongoose.Schema.Types.Mixed
});

const topicProgressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  lastStudied: { type: Date },
  confidence: { type: Number, min: 0, max: 100, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in minutes
  quizzesTaken: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 }
});

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  quizzes: [{
    subject: String,
    topic: String,
    score: Number,
    date: { type: Date, default: Date.now },
    timeSpent: Number, // in minutes
    questionsTotal: Number,
    questionsCorrect: Number
  }],
  subjects: [{
    name: String,
    topics: [topicProgressSchema]
  }],
  flashcards: {
    total: { type: Number, default: 0 },
    mastered: { type: Number, default: 0 },
    reviewing: { type: Number, default: 0 },
    learning: { type: Number, default: 0 },
    cards: [flashcardProgressSchema]
  },
  studyHabits: {
    streakData: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastStudied: Date
    },
    totalStudyTime: { type: Number, default: 0 }, // in minutes
    studySessions: [studySessionSchema],
    preferredTimes: [{
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      timeOfDay: { type: String, enum: ['morning', 'afternoon', 'evening', 'night'] },
      frequency: { type: Number, default: 0 }
    }]
  },
  activities: [{
    type: { type: String, enum: ['quiz', 'flashcard', 'notes', 'career'], required: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number }, // in minutes
    data: mongoose.Schema.Types.Mixed
  }]
});

module.exports = mongoose.model('Progress', progressSchema);
