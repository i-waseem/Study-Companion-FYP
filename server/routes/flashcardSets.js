const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FlashcardSet = require('../models/FlashcardSet');

// Get all subjects
router.get('/subjects', auth, async (req, res) => {
  try {
    console.log('GET /subjects - User:', req.user);
    const subjects = await FlashcardSet.distinct('subject');
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get all unique topics for a subject
router.get('/topics/:subject', auth, async (req, res) => {
  try {
    const topics = await FlashcardSet.distinct('topic', { subject: req.params.subject });
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Get all unique subtopics for a subject and topic
router.get('/subtopics/:subject/:topic', auth, async (req, res) => {
  try {
    const subtopics = await FlashcardSet.distinct('subtopic', { 
      subject: req.params.subject,
      topic: req.params.topic
    });
    res.json(subtopics);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    res.status(500).json({ error: 'Failed to fetch subtopics' });
  }
});



// Get flashcard sets for o-level subject, topic, and subtopic
router.get('/o-level/:subject/:topic/:subtopic', auth, async (req, res) => {
  try {
    const { subject, topic, subtopic } = req.params;
    console.log('\n--- Flashcard Request ---');
    console.log('Params:', { subject, topic, subtopic });

    // Find matching flashcard set using exact values from database
    const flashcardSet = await FlashcardSet.findOne({ 
      subject,
      topic,
      subtopic
    }).lean();

    if (!flashcardSet) {
      console.log('No flashcard set found');
      return res.status(404).json({ 
        message: 'No flashcard set found for this combination' 
      });
    }

    console.log('Found flashcard set:', { 
      subject: flashcardSet.subject,
      topic: flashcardSet.topic,
      subtopic: flashcardSet.subtopic,
      cardCount: flashcardSet.cards.length 
    });

    // Transform the data to match what the client expects
    const transformedCards = flashcardSet.cards.map(card => ({
      _id: card._id.toString(),
      front: card.question,
      back: card.answer,
      topic: flashcardSet.topic,
      subtopic: flashcardSet.subtopic
    }));

    // Return in the format expected by the client
    res.json({
      flashcards: transformedCards,
      totalCards: transformedCards.length,
      topic: flashcardSet.topic,
      subtopic: flashcardSet.subtopic
    });
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    res.status(500).json({ 
      message: 'Error fetching flashcard set', 
      error: error.message 
    });
  }
});



// Update flashcard progress
router.post('/progress/card/:setId/:cardId', auth, async (req, res) => {
  try {
    const { setId, cardId } = req.params;
    const { confidenceLevel, studyTime } = req.body;
    const userId = req.user.id;

    console.log('POST /progress/card/:setId/:cardId');
    console.log('User:', userId);
    console.log('Params:', { setId, cardId });
    console.log('Body:', { confidenceLevel, studyTime });

    // Find the flashcard set and update the specific card's progress
    const flashcardSet = await FlashcardSet.findById(setId);
    if (!flashcardSet) {
      return res.status(404).json({ message: 'Flashcard set not found' });
    }

    const card = flashcardSet.cards.id(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found in set' });
    }

    // Update card progress
    // Note: You might want to store this in a separate collection for scalability
    card.lastReviewed = new Date();
    card.timesReviewed = (card.timesReviewed || 0) + 1;
    
    // Update confidence level (0-100)
    if (typeof confidenceLevel === 'number' && confidenceLevel >= 0 && confidenceLevel <= 100) {
      card.confidenceLevel = confidenceLevel;
    }

    await flashcardSet.save();

    res.json({ 
      message: 'Progress updated',
      cardProgress: {
        lastReviewed: card.lastReviewed,
        timesReviewed: card.timesReviewed,
        confidenceLevel: card.confidenceLevel
      }
    });
  } catch (error) {
    console.error('Error updating flashcard progress:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

module.exports = router;
