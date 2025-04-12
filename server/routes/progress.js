const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const activityTracker = require('../services/activityTracker');

// Get user's progress
router.get('/user', auth, async (req, res) => {
  try {
    console.log('Fetching progress for user:', req.user.userId);
    
    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    let progress = await Progress.findOne({ 
      userId: req.user.userId 
    });
    
    console.log('Found progress:', progress);
    
    if (!progress) {
      console.log('No progress found, creating default');
      progress = new Progress({
        userId: req.user.userId,
        quizzes: [],
        subjects: [],
        activities: [],
        totalStudyTime: 0
      });
      await progress.save();
      console.log('Created default progress:', progress);
    }
    res.json(progress);
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Record a quiz attempt
router.post('/quiz', auth, async (req, res) => {
  try {
    console.log('Recording quiz attempt:', req.body);
    const { subject, topic, score, totalQuestions } = req.body;
    
    // Input validation
    if (!subject || !topic || typeof score !== 'number' || !totalQuestions) {
      return res.status(400).json({ 
        message: 'Invalid input', 
        received: { subject, topic, score, totalQuestions } 
      });
    }

    // Ensure user ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    let progress = await Progress.findOne({ 
      userId: req.user.userId 
    });
    
    console.log('Found existing progress:', progress);
    
    if (!progress) {
      progress = new Progress({ 
        userId: req.user.userId,
        quizzes: [],
        subjects: []
      });
    }

    // Add quiz result
    const quizResult = {
      subject,
      topic,
      score,
      totalQuestions,
      date: new Date()
    };
    progress.quizzes.push(quizResult);
    console.log('Added quiz result:', quizResult);

    // Find or create subject
    let subjectDoc = progress.subjects.find(s => s.name === subject);
    if (!subjectDoc) {
      subjectDoc = { name: subject, topics: [] };
      progress.subjects.push(subjectDoc);
    }

    // Find or create topic
    let topicDoc = subjectDoc.topics.find(t => t.name === topic);
    if (!topicDoc) {
      topicDoc = {
        name: topic,
        quizzesTaken: 0,
        averageScore: 0
      };
      subjectDoc.topics.push(topicDoc);
    }

    // Update topic stats
    const percentageScore = (score / totalQuestions) * 100;
    const newQuizzesTaken = topicDoc.quizzesTaken + 1;
    const newAverageScore = (
      (topicDoc.averageScore * topicDoc.quizzesTaken) + percentageScore
    ) / newQuizzesTaken;

    topicDoc.quizzesTaken = newQuizzesTaken;
    topicDoc.averageScore = newAverageScore;

    console.log('Saving progress:', progress);
    await progress.save();
    console.log('Progress saved successfully');
    res.json(progress);
  } catch (err) {
    console.error('Error recording quiz progress:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all activities for a user
// Log an activity
router.post('/activity', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, data, duration } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({ message: 'Type and data are required' });
    }

    const activity = await activityTracker.logActivity(userId, type, data, duration);
    res.json(activity);
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user activities
router.get('/activities', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, startDate, endDate } = req.query;
    console.log('Getting activities for user:', userId);

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Create filter object
    const filter = {};
    if (type) filter.type = type;
    if (startDate) filter.startDate = new Date(startDate);
    if (endDate) filter.endDate = new Date(endDate);

    const activities = await activityTracker.getUserActivities(userId, filter);
    const stats = await activityTracker.getStats(userId);

    res.json({
      activities,
      stats,
      totalActivities: activities.length
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
