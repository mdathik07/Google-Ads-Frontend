// API configuration for both development and production
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000' 
  : (process.env.REACT_APP_API_URL || 'https://your-backend-domain.com');

console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🌐 API Base URL:', API_BASE_URL);
console.log('📍 Current hostname:', window.location.hostname);

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },
  CHAT: {
    SESSION: `${API_BASE_URL}/api/chat/session`,
    MESSAGE: `${API_BASE_URL}/api/chat/message`,
  },
  CAMPAIGN: {
    GENERATE: `${API_BASE_URL}/api/campaign/generate`,
    LAUNCH: `${API_BASE_URL}/api/campaign/launch`,
  },
};

export default API_BASE_URL; 