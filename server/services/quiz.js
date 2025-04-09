const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate quiz questions
async function generateQuizQuestions({ subject, topic, subtopic, learningObjectives }) {
  try {
    console.log('Initializing Gemini with API key:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

    console.log('Sending prompt to Gemini for:', subject, topic, subtopic);
    const prompt = `Create a quiz about ${subtopic} in ${subject} (${topic}). 
Use these specific learning objectives:
${learningObjectives ? learningObjectives.map(obj => '- ' + obj).join('\n') : 'General understanding of the topic'}

Return EXACTLY 10 questions in this JSON format (no markdown, no code blocks, just pure JSON):
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Make sure:
1. Each question tests one of the learning objectives
2. Questions are clear and unambiguous
3. All options are plausible but only one is correct
4. Explanations are concise but informative
5. The response must be pure JSON with NO markdown or code block markers
6. Include exactly 4 options for each question
7. Questions are at O-Level standard
8. Questions test understanding, not just memorization
9. correctAnswer must be the exact text of the correct option
10. Distribute questions evenly across all learning objectives`;

    console.log('Waiting for Gemini response...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini, length:', text.length);

    // Clean up any markdown or code block markers
    const cleanJson = text.replace(/```json\s*|\s*```/g, '').trim();
    console.log('Cleaned JSON length:', cleanJson.length);

    try {
      const parsedQuestions = JSON.parse(cleanJson);
      
      // Validate the structure
      if (!parsedQuestions.questions || !Array.isArray(parsedQuestions.questions)) {
        throw new Error('Invalid quiz format: missing questions array');
      }

      // Validate each question
      parsedQuestions.questions.forEach((q, i) => {
        if (!q.question || !q.options || !q.correctAnswer || !q.explanation) {
          throw new Error(`Question ${i + 1} is missing required fields`);
        }
        if (!q.options.includes(q.correctAnswer)) {
          throw new Error(`Question ${i + 1} has invalid correct answer`);
        }
        if (q.options.length !== 4) {
          throw new Error(`Question ${i + 1} must have exactly 4 options`);
        }
      });

      // Validate question count
      if (parsedQuestions.questions.length !== 10) {
        throw new Error(`Expected 10 questions but got ${parsedQuestions.questions.length}`);
      }

      console.log('Successfully parsed quiz with', parsedQuestions.questions.length, 'questions');
      return parsedQuestions;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw Response:', text);
      throw new Error('Failed to parse quiz response: ' + parseError.message);
    }
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    if (error.response) {
      console.error('API Response:', error.response);
    }
    throw error;
  }
}

// Debug function to test API connection
async function testGeminiAPI() {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    const result = await model.generateContent("Say 'API is working!'");
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API test failed:', error);
    throw error;
  }
}

module.exports = {
  generateQuizQuestions,
  testGeminiAPI
};
