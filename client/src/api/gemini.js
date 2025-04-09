import axios from '../../config/axios';

export const getGeminiResponse = async () => {
  try {
    const response = await axios.get('/api/quotes');
    return response.data;
  } catch (error) {
    console.error('Error in getGeminiResponse:', error);
    throw error;
  }
};
