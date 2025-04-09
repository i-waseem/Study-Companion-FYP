const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');
require('dotenv').config();

const computerScienceCurriculum = {
  gradeLevel: 'O-Level',
  subject: 'Computer-Science',
  topics: [
    {
      name: 'Computer Systems',
      subtopics: [
        {
          name: 'Data Representation',
          description: 'Understanding how different types of data are represented in computer systems',
          learningObjectives: [
            'Understand binary and hexadecimal number systems',
            'Learn about text, image, and sound representation',
            'Understand data compression'
          ]
        },
        {
          name: 'Data Transmission',
          description: 'Study of how data is transmitted between computer systems',
          learningObjectives: [
            'Understand data transmission methods',
            'Learn about protocols and standards',
            'Study error detection and correction'
          ]
        },
        {
          name: 'Hardware',
          description: 'Study of computer hardware components and their functions',
          learningObjectives: [
            'Understand CPU architecture and functions',
            'Learn about primary and secondary storage',
            'Study input and output devices'
          ]
        },
        {
          name: 'Software',
          description: 'Understanding different types of software and their purposes',
          learningObjectives: [
            'Distinguish between system and application software',
            'Understand operating systems',
            'Learn about utility software'
          ]
        },
        {
          name: 'The Internet and Its Uses',
          description: 'Study of internet technologies and applications',
          learningObjectives: [
            'Understand internet protocols',
            'Learn about web technologies',
            'Study internet security'
          ]
        },
        {
          name: 'Automated and Emerging Technologies',
          description: 'Exploration of modern and emerging computer technologies',
          learningObjectives: [
            'Understand automation systems',
            'Learn about AI and machine learning basics',
            'Study emerging technology trends'
          ]
        }
      ]
    },
    {
      name: 'Algorithms, Programming and Logic',
      subtopics: [
        {
          name: 'Algorithm Design and Problem-Solving',
          description: 'Learning to design and analyze algorithms',
          learningObjectives: [
            'Understand algorithm fundamentals',
            'Learn problem-solving techniques',
            'Study algorithm efficiency'
          ]
        },
        {
          name: 'Programming',
          description: 'Learning programming concepts and practices',
          learningObjectives: [
            'Understand programming fundamentals',
            'Learn about data structures',
            'Study program design and implementation'
          ]
        },
        {
          name: 'Databases',
          description: 'Understanding database concepts and management',
          learningObjectives: [
            'Learn database fundamentals',
            'Understand data modeling',
            'Study database operations'
          ]
        },
        {
          name: 'Boolean Logic',
          description: 'Study of logical operations and circuits',
          learningObjectives: [
            'Understand logic gates',
            'Learn truth tables',
            'Study logical expressions'
          ]
        }
      ]
    }
  ]
};

async function addCurriculum() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Remove existing Computer Science curriculum if any
    await Curriculum.deleteOne({ subject: 'Computer-Science', gradeLevel: 'O-Level' });
    
    // Add new curriculum
    const curriculum = new Curriculum(computerScienceCurriculum);
    await curriculum.save();
    
    console.log('Computer Science curriculum added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addCurriculum();
