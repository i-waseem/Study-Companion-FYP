const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// Get user's notification settings
exports.getNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('notificationPreferences');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.notificationPreferences);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user's notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update notification preferences
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...req.body
    };

    await user.save();

    // If email notifications are enabled, send a test email
    if (req.body.emailNotifications?.studyReminders) {
      await sendEmail({
        to: user.email,
        subject: 'Study Companion - Notification Settings Updated',
        text: `Hi ${user.username},\n\nYour notification settings have been updated successfully. You will now receive study reminders and updates according to your preferences.\n\nBest regards,\nStudy Companion Team`
      });
    }

    res.json({ 
      message: 'Notification settings updated successfully',
      settings: user.notificationPreferences 
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send study reminder
exports.sendStudyReminder = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.notificationPreferences.studyReminders.enabled) {
      return;
    }

    await sendEmail({
      to: user.email,
      subject: 'Study Reminder',
      text: `Hi ${user.username},\n\nThis is your scheduled study reminder. Time to focus on your studies!\n\nBest regards,\nStudy Companion Team`
    });

    // Update last sent timestamp
    user.notificationPreferences.studyReminders.lastSent = new Date();
    await user.save();
  } catch (error) {
    console.error('Error sending study reminder:', error);
  }
};

// Send quiz reminder
exports.sendQuizReminder = async (userId, quizInfo) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.notificationPreferences.quizReminders.enabled) {
      return;
    }

    await sendEmail({
      to: user.email,
      subject: 'New Quiz Available',
      text: `Hi ${user.username},\n\nA new quiz is available for ${quizInfo.subject}. Take it now to test your knowledge!\n\nBest regards,\nStudy Companion Team`
    });
  } catch (error) {
    console.error('Error sending quiz reminder:', error);
  }
};

// Send progress report
exports.sendProgressReport = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.notificationPreferences.progressUpdates.enabled) {
      return;
    }

    // Generate progress report
    const report = {
      quizzesTaken: user.progress?.quizzes?.length || 0,
      averageScore: calculateAverageScore(user.progress?.quizzes),
      // Add more progress metrics as needed
    };

    await sendEmail({
      to: user.email,
      subject: 'Your Study Progress Report',
      text: `Hi ${user.username},\n\nHere's your study progress report:\n\nQuizzes Taken: ${report.quizzesTaken}\nAverage Score: ${report.averageScore}%\n\nKeep up the good work!\n\nBest regards,\nStudy Companion Team`
    });
  } catch (error) {
    console.error('Error sending progress report:', error);
  }
};

// Check for inactive users and send reminders
exports.checkInactiveUsers = async () => {
  try {
    const inactiveThreshold = new Date();
    inactiveThreshold.setDate(inactiveThreshold.getDate() - 7); // 7 days of inactivity

    const inactiveUsers = await User.find({
      lastActive: { $lt: inactiveThreshold },
      'notificationPreferences.emailNotifications.inactivityAlerts': true
    });

    for (const user of inactiveUsers) {
      await sendEmail({
        to: user.email,
        subject: 'We Miss You!',
        text: `Hi ${user.username},\n\nWe noticed you haven't been studying with us lately. Come back and continue your learning journey!\n\nBest regards,\nStudy Companion Team`
      });
    }
  } catch (error) {
    console.error('Error checking inactive users:', error);
  }
};

// Helper function to calculate average score
function calculateAverageScore(quizzes) {
  if (!quizzes || quizzes.length === 0) return 0;
  const totalScore = quizzes.reduce((sum, quiz) => sum + quiz.score, 0);
  return Math.round((totalScore / quizzes.length) * 100) / 100;
}
