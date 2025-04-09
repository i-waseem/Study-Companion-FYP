const express = require('express');
const router = express.Router();
const AchievementService = require('../services/achievementService');
const auth = require('../middleware/auth');

// Get user's achievement summary
router.get('/summary', auth, async (req, res) => {
  try {
    const summary = await AchievementService.getAchievementSummary(req.user.id);
    res.json(summary);
  } catch (error) {
    console.error('Error getting achievement summary:', error);
    res.status(500).json({ message: 'Error getting achievement summary' });
  }
});

// Get user's badges
router.get('/badges', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('badges');
    res.json(user.badges);
  } catch (error) {
    console.error('Error getting badges:', error);
    res.status(500).json({ message: 'Error getting badges' });
  }
});

// Get user's achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('achievements');
    res.json(user.achievements);
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({ message: 'Error getting achievements' });
  }
});

// Get user's level and XP
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('level xp');
    res.json({
      level: user.level,
      xp: user.xp,
      nextLevelXP: LEVEL_XP_REQUIREMENTS[user.level + 1] || null
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ message: 'Error getting progress' });
  }
});

module.exports = router;
