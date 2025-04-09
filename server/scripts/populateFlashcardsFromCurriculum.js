require('dotenv').config();
const mongoose = require('mongoose');
const FlashcardSet = require('../models/FlashcardSet');
const Curriculum = require('../models/Curriculum');

async function populateFlashcardsFromCurriculum() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing flashcard sets
    await FlashcardSet.deleteMany({});
    console.log('Cleared existing flashcard sets');

    // Process each subject's curriculum
    console.log('Processing curriculum for Computer Science...');
    await processSubjectCurriculum('Computer Science');
    
    console.log('Processing curriculum for Economics...');
    await processSubjectCurriculum('Economics');
    
    console.log('Processing curriculum for History...');
    await processSubjectCurriculum('History', 'Pakistan Studies - History'); // Map History to Pakistan Studies - History
    
    console.log('Processing curriculum for Geography...');
    await processSubjectCurriculum('Geography', 'Pakistan Studies - Geography'); // Map Geography to Pakistan Studies - Geography

    console.log('Successfully populated flashcard sets');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

async function processSubjectCurriculum(curriculumSubject, flashcardSubject = null) {
  const curriculum = await Curriculum.findOne({ subject: curriculumSubject });
  if (!curriculum) {
    console.log(`No curriculum found for ${curriculumSubject}`);
    return;
  }

  const subjectName = flashcardSubject || curriculumSubject;

  for (const topic of curriculum.topics) {
    for (const subtopic of topic.subtopics) {
      // Create flashcards based on learning objectives
      const cards = subtopic.learningObjectives.map((objective, index) => {
        // Create different types of questions based on the objective
        let question, answer;
        const objectiveText = objective.replace(/^(Explain|Analyze|Understand|Describe|Evaluate) /i, '');
        
        if (index % 2 === 0) {
          // For even indices, create a direct question
          const verb = objective.match(/^(Explain|Analyze|Understand|Describe|Evaluate)/i)?.[0] || 'Explain';
          question = `${verb} ${objectiveText}`;
          answer = `Key Points:\n${objective}\n\nDetails:\n1. Historical context and background\n2. Key events and developments\n3. Significant figures involved\n4. Impact and consequences\n5. Historical significance`;
        } else {
          // For odd indices, create an analysis question
          question = `What were the main factors and consequences related to ${objectiveText}?`;
          answer = `Factors:\n1. Historical background\n2. Key participants\n3. Major events\n\nConsequences:\n1. Immediate effects\n2. Long-term impact\n3. Historical significance\n\nKey Point: ${objective}`;
        }

        return {
          question,
          answer,
          type: index % 2 === 0 ? 'fact' : 'concept'
        };
      });

      // Create flashcard set for this subtopic
      const flashcardSet = {
        gradeLevel: 'O-Level',
        subject: subjectName,
        topic: topic.name,
        subtopic: subtopic.name,
        cards
      };

      // Insert flashcard set
      await FlashcardSet.insertMany([flashcardSet]);
    }
  }
}

populateFlashcardsFromCurriculum();
