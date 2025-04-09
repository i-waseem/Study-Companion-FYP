require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const NotificationService = require('./services/notificationService');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function testNotificationFlow() {
  try {
    // 1. Create or find test user
    let testUser = await User.findOne({ email: 'iqrawaseem@protonmail.com' });
    
    if (!testUser) {
      testUser = new User({
        username: 'iqra_test',
        email: 'iqrawaseem@protonmail.com',
        password: 'password123',
        gradeLevel: '12',
        selectedSubjects: ['Mathematics', 'Physics', 'Chemistry']
      });
      await testUser.save();
      console.log('Test user created');
    }

    // 2. Simulate quiz completions
    const quizzes = [
      { subject: 'Mathematics', score: 85 },
      { subject: 'Physics', score: 70 },
      { subject: 'Chemistry', score: 95 }
    ];

    for (const quiz of quizzes) {
      // Add quiz to history
      testUser.quizHistory.push({
        subject: quiz.subject,
        score: quiz.score,
        date: new Date()
      });

      // Simulate study session
      testUser.studySessions.push({
        subject: quiz.subject,
        duration: 45, // 45 minutes
        date: new Date()
      });

      // Update streak and last active
      await testUser.updateLastActive();
      await testUser.updateStudyStreak();

      // Send quiz completion notification
      await NotificationService.sendQuizCompletionNotification(
        testUser._id, 
        quiz
      );
      
      console.log(`Quiz completion notification sent for ${quiz.subject}`);
      
      // Wait 2 seconds between notifications
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 3. Send progress report
    await NotificationService.sendWeeklyProgressReport(testUser._id);
    console.log('Weekly progress report sent');

    // 4. Simulate inactivity (optional)
    const simulateInactivity = process.argv.includes('--simulate-inactive');
    if (simulateInactivity) {
      // Set last active to 6 days ago
      testUser.lastActive = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
      await testUser.save();
      await NotificationService.checkInactiveUsers();
      console.log('Inactivity notification sent');
    }

    console.log('\nTest completed successfully! Check your email.');
    console.log('You should receive:');
    console.log('1. Three quiz completion notifications');
    console.log('2. One weekly progress report');
    if (simulateInactivity) {
      console.log('3. One inactivity alert');
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
  }
}

// Run the test
testNotificationFlow();
