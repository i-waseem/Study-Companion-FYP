const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');

// Create feedback
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received feedback request');
    console.log('Request body:', req.body);
    console.log('User:', req.user);

    const { type, message, rating } = req.body;
    if (!req.user || !req.user._id) {
      console.error('No user ID found in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    console.log('Creating feedback with userId:', userId);

    const feedback = new Feedback({
      type,
      message,
      rating,
      userId
    });

    console.log('Saving feedback:', feedback);
    await feedback.save();
    console.log('Feedback saved successfully');
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback: ' + error.message });
  }
});

// Get all feedback (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const feedback = await Feedback.find()
      .populate('userId', 'username') // Only get username from User
      .sort({ createdAt: -1 }); // Most recent first

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

module.exports = router;
