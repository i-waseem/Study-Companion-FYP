const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  learningObjectives: [String],
  resources: [{
    type: {
      type: String,
      enum: ['video', 'document', 'link'],
      required: true
    },
    url: String,
    title: String,
    description: String
  }]
});

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subtopics: [subtopicSchema]
});

const curriculumSchema = new mongoose.Schema({
  gradeLevel: {
    type: String,
    enum: ['Grade-1', 'Grade-2', 'Grade-3', 'Grade-4', 'Grade-5', 
           'Grade-6', 'Grade-7', 'Grade-8', 'O-Level'],
    required: true
  },
  subject: {
    type: String,
    enum: ['Mathematics', 'Science', 'English', 'History', 'Geography', 
           'Physics', 'Chemistry', 'Biology', 'Computer Science',
           'Pakistan Studies - History', 'Pakistan Studies - Geography',
           'Economics'],
    required: true
  },
  topics: [topicSchema]
}, {
  timestamps: true,
  collection: 'curriculums' // Explicitly set the collection name
});

// Compound index to ensure unique grade-subject combinations
curriculumSchema.index({ gradeLevel: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Curriculum', curriculumSchema);
