require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('./models/Curriculum');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      const testCurriculum = new Curriculum({
        gradeLevel: 'O-Level',
        subject: 'Test Subject',
        topics: [{
          name: 'Test Topic',
          subtopics: [{
            name: 'Test Subtopic',
            description: 'Test Description',
            learningObjectives: ['Test Objective']
          }]
        }]
      });
      await testCurriculum.save();
      console.log('Test curriculum saved');
      const db = mongoose.connection.db;
      console.log('Current database:', db.databaseName);
    } catch (error) {
      console.error('Error:', error);
    }
    process.exit();
  });
