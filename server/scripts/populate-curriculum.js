const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Curriculum = require('../models/Curriculum');
require('dotenv').config();

async function populateCurriculum() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read the Computer Science curriculum
    const csDataPath = path.join(__dirname, '..', 'data', 'computer-science-curriculum.json');
    const csData = JSON.parse(fs.readFileSync(csDataPath, 'utf8'));
    
    // Clear existing Computer Science curriculum
    await Curriculum.deleteOne({
      gradeLevel: 'O-Level',
      subject: 'Computer Science'
    });
    console.log('Cleared existing Computer Science curriculum');

    // Ensure subject name is correct
    csData.subject = 'Computer Science';

    // Save the new curriculum using findOneAndUpdate with upsert
    const curriculum = await Curriculum.findOneAndUpdate(
      { gradeLevel: 'O-Level', subject: 'Computer Science' },
      csData,
      { upsert: true, new: true }
    );
    
    console.log('\nAdded Computer Science curriculum successfully');
    console.log('\nCurriculum structure:');
    console.log(`Total Topics: ${curriculum.topics.length}`);
    
    curriculum.topics.forEach(topic => {
      console.log(`\nTopic: ${topic.name}`);
      console.log(`Number of subtopics: ${topic.subtopics.length}`);
      
      topic.subtopics.forEach(subtopic => {
        console.log(`\n  Subtopic: ${subtopic.name}`);
        console.log(`  Description: ${subtopic.description}`);
        console.log(`  Learning Objectives (${subtopic.learningObjectives.length}):`);
        subtopic.learningObjectives.forEach(objective => {
          console.log(`    • ${objective}`);
        });
      });
    });

    console.log('\nCurriculum population completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the population script
populateCurriculum();
