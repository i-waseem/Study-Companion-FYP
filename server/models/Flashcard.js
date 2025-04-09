const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastReviewed: {
    type: Date,
    default: null
  },
  timesReviewed: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  }
});

// Index for faster queries
flashcardSchema.index({ topic: 1, userId: 1 });
flashcardSchema.index({ category: 1, userId: 1 });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
