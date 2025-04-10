const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.get('/', async (req, res) => {
  console.log('=== Quotes Route ===');
  
  // Log environment variables (excluding sensitive parts)
  console.log('API Key status:', {
    exists: !!process.env.GEMINI_API_KEY,
    length: process.env.GEMINI_API_KEY?.length,
    prefix: process.env.GEMINI_API_KEY?.substring(0, 6)
  });

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: true,
        message: 'Gemini API key is not configured',
        quote: 'Error: Gemini API key is missing',
        source: 'System Error'
      });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Gemini initialized');

    // Use the gemini-2.0-flash model
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
    console.log('Model selected: gemini-2.0-flash');

    const prompt = {
      contents: [{
        role: 'user',
        parts: [{
          text: `Generate an inspiring quote about learning or education. 
                Return it in this exact JSON format without any markdown formatting or code blocks:
                {
                  "quote": "the quote text here",
                  "source": "the source/author here"
                }`
        }]
      }]
    };

    console.log('Sending prompt to Gemini');
    const result = await model.generateContent(prompt);
    console.log('Received response from Gemini');
    const response = await result.response;
    const text = response.text();
    console.log('Raw response:', text);

    try {
      // Remove any markdown code block formatting if present
      const jsonStr = text.replace(/```json\s*|\s*```/g, '').trim();
      const parsedResponse = JSON.parse(jsonStr);
      console.log('Successfully parsed response:', parsedResponse);
      
      if (parsedResponse.quote && parsedResponse.source) {
        return res.json({
          quote: parsedResponse.quote,
          source: parsedResponse.source,
          isGemini: true
        });
      } else {
        console.error('Invalid response format from Gemini:', parsedResponse);
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse Gemini response');
    }

  } catch (error) {
    console.error('Gemini API Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    // Return an error message instead of a fallback quote
    res.status(500).json({
      error: true,
      message: error.message,
      quote: `Error: ${error.message}`,
      source: 'API Error',
      isGemini: false
    });
  }
});

module.exports = router;
