const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateCareerGuidance } = require('../services/career');

// Generate career guidance recommendations
router.post('/generate', auth, async (req, res) => {
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
