const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Curriculum = require('../models/Curriculum');
const Flashcard = require('../models/Flashcard');

// Get flashcard sets for a subject
router.get('/:gradeLevel/:subject', auth, async (req, res) => {
  try {
    const { gradeLevel, subject } = req.params;
    
    // Convert grade level and subject to proper format
    const formattedGradeLevel = gradeLevel.toLowerCase() === 'o-level' ? 'O-Level' : gradeLevel;
    
    // Special handling for Pakistan Studies subjects
    let formattedSubject;
    if (subject === 'pakistan-studies-history') {
      formattedSubject = 'Pakistan Studies - History';
    } else if (subject === 'pakistan-studies-geography') {
      formattedSubject = 'Pakistan Studies - Geography';
    } else {
      // Standard formatting for other subjects
      formattedSubject = subject.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    console.log(`Generating flashcards for ${formattedGradeLevel} ${formattedSubject}`);

    // Find flashcards in the database
    const flashcards = await Flashcard.find({
      category: formattedSubject
    }).lean();

    if (!flashcards || flashcards.length === 0) {
      console.log('No flashcards found, generating from curriculum');
      
      // If no flashcards in DB, get them from curriculum
      const curriculum = await Curriculum.findOne({
        gradeLevel: formattedGradeLevel,
        subject: formattedSubject
      }).lean();

      if (!curriculum) {
        console.error(`No curriculum found for ${formattedGradeLevel} ${formattedSubject}`);
        return res.status(404).json({ 
          message: `No curriculum found for ${formattedGradeLevel} ${formattedSubject}` 
        });
      }

      // Transform curriculum data into flashcard sets
      const flashcardSets = curriculum.topics.map(topic => ({
        _id: topic._id.toString(),
        title: topic.name,
        subject: formattedSubject,
        topic: topic.name,
        cards: topic.subtopics.flatMap(subtopic => 
          subtopic.learningObjectives.map((objective, index) => ({
            _id: `${topic._id}-${subtopic._id}-${index}`,
            front: generateFlashcardQuestion(objective),
            back: objective,
            topic: topic.name,
            subtopic: subtopic.name
          }))
        )
      })).filter(set => set.cards.length > 0);

      // Save flashcards to database
      await Flashcard.insertMany(flashcardSets.flatMap(set => set.cards.map(card => ({
        topic: set.topic,
        question: card.front,
        answer: card.back,
        difficulty: 'Medium',
        category: formattedSubject,
        userId: req.user._id
      }))));

      res.json(flashcardSets);
    } else {
      // Transform flashcards into sets
      const flashcardSets = {};
      flashcards.forEach(card => {
        if (!flashcardSets[card.topic]) {
          flashcardSets[card.topic] = {
            _id: card.topic,
            title: card.topic,
            subject: formattedSubject,
            topic: card.topic,
            cards: []
          };
        }
        flashcardSets[card.topic].cards.push({
          _id: card._id.toString(),
          front: card.question,
          back: card.answer,
          topic: card.topic,
          subtopic: ''
        });
      });

      res.json(Object.values(flashcardSets));
    }
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ message: 'Failed to generate flashcards' });
  }
});

// Update flashcard progress
router.post('/progress/card/:setId/:cardId', auth, async (req, res) => {
  try {
    const { setId, cardId } = req.params;
    const { confidenceLevel, studyTime, subject, topic, subtopic, totalCards } = req.body;
    const userId = req.user.id;

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
