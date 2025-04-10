const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FlashcardSet = require('../models/FlashcardSet');

// Get all subjects
router.get('/subjects', auth, async (req, res) => {
  try {
    const subjects = await FlashcardSet.distinct('subject');
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get all flashcards for a subject
router.get('/:subject', auth, async (req, res) => {
  try {
    const { subject } = req.params;
    const flashcardSets = await FlashcardSet.find({ subject }).lean();
    
    // Combine all cards from all sets
    const allCards = flashcardSets.reduce((cards, set) => {
      return cards.concat(set.cards.map(card => ({
        id: card._id.toString(),
        question: card.question,
        answer: card.answer,
        topic: set.topic,
        subtopic: set.subtopic
      })));
    }, []);

    res.json({
      subject,
      cards: allCards,
      totalCards: allCards.length
    });
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

module.exports = router;
