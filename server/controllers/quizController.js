const User = require('../models/User');
const NotificationService = require('../services/notificationService');

exports.submitQuiz = async (req, res) => {
  try {
    const { subject, score, answers } = req.body;
    const userId = req.user.id; // From auth middleware

    // Update user's quiz history
    const user = await User.findById(userId);
    user.quizHistory.push({
      subject,
      score,
      date: new Date()
    });

    // Update last active and study streak
    await user.updateLastActive();
    await user.updateStudyStreak();
    await user.save();

    // Send quiz completion notification
    await NotificationService.sendQuizCompletionNotification(userId, { subject, score });

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      score
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz'
    });
  }
};
