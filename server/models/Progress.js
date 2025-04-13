const mongoose = require('mongoose');

const flashcardProgressSchema = new mongoose.Schema({
  cardId: { type: mongoose.Schema.Types.ObjectId, required: true },
  status: { type: String, enum: ['learning', 'reviewing', 'mastered'], default: 'learning' },
  lastReviewed: { type: Date },
  nextReview: { type: Date },
  repetitions: { type: Number, default: 0 },
  confidence: { type: Number, min: 0, max: 100, default: 0 }
});

const quizAttemptSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  questionDetails: [{
    question: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }]
});

const subtopicProgressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  learningObjectives: [String],
  status: { type: String, enum: ['not_started', 'in_progress', 'mastered'], default: 'not_started' },
  attempts: [quizAttemptSchema],
  bestScore: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  totalAttempts: { type: Number, default: 0 },
  lastAttempt: { type: Date },
  weakAreas: [String] // Store concepts/topics where student consistently makes mistakes
});

const topicProgressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  lastStudied: { type: Date },
  confidence: { type: Number, min: 0, max: 100, default: 0 },
  subtopics: [subtopicProgressSchema],
  overallProgress: {
    averageScore: { type: Number, default: 0 },
    totalQuizzesTaken: { type: Number, default: 0 },
    masteredSubtopics: { type: Number, default: 0 },
    inProgressSubtopics: { type: Number, default: 0 }
  }
});

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  quizzes: [{
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    subtopic: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    questionDetails: [{
      question: String,
      userAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
      learningObjective: String
    }],
    improvement: {
      previousBest: Number,
      improvement: Number // Difference from previous best
    }
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
    }
  },
  activities: [{
    type: { type: String, enum: ['quiz', 'flashcard', 'notes', 'career'], required: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number }, // in minutes
    data: mongoose.Schema.Types.Mixed
  }]
});

module.exports = mongoose.model('Progress', progressSchema);
