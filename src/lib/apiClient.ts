// src/lib/apiClient.ts
// Fetch-based API client for Trust-Fintech REST endpoints.
// Uses Bearer token auth (matches existing PureTask auth).
// For cookie sessions, swap to credentials: "include" and remove Authorization header.

import { STORAGE_KEYS } from './config';

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ''
  ).replace(/\/$/, '');
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function parseError(res: Response): Promise<ApiError> {
  let details: unknown = undefined;
  try {
    details = await res.json();
  } catch {
    // ignore
  }

  return {
    status: res.status,
    message:
      (typeof (details as Record<string, unknown>)?.message === 'string' &&
        (details as Record<string, unknown>).message) ||
      res.statusText ||
      'Request failed',
    details,
  };
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBaseUrl();
  const url = base ? `${base}${path}` : path;

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...getAuthHeaders(),
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) throw await parseError(res);
  return (await res.json()) as T;
}

export async function apiPost<TReq, TRes>(
  path: string,
  body: TReq,
  init?: RequestInit
): Promise<TRes> {
  const base = getApiBaseUrl();
  const url = base ? `${base}${path}` : path;

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...getAuthHeaders(),
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
    ...init,
  });

  if (!res.ok) throw await parseError(res);
  return (await res.json()) as TRes;
}
