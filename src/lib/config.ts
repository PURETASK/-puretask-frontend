// API Configuration
export const API_CONFIG = {
  // Backend API URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  
  // WebSocket URL
  wsURL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000',
  
  // Timeout settings
  timeout: 30000, // 30 seconds
  
  // Retry settings
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'puretask_token',
  USER_DATA: 'puretask_user',
  REFRESH_TOKEN: 'puretask_refresh_token',
};

