const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FlashcardSet = require('../models/FlashcardSet');

// Get all subjects
router.get('/subjects', auth, async (req, res) => {
  try {
    console.log('GET /subjects - User:', req.user);
    const subjects = await FlashcardSet.distinct('subject');
    console.log('Found subjects:', subjects);
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
});

// Get flashcard sets for a subject
router.get('/:subject', auth, async (req, res) => {
  try {
    const { subject } = req.params;
    console.log('\n--- Flashcard Request ---');
    console.log('Raw subject from URL:', subject);

    // Format the subject string by replacing dashes with spaces and capitalizing words
    const formattedSubject = subject
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    console.log('Formatted subject:', formattedSubject);

    // Try exact match first
    console.log('Trying exact match...');
    let flashcardSets = await FlashcardSet.find({ 
      subject: formattedSubject 
    }).lean();
    console.log('Exact match results:', flashcardSets.length);

    // If no results, try case-insensitive match
    if (!flashcardSets || flashcardSets.length === 0) {
      console.log('Trying case-insensitive match...');
      flashcardSets = await FlashcardSet.find({
        subject: new RegExp('^' + formattedSubject + '$', 'i')
      }).lean();
      console.log('Case-insensitive results:', flashcardSets.length);
    }

    if (!flashcardSets || flashcardSets.length === 0) {
      console.log('No flashcard sets found');
      return res.status(404).json({ message: 'No flashcard sets found for this subject' });
    }

    console.log('Found flashcard sets:', 
      flashcardSets.map(set => ({
        subject: set.subject,
        topic: set.topic,
        subtopic: set.subtopic,
        cardCount: set.cards.length
      }))
    );

    res.json(flashcardSets);
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    res.status(500).json({ message: 'Error fetching flashcard sets', error: error.message });
  }
});

// Get flashcard sets for a specific topic within a subject
router.get('/:subject/:topic', auth, async (req, res) => {
  try {
    const { subject, topic } = req.params;
    console.log('GET /:subject/:topic - User:', req.user);
    console.log('Params:', { subject, topic });
    
    // Map URL-friendly subject names to database subject names
    const subjectMap = {
      'computer-science': 'Computer Science',
      'pakistan-studies-history': 'Pakistan Studies - History',
      'pakistan-studies-geography': 'Pakistan Studies - Geography',
      'economics': 'Economics'
    };

    const databaseSubject = subjectMap[subject.toLowerCase()];
    if (!databaseSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const flashcardSets = await FlashcardSet.find({
      subject: databaseSubject,
      topic: topic.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
    }).lean();

    console.log(`Found ${flashcardSets.length} flashcard sets`);

    if (!flashcardSets || flashcardSets.length === 0) {
      console.log('No flashcard sets found');
      return res.status(404).json({ 
        message: 'No flashcard sets found for this subject and topic' 
      });
    }

    res.json(flashcardSets);
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error fetching flashcard sets', 
      error: error.message 
    });
  }
});

// Update flashcard progress
router.post('/progress/card/:setId/:cardId', auth, async (req, res) => {
  try {
    const { setId, cardId } = req.params;
    const { confidenceLevel, studyTime, subject, topic, subtopic, totalCards } = req.body;
    const userId = req.user.id;

    console.log('POST /progress/card/:setId/:cardId - User:', req.user);
    console.log('Params:', { setId, cardId });
    console.log('Body:', { confidenceLevel, studyTime, subject, topic, subtopic, totalCards });

    // TODO: Update flashcard progress in database
    // For now, just acknowledge the update
    res.json({ 
      message: 'Progress updated',
      setId,
      cardId,
      confidenceLevel,
      studyTime,
      subject,
      topic,
      subtopic,
      totalCards
    });
  } catch (error) {
    console.error('Error updating flashcard progress:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

// Helper function to generate a question from a learning objective
function generateFlashcardQuestion(objective) {
  // Remove any leading/trailing whitespace and periods
  const text = objective.trim().replace(/\.$/, '');

  // If it starts with a question word, return it as is
  const questionWords = ['what', 'why', 'how', 'when', 'where', 'who', 'which'];
  if (questionWords.some(word => text.toLowerCase().startsWith(word))) {
    return text + '?';
  }

  // If it starts with "Understand", "Learn", "Know", etc., convert to a question
  const learningVerbs = ['understand', 'learn', 'know', 'describe', 'explain', 'identify', 'list', 'define'];
  for (const verb of learningVerbs) {
    if (text.toLowerCase().startsWith(verb)) {
      const question = text.substring(verb.length).trim();
      return `What do you ${verb.toLowerCase()} about${question}?`;
    }
  }

  // Default: wrap it in a general question
  return `Can you explain ${text.toLowerCase()}?`;
}

module.exports = router;
