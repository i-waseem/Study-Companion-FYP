require('dotenv').config();
const { sendEmail } = require('./utils/emailService');

const notifications = {
  // Study Reminder Email
  async sendStudyReminder(email, subject) {
    await sendEmail({
      to: email,
      subject: '📚 Time to Study!',
      html: `
        <h2>Hey there! Time for your study session 📚</h2>
        <p>According to your schedule, it's time to study ${subject}!</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Today's Study Goals:</h3>
          <ul>
            <li>Review previous chapter</li>
            <li>Complete practice exercises</li>
            <li>Take a quick quiz to test your knowledge</li>
          </ul>
        </div>
        <p>Remember: Consistent practice leads to success! 🌟</p>
        <p><a href="http://localhost:3000/study" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Studying Now</a></p>
      `
    });
    console.log(`Study reminder sent to ${email} for ${subject}`);
  },

  // New Quiz Available
  async sendQuizNotification(email, subject, difficulty) {
    await sendEmail({
      to: email,
      subject: '📝 New Quiz Available!',
      html: `
        <h2>New Quiz Ready for You! 🎯</h2>
        <p>We've prepared a new ${difficulty} quiz in ${subject} for you.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Quiz Details:</h3>
          <ul>
            <li>Subject: ${subject}</li>
            <li>Difficulty: ${difficulty}</li>
            <li>Time Limit: 30 minutes</li>
            <li>Questions: 10</li>
          </ul>
        </div>
        <p>Ready to test your knowledge? 💪</p>
        <p><a href="http://localhost:3000/quiz" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Take Quiz Now</a></p>
      `
    });
    console.log(`Quiz notification sent to ${email} for ${subject}`);
  },

  // Progress Report
  async sendProgressReport(email, stats) {
    await sendEmail({
      to: email,
      subject: '📊 Your Weekly Progress Report',
      html: `
        <h2>Your Weekly Progress Report 📈</h2>
        <p>Great work this week! Here's how you're doing:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>This Week's Achievements:</h3>
          <ul>
            <li>Quizzes Completed: ${stats.quizzesTaken}</li>
            <li>Average Score: ${stats.averageScore}%</li>
            <li>Study Time: ${stats.studyHours} hours</li>
            <li>Streak: ${stats.streak} days</li>
          </ul>
        </div>
        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Areas of Improvement:</h3>
          <p>${stats.improvement}</p>
        </div>
        <p><a href="http://localhost:3000/progress" style="background-color: #9C27B0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Report</a></p>
      `
    });
    console.log(`Progress report sent to ${email}`);
  },

  // Inactivity Alert
  async sendInactivityAlert(email, daysInactive) {
    await sendEmail({
      to: email,
      subject: '👋 We Miss You!',
      html: `
        <h2>We Miss You! 👋</h2>
        <p>It's been ${daysInactive} days since your last study session.</p>
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
    console.log(`Inactivity alert sent to ${email}`);
  }
};

// Test function
async function testNotification(type, email) {
  try {
    switch (type) {
      case 'study':
        await notifications.sendStudyReminder(email, 'Mathematics');
        break;
      case 'quiz':
        await notifications.sendQuizNotification(email, 'Physics', 'Intermediate');
        break;
      case 'progress':
        await notifications.sendProgressReport(email, {
          quizzesTaken: 5,
          averageScore: 85,
          studyHours: 12,
          streak: 7,
          improvement: 'You\'re doing great in Mathematics! Consider spending more time on Physics to improve your overall performance.'
        });
        break;
      case 'inactive':
        await notifications.sendInactivityAlert(email, 5);
        break;
      default:
        console.log('Invalid notification type. Use: study, quiz, progress, or inactive');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Get command line arguments
const [,, type, email] = process.argv;

if (!type || !email) {
  console.log(`
Usage: node test-notifications.js <type> <email>
Types available:
  - study    : Send a study reminder
  - quiz     : Send a new quiz notification
  - progress : Send a progress report
  - inactive : Send an inactivity alert
Example: node test-notifications.js study user@example.com
  `);
} else {
  testNotification(type, email);
}
