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

class ApiClient {
  private baseUrl = '/api';

  private async ensureToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    let token = localStorage.getItem('bunker_admin_token') || localStorage.getItem('bunkerstroy_token');
    if (!token) {
      try {
        const res = await fetch('/api/auth/login', {
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

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.ensureToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (token) {
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

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const headers = await this.getAuthHeaders();
      let url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
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
          ? "Tarmoq bilan aloqa uzildi. Server (port 4050) faolligini tekshiring."
          : err.message,
        0
      );
    }
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
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
          ? "Tarmoq bilan aloqa uzildi. Server (port 4050) faolligini tekshiring."
          : err.message,
        0
      );
    }
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
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

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
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
