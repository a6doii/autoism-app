const BASE_URL = process.env.REACT_APP_API_URL || '';
const STATIC_BASE = process.env.REACT_APP_API_URL || 'https://autoism-backend-production.up.railway.app';

export function staticUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STATIC_BASE}${path}`;
}

export function setAuthToken(token) {
  if (token) localStorage.setItem('auth_token', token);
  else localStorage.removeItem('auth_token');
}

export function getAuthToken() {
  return localStorage.getItem('auth_token');
}

export async function api(path, options = {}) {
  const isFormData = options.isFormData === true;
  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}/api${path}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data.error || data.message || `Request failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
