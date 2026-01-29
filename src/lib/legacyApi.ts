import { API_CONFIG, STORAGE_KEYS } from './config';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export async function legacyFetch(path: string, init: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(init.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = path.startsWith('http') ? path : `${API_CONFIG.baseURL}${path}`;
  return fetch(url, { ...init, headers });
}

export async function legacyFetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await legacyFetch(path, init);
  return response.json();
}
