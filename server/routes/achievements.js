const express = require('express');
const router = express.Router();
const AchievementService = require('../services/achievementService');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's achievement summary
router.get('/summary', auth, async (req, res) => {
  try {
    console.log('Getting achievement summary for user:', req.user.userId);
    const summary = await AchievementService.getAchievementSummary(req.user.userId);
    res.json(summary);
  } catch (error) {
    console.error('Error getting achievement summary:', error);
    res.status(500).json({ message: 'Error getting achievement summary' });
  }
});

// Get user's achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    console.log('Getting achievements for user:', req.user.userId);
    const achievement = await Achievement.findOne({ userId: req.user.userId });
    if (!achievement) {
      return res.json({
        achievements: [],
        stats: {
          totalStudyTime: 0,
          longestStreak: 0,
          totalCardsMastered: 0,
          perfectRecalls: 0,
          subjectsCompleted: 0
        }
      });
    }
    res.json({
      achievements: achievement.achievements,
      stats: achievement.stats
    });
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({ message: 'Error getting achievements' });
  }
});

// Get user's level and XP
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('level xp');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      level: user.level || 1,
      xp: user.xp || 0,
      nextLevelXP: AchievementService.LEVEL_XP_REQUIREMENTS[(user.level || 1) + 1] || null
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ message: 'Error getting progress' });
  }
});

module.exports = router;
