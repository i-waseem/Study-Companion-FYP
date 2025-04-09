const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, gradeLevel, selectedSubjects } = req.body;
    
    // Find user and check if username is taken (if username is being changed)
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    // Update user fields
    user.username = username;
    if (gradeLevel) user.gradeLevel = gradeLevel;
    if (selectedSubjects) user.selectedSubjects = selectedSubjects;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user settings
router.get('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user settings
    res.json({
      profile: {
        username: user.username,
        email: user.email,
        gradeLevel: user.gradeLevel,
        selectedSubjects: user.selectedSubjects || []
      },
      theme: user.themeSettings || {
        theme: 'light',
        fontSize: 'medium',
        colorScheme: 'default'
      },
      studyPreferences: user.studyPreferences || {
        sessionDuration: 25,
        breakInterval: 5,
        cardsPerSession: 10,
        timePerQuestion: 60
      },
      privacy: user.privacySettings || {
        profileVisibility: 'public',
        shareProgress: true,
        trackActivity: true
      },
      notifications: user.notificationSettings || {
        studyReminders: { enabled: true, frequency: 'daily' },
        quizReminders: { enabled: true, frequency: 'weekly' },
        progressUpdates: { enabled: true, frequency: 'weekly' },
        emailNotifications: {
          studyReminders: true,
          quizAvailable: true,
          progressReports: true,
          inactivityAlerts: true
        }
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user settings
router.put('/settings', auth, async (req, res) => {
  try {
    const { theme, studyPreferences, privacy, notifications } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update settings
    if (theme) user.themeSettings = theme;
    if (studyPreferences) user.studyPreferences = studyPreferences;
    if (privacy) user.privacySettings = privacy;
    if (notifications) user.notificationSettings = notifications;

    await user.save();
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete account
router.delete('/account', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
