import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // This is required for cookies to work
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

const api = {
  // Auth endpoints
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  
  // Quiz endpoints
  generateQuiz: (params) => axiosInstance.post('/quiz/generate', params),
  getQuizHistory: () => axiosInstance.get('/quiz/history'),
  
  // Progress endpoints
  getProgress: () => axiosInstance.get('/progress'),
  getSubjectProgress: (subject) => axiosInstance.get(`/progress/${subject}`),
  updateProgress: (data) => axiosInstance.post('/progress', data),
  
  // Flashcard endpoints
  getFlashcards: (subject) => axiosInstance.get(`/flashcards/${subject}`),
  getFlashcardsByTopic: (subject, topic) => axiosInstance.get(`/flashcards/${subject}/${topic}`),
  updateFlashcardProgress: (setId, cardId, data) => axiosInstance.put(`/flashcards/${setId}/${cardId}`, data),
  getDueCards: () => axiosInstance.get('/flashcards/due'),
  
  // Generic request methods
  get: (url) => axiosInstance.get(url),
  post: (url, data) => axiosInstance.post(url, data),
  put: (url, data) => axiosInstance.put(url, data),
  delete: (url) => axiosInstance.delete(url)
};

export default api;
