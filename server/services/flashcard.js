const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateFlashcardAnswer(question, keyPoints) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
    
    const prompt = `Question: "${question}"
Key Points: ${keyPoints}

Provide a 2-3 sentence answer that captures the main idea. Use very simple language.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating flashcard answer:', error);
    throw error;
  }
}

module.exports = {
  generateFlashcardAnswer
};
