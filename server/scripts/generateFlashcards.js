// Preview flashcard generation without database

// Computer Science curriculum structure
const computerScienceCurriculum = {
  gradeLevel: 'O-Level',
  subject: 'Computer Science',
  topics: [
    {
      name: 'Computer Systems',
      subtopics: [
        {
          name: 'Data Representation',
          learningObjectives: [
            'Explain how binary, denary, and hexadecimal number systems work',
            'Describe how to perform logical binary shifts',
            'Explain the concept of Two\'s Complement representation',
            'Describe how computers represent text using ASCII and Unicode',
            'Explain how computers store and process sound and image data',
            'Compare lossy and lossless compression methods'
          ]
        },
        {
          name: 'Data Transmission',
          learningObjectives: [
            'Explain how packet switching works in data transmission',
            'Describe the structure and purpose of data packets',
            'Compare serial and parallel transmission methods',
            'Explain the differences between simplex and duplex transmission',
            'Describe the features and benefits of USB technology',
            'Explain how parity checks work in error detection',
            'Compare symmetric and asymmetric encryption methods'
          ]
        }
      ]
    },
    {
      name: 'Programming and Development',
      subtopics: [
        {
          name: 'Programming Basics',
          learningObjectives: [
            'Explain what variables and constants are in programming',
            'Describe different data types used in programming',
            'Explain how selection statements (if/else) work',
            'Describe how loops are used for iteration',
            'Explain the purpose of arrays in programming',
            'Describe how functions help in code organization'
          ]
        },
        {
          name: 'Software Development',
          learningObjectives: [
            'Explain the stages of the software development life cycle',
            'Describe the purpose of testing in software development',
            'Explain what debugging means and why it\'s important',
            'Describe different types of programming errors',
            'Explain the importance of documentation in programming'
          ]
        }
      ]
    }
  ]
};

const generateQuestions = (objective) => {
  // Remove any leading/trailing whitespace and periods
  const text = objective.trim().replace(/\.$/, '');

  // If it starts with "Explain", convert to a question
  if (text.toLowerCase().startsWith('explain')) {
    return text.replace(/^explain/i, 'Can you explain') + '?';
  }

  // If it starts with "Describe", convert to a question
  if (text.toLowerCase().startsWith('describe')) {
    return text.replace(/^describe/i, 'Can you describe') + '?';
  }

  // If it starts with "Compare", convert to a question
  if (text.toLowerCase().startsWith('compare')) {
    return text.replace(/^compare/i, 'How would you compare') + '?';
  }

  // If it starts with "Understand", convert to a question
  if (text.toLowerCase().startsWith('understand')) {
    return text.replace(/^understand/i, 'What do you understand about') + '?';
  }

  // Default format
  return `Can you explain ${text.toLowerCase()}?`;
};

async function generateFlashcardsForSubject() {
  try {
    console.log('Generating flashcards for Computer Science...');
    
    // Use our predefined curriculum
    const curriculum = computerScienceCurriculum;

    if (!curriculum) {
      console.log('No curriculum found');
      return;
    }

    // For each topic and subtopic, generate flashcards
    for (const topic of curriculum.topics) {
      console.log(`Processing topic: ${topic.name}`);
      
      for (const subtopic of topic.subtopics) {
        console.log(`Processing subtopic: ${subtopic.name}`);
        
        // Generate flashcards for this subtopic

        // Generate new flashcards from learning objectives
        const flashcards = subtopic.learningObjectives.map(objective => ({
          topic: topic.name,
          subtopic: subtopic.name,
          question: generateQuestions(objective),
          answer: objective,
          difficulty: 'Medium',
          category: 'Computer Science'
        }));

        // Log the generated flashcards without saving
        console.log(`Generated ${flashcards.length} flashcards for ${subtopic.name}:`);
        flashcards.forEach((card, index) => {
          console.log(`\nCard ${index + 1}:`);
          console.log(`Q: ${card.question}`);
          console.log(`A: ${card.answer}`);
        });
      }
    }

    console.log('Finished processing Computer Science');

  } catch (error) {
    console.error('Error generating flashcards:', error);
  }
}

// Just preview the flashcards without saving them
async function previewFlashcards() {
  try {
    console.log('Previewing Computer Science flashcards...');
    await generateFlashcardsForSubject();
    console.log('\nPreview complete! These flashcards will help students learn Computer Science concepts.');
  } catch (error) {
    console.error('Error:', error);
  }
}

previewFlashcards();
