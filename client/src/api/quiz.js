import api from './config';

export const generateQuiz = async (subject, topic) => {
  console.log('Generating quiz with params:', { subject, topic });
  
  try {
    // Clean and format the inputs
    const formattedSubject = subject.replace(/-/g, ' ');
    const formattedTopic = topic.replace(/-/g, ' ');
    
    console.log('Sending request with formatted params:', {
      subject: formattedSubject,
      topic: formattedTopic
    });

    const response = await api.post('/quiz/generate', {
      subject: formattedSubject,
      topic: formattedTopic,
      subtopic: formattedTopic // Using topic as subtopic for now
    }, {
      withCredentials: true
    });

    console.log('Quiz generation successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Quiz generation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Throw a more informative error
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to generate quiz. Please try again.'
    );
  }
};

export const submitQuizResult = async (quizResult) => {
  try {
    const response = await api.post('/quiz/submit', quizResult, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Quiz submission error:', error.response || error);
    throw error;
  }
};
