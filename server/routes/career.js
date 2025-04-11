const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateCareerGuidance, testGeminiAPI } = require('../services/career');

// Test endpoint
router.get('/test', async (req, res) => {
  try {
    const result = await testGeminiAPI();
    res.json({ message: result });
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate career guidance recommendations
router.post('/', auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      throw new Error('Missing required prompt');
    }

    const guidance = await generateCareerGuidance(prompt);
    res.json(guidance);
  } catch (error) {
    console.error('Career guidance generation error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
