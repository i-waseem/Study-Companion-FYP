require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');

async function restoreCurriculum() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing curriculum data
    await Curriculum.deleteMany({});
    console.log('Cleared existing curriculum data');

    // Original curriculum data
    const originalData = [
      {
        gradeLevel: 'O-Level',
        subject: 'Computer Science',
        topics: []
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topics: []
      },
      {
        gradeLevel: 'O-Level',
        subject: 'History',
        topics: []
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Geography',
        topics: []
      }
    ];

    // Insert original curriculum data
    const result = await Curriculum.insertMany(originalData);
    console.log(`Restored ${result.length} original curriculum documents`);

    console.log('Original curriculum data restored successfully');
  } catch (error) {
    console.error('Error restoring curriculum data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

restoreCurriculum();
