const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCareerGuidance(prompt) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into career recommendations
    const recommendations = text.split('\n\n').filter(Boolean).map(section => {
      const lines = section.split('\n');
      let title = '';
      let description = '';
      let educationPath = '';

      lines.forEach(line => {
        if (line.toLowerCase().includes('career:')) {
          title = line.split(':')[1].trim();
        } else if (line.toLowerCase().includes('description:')) {
          description = line.split(':')[1].trim();
        } else if (line.toLowerCase().includes('education:')) {
          educationPath = line.split(':')[1].trim();
        }
      });

      return { title, description, educationPath };
    });

    // Validate we have exactly 3 recommendations
    if (recommendations.length !== 3) {
      throw new Error('Expected exactly 3 career recommendations');
    }

    // Validate each recommendation has required fields
    recommendations.forEach((rec, i) => {
      if (!rec.title || !rec.description || !rec.educationPath) {
        throw new Error(`Career recommendation ${i + 1} is missing required fields`);
      }
    });

    return { recommendations };
  } catch (error) {
    console.error('Career Guidance Generation Error:', error);
    if (error.response) {
      console.error('API Response:', error.response);
    }
    throw error;
  }
}

module.exports = {
  generateCareerGuidance
};
