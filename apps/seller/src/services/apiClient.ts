/**
 * Unified API Client for BunkerStroy Seller (Ta'minotchi) Portal
 * Supports VITE_API_URL environment variable with fallback to '/api'.
 * Automatically attaches JWT Bearer token and optional FinTech Idempotency headers.
 */

export function getApiBaseUrl(): string {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  const envUrl = (metaEnv?.VITE_API_URL ? String(metaEnv.VITE_API_URL).trim() : '').replace(/\/+$/, '');
  return envUrl || '/api';
}

export function resolveApiUrl(endpoint: string): string {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (base === '/api') {
    return cleanEndpoint.startsWith('/api') ? cleanEndpoint : `/api${cleanEndpoint}`;
  }

  if (base.endsWith('/api') && cleanEndpoint.startsWith('/api')) {
    return `${base}${cleanEndpoint.substring(4)}`;
  }

  if (!base.endsWith('/api') && !cleanEndpoint.startsWith('/api')) {
    return `${base}/api${cleanEndpoint}`;
  }

  return `${base}${cleanEndpoint}`;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = resolveApiUrl(endpoint);
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('bunkerstroy_token') || localStorage.getItem('bunker_supplier_token')
    : null;

  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PATCH', 'PUT'].includes(method) && !headers.has('X-Idempotency-Key') && !headers.has('Idempotency-Key')) {
    const randomKey = `seller-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
    headers.set('X-Idempotency-Key', randomKey);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
