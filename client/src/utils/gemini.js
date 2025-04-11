import api from '../api/config';

export const getGeminiResponse = async (endpoint = '/quotes') => {
  try {
    console.log('Fetching from endpoint:', endpoint);
    const response = await api.get(endpoint);
    console.log('AI response:', response.data);
    
    if (!response.data) {
      throw new Error('Invalid response format from server');
    }

    return response.data;
  } catch (error) {
    console.error('Error in getGeminiResponse:', {
      error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getCareerGuidance = async (prompt) => {
  try {
    console.log('Sending prompt to server:', prompt);
    const response = await api.post('/api/career', { prompt });
    console.log('AI response:', response.data);
    
    if (!response.data || !response.data.recommendations) {
      throw new Error('Invalid response format from server');
    }

    return response.data.recommendations;
  } catch (error) {
    console.error('Error in getCareerGuidance:', {
      error,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export function generateCareerGuidancePrompt(answers) {
    return `Based on the following student profile, suggest exactly 3 career paths that would be a good fit. Format each recommendation with Career:, Description:, and Education: on separate lines, with a blank line between recommendations.

Student Profile:
Interests: ${answers.interests.join(', ')}
Skills: ${answers.skills.join(', ')}
Favorite Subjects: ${answers.subjects.join(', ')}
Preferred Work Style: ${answers.workStyle}
Career Values: ${answers.values.join(', ')}

Provide the recommendations in this exact format:

Career: [Job Title]
Description: [Brief description of the role and why it matches their profile]
Education: [Required education path and certifications]

[repeat for next career]

Ensure each career recommendation is unique and matches their interests and skills.`;
}

export function generateQuizPrompt(topic, difficulty = 'medium', count = 5) {
    return `Generate ${count} multiple-choice questions about ${topic} at ${difficulty} difficulty level.
    For each question, provide:
    1. The question text
    2. Four answer options (A, B, C, D)
    3. The correct answer
    4. A brief explanation of why it's correct
    
    Format each question in a consistent, easy-to-parse structure.`;
}

export function generateFlashcardsPrompt(topic, count = 10) {
    return `Create ${count} flashcards about ${topic}.
    For each flashcard, provide:
    1. A clear, concise question or term on the front
    2. A comprehensive explanation or definition on the back
    3. Any relevant examples or memory tips
    
    Format each flashcard in a consistent, easy-to-parse structure.`;
}

export function generateStudyNotesPrompt(topic) {
    return `Create comprehensive study notes about ${topic}.
    Include:
    1. Main concepts and definitions
    2. Key points and important details
    3. Examples and applications
    4. Common misconceptions
    5. Practice questions
    
    Format the notes in a clear, structured way that's easy to study from.`;
}

export function generateMotivationalQuotePrompt() {
    return `Generate an inspiring and motivational quote about learning, education, or personal growth. 
    The quote should be concise (1-2 sentences) and impactful. 
    Return just the quote text without attribution.`;
}
