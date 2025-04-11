const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI response
router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ content: text });
    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ 
            message: 'Failed to generate AI response',
            error: error.message 
        });
    }
});

module.exports = router;
