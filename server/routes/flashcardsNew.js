const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FlashcardSet = require('../models/FlashcardSet');
const { generateFlashcardAnswer } = require('../services/flashcard');

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

// Generate answer from key points
router.post('/generate-answer', auth, async (req, res) => {
  try {
    const { question, keyPoints } = req.body;
    
    if (!question || !keyPoints) {
      return res.status(400).json({ error: 'Question and key points are required' });
    }

    const answer = await generateFlashcardAnswer(question, keyPoints);
    res.json({ answer });
  } catch (error) {
    console.error('Error generating answer:', error);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
});

module.exports = router;
