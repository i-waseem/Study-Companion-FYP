const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendEmail } = require('../utils/emailService');
const {
  getNotificationSettings,
  updateNotificationSettings
} = require('../controllers/notificationController');

// Get notification settings
router.get('/settings', auth, getNotificationSettings);

// Update notification settings
router.put('/settings', auth, updateNotificationSettings);

// Test email route (remove in production)
router.post('/test-email', auth, async (req, res) => {
  try {
    await sendEmail({
      to: req.user.email,
      subject: 'Test Email from Study Companion',
      text: 'This is a test email from Study Companion. If you received this, email notifications are working!'
    });
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Failed to send test email' });
  }
});

module.exports = router;
