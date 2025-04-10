const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['definition', 'concept', 'fact', 'example', 'application'],
    default: 'concept'
  },
  // Progress tracking fields
  lastReviewed: {
    type: Date,
    default: null
  },
  timesReviewed: {
    type: Number,
    default: 0
  },
  confidenceLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
});

const flashcardSetSchema = new mongoose.Schema({
  gradeLevel: {
    type: String,
    enum: ['Grade-1', 'Grade-2', 'Grade-3', 'Grade-4', 'Grade-5', 
           'Grade-6', 'Grade-7', 'Grade-8', 'O-Level'],
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
  cards: [cardSchema],
  // Reference to the curriculum
  curriculumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curriculum'
  }
}, {
  timestamps: true
});

// Compound index to ensure unique combinations
flashcardSetSchema.index(
  { gradeLevel: 1, subject: 1, topic: 1, subtopic: 1 }, 
  { unique: true }
);

const FlashcardSet = mongoose.model('FlashcardSet', flashcardSetSchema);

module.exports = FlashcardSet;
