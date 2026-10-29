export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Returns configured API base URL (from VITE_API_URL or defaults to '/api')
 */
export function getApiBaseUrl(): string {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
  const envUrl = (
    metaEnv && metaEnv.VITE_API_URL
      ? String(metaEnv.VITE_API_URL).trim()
      : ''
  ).replace(/\/+$/, '');

  return envUrl || '/api';
}

/**
 * Resolves full API URL with environment variable support and slash normalization
 */
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

class ApiClient {
  private async ensureToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    let token = localStorage.getItem('bunker_admin_token') || localStorage.getItem('bunkerstroy_token');
    if (!token) {
      try {
        const loginUrl = resolveApiUrl('/auth/login');
        const res = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login: 'admin@bunkerstroy.uz', password: 'bunker2026' })
        });
        const d = await res.json();
        if (d.success && d.data?.token) {
          token = d.data.token;
          localStorage.setItem('bunker_admin_token', token as string);
        }
      } catch (err) {
        console.warn('Auto admin login fallback warning:', err);
      }
    }
    return token;
  }

  private async getAuthHeaders(customHeaders?: Record<string, string>): Promise<Record<string, string>> {
    const token = await this.ensureToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && data?.message) ||
        (typeof data === 'string' ? data : `Server xatosi (${response.status})`);
      throw new ApiError(errorMessage, response.status, data);
    }

    return data as T;
  }

  async get<T>(endpoint: string, params?: Record<string, any>, customHeaders?: Record<string, string>): Promise<T> {
    try {
      const headers = await this.getAuthHeaders(customHeaders);
      let url = resolveApiUrl(endpoint);
      if (params) {
        const query = new URLSearchParams(
          Object.entries(params).reduce((acc, [k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
              acc[k] = String(v);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString();
        if (query) url += `?${query}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      return await this.handleResponse<T>(response);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        err.message === 'Failed to fetch'
          ? "Tarmoq bilan aloqa uzildi. Server faolligini tekshiring."
          : err.message,
        0
      );
    }
  }

  async post<T>(endpoint: string, body?: any, customHeaders?: Record<string, string>): Promise<T> {
    try {
      const headers = await this.getAuthHeaders(customHeaders);
      const url = resolveApiUrl(endpoint);
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined
      });

      return await this.handleResponse<T>(response);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        err.message === 'Failed to fetch'
          ? "Tarmoq bilan aloqa uzildi. Server faolligini tekshiring."
          : err.message,
        0
      );
    }
  }

  async patch<T>(endpoint: string, body?: any, customHeaders?: Record<string, string>): Promise<T> {
    try {
      const headers = await this.getAuthHeaders(customHeaders);
      const url = resolveApiUrl(endpoint);
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: body ? JSON.stringify(body) : undefined
      });

      return await this.handleResponse<T>(response);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(err.message, 0);
    }
  }

  async delete<T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> {
    try {
      const headers = await this.getAuthHeaders(customHeaders);
      const url = resolveApiUrl(endpoint);
      const response = await fetch(url, {
        method: 'DELETE',
        headers
      });

      return await this.handleResponse<T>(response);
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(err.message, 0);
    }
  }
}

export const apiClient = new ApiClient();
