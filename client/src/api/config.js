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
  getProgress: () => axiosInstance.get('/progress/user'),
  getActivities: () => axiosInstance.get('/progress/activities'),
  getAchievements: () => Promise.resolve({ data: [] }), // Placeholder until implemented
  getAchievementSummary: () => Promise.resolve({ data: { totalAchievements: 0, currentLevel: 1, currentStreak: 0, totalStudyTime: 0 } }), // Placeholder
  getSubjectProgress: (subject) => axiosInstance.get(`/progress/${subject}`),
  updateProgress: (data) => axiosInstance.post('/progress', data),
  
  // Flashcard endpoints
  getFlashcards: (subject) => axiosInstance.get(`/flashcards/${subject}`),
  getFlashcardsByTopic: (subject, topic) => axiosInstance.get(`/flashcards/${subject}/${topic}`),
  updateFlashcardProgress: (setId, cardId, data) => axiosInstance.put(`/flashcards/${setId}/${cardId}`, data),
  getDueCards: () => axiosInstance.get('/flashcards/due'),
  
  // Generic request methods
  get: (url) => url.startsWith('/api/') ? axiosInstance.get(url.substring(4)) : axiosInstance.get(url),
  post: (url, data) => url.startsWith('/api/') ? axiosInstance.post(url.substring(4), data) : axiosInstance.post(url, data),
  put: (url, data) => url.startsWith('/api/') ? axiosInstance.put(url.substring(4), data) : axiosInstance.put(url, data),
  delete: (url) => url.startsWith('/api/') ? axiosInstance.delete(url.substring(4)) : axiosInstance.delete(url)
};

export default api;
