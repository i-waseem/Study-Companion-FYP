const mongoose = require('mongoose');

const flashcardProgressSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  lastReviewed: {
    type: Date,
    default: Date.now
  },
  nextReviewDue: {
    type: Date,
    default: Date.now
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  confidenceLevel: {
    type: Number,  // 1-5 scale
    min: 1,
    max: 5,
    default: 3
  },
  timesReviewed: {
    type: Number,
    default: 0
  }
});

const flashcardSetProgressSchema = new mongoose.Schema({
  setId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FlashcardSet',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  subtopic: {
    type: String,
    required: true
  },
  lastStudied: {
    type: Date,
    default: Date.now
  },
  totalCards: {
    type: Number,
    required: true
  },
  masteredCards: {
    type: Number,
    default: 0
  },
  cards: [flashcardProgressSchema],
  studyStreak: {
    type: Number,
    default: 0
  }
});

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quizzesTaken: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  }
});

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  topics: [topicSchema]
});

const quizSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizzes: [quizSchema],
  subjects: [subjectSchema],
  flashcardSets: [flashcardSetProgressSchema],
  lastActive: {
    type: Date,
    default: Date.now
  },
  totalStudyTime: {
    type: Number,  // in minutes
    default: 0
  }
});

module.exports = mongoose.model('Progress', progressSchema);
