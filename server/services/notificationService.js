const { sendEmail } = require('../utils/emailService');
const User = require('../models/User');
const cron = require('node-cron');

class NotificationService {
  // Send notification after quiz completion
  static async sendQuizCompletionNotification(userId, quizResult) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.email) return;

      const score = quizResult.score;
      const subject = quizResult.subject;
      let message = '';
      
      if (score >= 80) {
        message = 'Excellent work! Keep it up! 🌟';
      } else if (score >= 60) {
        message = 'Good effort! With more practice, you can improve even more! 💪';
      } else {
        message = 'Keep practicing! Remember, every attempt helps you learn. 📚';
      }

      await sendEmail({
        to: user.email,
        subject: '📝 Quiz Results Are In!',
        html: `
          <h2>Your Quiz Results Are Here! 📊</h2>
          <p>Great job completing your ${subject} quiz!</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Quiz Summary:</h3>
            <ul>
              <li>Subject: ${subject}</li>
              <li>Score: ${score}%</li>
              <li>Feedback: ${message}</li>
            </ul>
          </div>
          <p><a href="http://localhost:3000/dashboard" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Detailed Results</a></p>
        `
      });
    } catch (error) {
      console.error('Error sending quiz completion notification:', error);
    }
  }

  // Send weekly progress report (scheduled task)
  static async sendWeeklyProgressReport(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.email) return;

      // Get user's progress data for the week
      const weeklyStats = await User.getWeeklyStats(userId);

      await sendEmail({
        to: user.email,
        subject: '📊 Your Weekly Progress Report',
        html: `
          <h2>Your Weekly Progress Report 📈</h2>
          <p>Here's how you've been doing this week, ${user.username}!</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>This Week's Achievements:</h3>
            <ul>
              <li>Quizzes Completed: ${weeklyStats.quizzesTaken}</li>
              <li>Average Score: ${weeklyStats.averageScore}%</li>
              <li>Study Time: ${weeklyStats.studyHours} hours</li>
              <li>Current Streak: ${weeklyStats.streak} days</li>
            </ul>
          </div>
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Focus Areas:</h3>
            <p>${weeklyStats.recommendations}</p>
          </div>
          <p><a href="http://localhost:3000/progress" style="background-color: #9C27B0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Report</a></p>
        `
      });
    } catch (error) {
      console.error('Error sending weekly progress report:', error);
    }
  }

  // Check for inactive users and send reminders (scheduled task)
  static async checkInactiveUsers() {
    try {
      const inactiveUsers = await User.find({
        lastActive: { 
          $lt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days inactive
        }
      });

      for (const user of inactiveUsers) {
        if (!user.email) continue;

        const daysInactive = Math.floor(
          (Date.now() - user.lastActive) / (24 * 60 * 60 * 1000)
        );

        await sendEmail({
          to: user.email,
          subject: '👋 We Miss You!',
          html: `
            <h2>We Miss You! 👋</h2>
            <p>Hi ${user.username}, it's been ${daysInactive} days since your last study session.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Why Come Back?</h3>
              <ul>
                <li>New quizzes waiting for you</li>
                <li>Track your progress</li>
                <li>Improve your grades</li>
                <li>Stay on top of your studies</li>
              </ul>
            </div>
            <p>Ready to jump back in? We're here to help! 💪</p>
            <p><a href="http://localhost:3000/dashboard" style="background-color: #FF5722; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Return to Studies</a></p>
          `
        });
      }
    } catch (error) {
      console.error('Error checking inactive users:', error);
    }
  }
}

// Schedule weekly progress reports (every Sunday at 6 PM)
cron.schedule('0 18 * * 0', async () => {
  try {
    const users = await User.find({});
    for (const user of users) {
      await NotificationService.sendWeeklyProgressReport(user._id);
    }
  } catch (error) {
    console.error('Error sending weekly progress reports:', error);
  }
});

// Check for inactive users daily at 10 AM
cron.schedule('0 10 * * *', async () => {
  await NotificationService.checkInactiveUsers();
});

module.exports = NotificationService;
