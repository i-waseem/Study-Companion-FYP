const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Calculate next review date based on confidence level
const calculateNextReview = (confidenceLevel) => {
  const now = new Date();
  switch(confidenceLevel) {
    case 1: // Again today
      return now;
    case 2: // Tomorrow
      return new Date(now.setDate(now.getDate() + 1));
    case 3: // In 3 days
      return new Date(now.setDate(now.getDate() + 3));
    case 4: // In a week
      return new Date(now.setDate(now.getDate() + 7));
    case 5: // In two weeks
      return new Date(now.setDate(now.getDate() + 14));
    default:
      return now;
  }
};

// Get all flashcard progress for a user
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: 'No progress found' });
    }
    res.json(progress.flashcardSets);
  } catch (err) {
    console.error('Error fetching flashcard progress:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get progress for a specific flashcard set
router.get('/set/:setId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ 
      userId: req.user.id,
      'flashcardSets.setId': req.params.setId 
    });
    
    if (!progress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    const setProgress = progress.flashcardSets.find(
      set => set.setId.toString() === req.params.setId
    );

    if (!setProgress) {
      return res.status(404).json({ message: 'Flashcard set not found' });
    }

    res.json(setProgress);
  } catch (err) {
    console.error('Error fetching set progress:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress for a flashcard
router.post('/card/:setId/:cardId', auth, async (req, res) => {
  try {
    const { confidenceLevel } = req.body;
    if (!confidenceLevel || confidenceLevel < 1 || confidenceLevel > 5) {
      return res.status(400).json({ message: 'Invalid confidence level' });
    }

    const progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    const setIndex = progress.flashcardSets.findIndex(
      set => set.setId.toString() === req.params.setId
    );

    if (setIndex === -1) {
      // Initialize new flashcard set progress
      progress.flashcardSets.push({
        setId: req.params.setId,
        subject: req.body.subject,
        topic: req.body.topic,
        subtopic: req.body.subtopic,
        totalCards: req.body.totalCards,
        cards: []
      });
    }

    const set = progress.flashcardSets[setIndex];
    const cardIndex = set.cards.findIndex(
      card => card.cardId.toString() === req.params.cardId
    );

    const now = new Date();
    const nextReviewDue = calculateNextReview(confidenceLevel);

    if (cardIndex === -1) {
      // New card
      set.cards.push({
        cardId: req.params.cardId,
        lastReviewed: now,
        nextReviewDue,
        confidenceLevel,
        timesReviewed: 1
      });
    } else {
      // Update existing card
      set.cards[cardIndex].lastReviewed = now;
      set.cards[cardIndex].nextReviewDue = nextReviewDue;
      set.cards[cardIndex].confidenceLevel = confidenceLevel;
      set.cards[cardIndex].timesReviewed++;
    }

    // Update set progress
    set.lastStudied = now;
    set.masteredCards = set.cards.filter(card => card.confidenceLevel >= 4).length;
    
    // Update study streak
    const lastActive = new Date(progress.lastActive);
    const daysSinceLastActive = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastActive <= 1) {
      set.studyStreak++;
    } else {
      set.studyStreak = 1;
    }

    // Update user's overall progress
    progress.lastActive = now;
    progress.totalStudyTime += req.body.studyTime || 0;

    await progress.save();
    res.json(set);
  } catch (err) {
    console.error('Error updating card progress:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get due cards for review
router.get('/due', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: 'No progress found' });
    }

    const now = new Date();
    const dueCards = progress.flashcardSets.reduce((acc, set) => {
      const dueInSet = set.cards.filter(card => card.nextReviewDue <= now);
      if (dueInSet.length > 0) {
        acc.push({
          setId: set.setId,
          subject: set.subject,
          topic: set.topic,
          subtopic: set.subtopic,
          dueCards: dueInSet
        });
      }
      return acc;
    }, []);

    res.json(dueCards);
  } catch (err) {
    console.error('Error fetching due cards:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
