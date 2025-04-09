require('dotenv').config();
const { sendEmail } = require('./utils/emailService');

async function testEmail(recipientEmail) {
  try {
    await sendEmail({
      to: recipientEmail, // Send to the email provided
      subject: 'Welcome to Study Companion! ',
      text: 'Welcome to Study Companion! Your account is ready to use.',
      html: `
        <h2> Welcome to Study Companion!</h2>
        <p>Hi there!</p>
        <p>Your account has been successfully set up. Here's what you can expect:</p>
        <ul>
          <li> Personalized study reminders</li>
          <li> Notifications when new quizzes are available</li>
          <li> Weekly progress reports</li>
          <li> AI-powered study recommendations</li>
        </ul>
        <p>Ready to start learning? Log in to your account and:</p>
        <ol>
          <li>Set your grade level</li>
          <li>Choose your subjects</li>
          <li>Take your first quiz!</li>
        </ol>
        <p>Happy studying! </p>
      `
    });
    console.log(`Welcome email sent successfully to ${recipientEmail}!`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

// You can test with any email address
const testRecipientEmail = process.argv[2]; // Get email from command line argument

if (!testRecipientEmail) {
  console.log('Please provide an email address to test. Usage: node test-email.js your.email@example.com');
} else {
  testEmail(testRecipientEmail);
}
