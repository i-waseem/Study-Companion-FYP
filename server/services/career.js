const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCareerGuidance(prompt) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
    
    // Add structure to the prompt
    const structuredPrompt = `Based on: ${prompt}

Provide exactly 3 career suggestions in this format:
1. [Career Title] - Brief one-line description
2. [Career Title] - Brief one-line description
3. [Career Title] - Brief one-line description

Keep it simple and direct.`;

    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = response.text();

    // Split into lines and filter out empty ones
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Take only the first 3 non-empty lines
    const recommendations = lines.slice(0, 3).map(line => {
      const [title, ...descParts] = line.substring(3).split('-');
      return {
        title: title.trim(),
        description: descParts.join('-').trim(),
        educationPath: 'Explore specific requirements for this field'
      };
    });

    return { recommendations };
  } catch (error) {
    console.error('Career Guidance Generation Error:', error);
    throw error;
  }
}

async function testGeminiAPI() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
    const result = await model.generateContent('Say "API is working!"');
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API test failed:', error);
    throw error;
  }
}

module.exports = {
  generateCareerGuidance,
  testGeminiAPI
};
