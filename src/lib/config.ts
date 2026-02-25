// API Configuration — same precedence as getApiBaseUrl() in apiClient.ts
function getApiBaseUrl(): string {
  const raw = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:4000'
  ).trim().replace(/\/$/, '');
  // Defensive: use only a valid URL origin (avoid env paste errors like "http://localhost:4000 and NEXT_PUBLIC_API_URL=...")
  try {
    const parsed = new URL(raw);
    return parsed.origin;
  } catch {
    const match = raw.match(/^(https?:\/\/[^\s]+?)(?:\s|$)/);
    return match ? match[1].replace(/\/$/, '') : 'http://localhost:4000';
  }
}

export const API_CONFIG = {
  // Backend API URL (used by axios in api.ts; all services use this)
  baseURL: getApiBaseUrl(),
  
  // WebSocket URL
  wsURL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000',
  
  // Timeout settings
  timeout: 30000, // 30 seconds
  
  // Retry settings
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Storage keys — use these consistently. Token key must match in apiClient, api.ts, AuthContext.
export const STORAGE_KEYS = {
  /** JWT stored after login. apiClient and api.ts read this for Authorization: Bearer. */
  AUTH_TOKEN: 'puretask_token',
  USER_DATA: 'puretask_user',
  REFRESH_TOKEN: 'puretask_refresh_token',
};

