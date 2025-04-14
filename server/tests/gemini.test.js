require('dotenv').config();
const { getGeminiResponse } = require('../utils/gemini');

describe('Gemini API Tests', () => {
  test('Generate Quiz Question', async () => {
    const prompt = {
      subject: 'Mathematics',
      topic: 'Algebra',
      difficulty: 'medium'
    };
    
    const response = await getGeminiResponse(
      `Generate a ${prompt.difficulty} difficulty quiz question about ${prompt.topic} in ${prompt.subject}`
    );
    
    expect(response).toBeTruthy();
    expect(response.error).toBeFalsy();
  }, 10000); // Increased timeout for API call

  test('Generate Career Guidance', async () => {
    const interests = ['mathematics', 'science'];
    const response = await getGeminiResponse(
      `Suggest career paths for someone interested in ${interests.join(', ')} at O-level`
    );
    
    expect(response).toBeTruthy();
    expect(response.error).toBeFalsy();
  }, 10000);

  test('Generate Motivational Quote', async () => {
    const response = await getGeminiResponse(
      'Generate an inspirational quote about learning and education'
    );
    
    expect(response).toBeTruthy();
    expect(response.error).toBeFalsy();
  }, 10000);
});
