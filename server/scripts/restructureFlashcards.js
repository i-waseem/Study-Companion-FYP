require('dotenv').config();
const mongoose = require('mongoose');
const FlashcardSet = require('../models/FlashcardSet');
const Curriculum = require('../models/Curriculum');

async function restructureFlashcards() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Get curriculum data first
    const curriculum = await Curriculum.find({}).lean();
    console.log(`Found ${curriculum.length} curriculum subjects`);

    // Clear existing flashcard sets
    await FlashcardSet.deleteMany({});
    console.log('Cleared existing flashcard sets');

    // Process each subject
    for (const subject of curriculum) {
      console.log(`\nProcessing ${subject.subject}...`);
      
      for (const topic of subject.topics) {
        console.log(`  Topic: ${topic.name}`);
        
        for (const subtopic of topic.subtopics) {
          console.log(`    Subtopic: ${subtopic.name}`);
          
          // Create flashcards for each learning objective
          const cards = subtopic.learningObjectives.map((objective, index) => {
            // Create different types of questions based on the learning objective
            const objectiveText = objective.trim();
            let question, answer;

            // Extract any key verbs from the start of the objective
            const verbs = ['explain', 'describe', 'analyze', 'evaluate', 'discuss', 'compare'];
            const startsWithVerb = verbs.find(v => 
              objectiveText.toLowerCase().startsWith(v)
            );

            if (startsWithVerb) {
              // If it starts with a verb, make it a direct question
              question = objectiveText;
              answer = `Key Points to ${startsWithVerb}:\n\n` +
                      `1. Main Concept: ${objectiveText.substring(startsWithVerb.length).trim()}\n` +
                      `2. Important Details: Consider the context, components, and relationships\n` +
                      `3. Examples: Provide relevant examples to support your explanation\n` +
                      `4. Analysis: Discuss implications and connections\n` +
                      `5. Application: How this knowledge is used in practice`;
            } else {
              // Otherwise, form a question about the concept
              question = `What is the significance of ${objectiveText}?`;
              answer = `Key Points:\n\n` +
                      `1. Definition: ${objectiveText}\n` +
                      `2. Context: How this fits into the broader topic\n` +
                      `3. Importance: Why this concept matters\n` +
                      `4. Related Concepts: Connections to other ideas\n` +
                      `5. Real-world Applications: Practical uses`;
            }

            return {
              question,
              answer,
              type: index % 2 === 0 ? 'concept' : 'application',
              lastReviewed: null,
              timesReviewed: 0,
              confidenceLevel: 0
            };
          });

          // Create a flashcard set for this subtopic
          const flashcardSet = new FlashcardSet({
            gradeLevel: subject.gradeLevel,
            subject: subject.subject,
            topic: topic.name,
            subtopic: subtopic.name,
            cards,
            curriculumId: subject._id
          });

          await flashcardSet.save();
          console.log(`      Created ${cards.length} flashcards`);
        }
      }
    }

    console.log('\nSuccessfully restructured all flashcards');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

restructureFlashcards();
