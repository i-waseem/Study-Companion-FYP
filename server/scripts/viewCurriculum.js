require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');

async function viewCurriculum() {
  try {
    const uri = 'mongodb+srv://iqrawaseem1995:Heyayan32!@cluster0.2pme8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');

    const curriculum = await Curriculum.find().lean();
    console.log('\nCurriculum Structure:\n');
    
    curriculum.forEach(subject => {
      console.log(`Subject: ${subject.subject}`);
      console.log('Topics:');
      subject.topics.forEach(topic => {
        console.log(`  - ${topic.name}`);
        console.log('    Subtopics:');
        topic.subtopics.forEach(subtopic => {
          console.log(`      * Name: ${subtopic.name}`);
          console.log(`        Description: ${subtopic.description || 'No description'}`);
          if (subtopic.keyPoints && subtopic.keyPoints.length > 0) {
            console.log('        Key Points:');
            subtopic.keyPoints.forEach(point => console.log(`          - ${point}`));
          }
        });
        console.log();
      });
      console.log('-------------------\n');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

viewCurriculum();
