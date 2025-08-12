interface ApiError {
  code: string;
  message: string;
}

interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}

// Get base URL from environment or global window object
const getBaseUrl = (): string => {
  // Check for Vite environment variable first
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check for global window object (fallback)
  if (typeof window !== 'undefined' && (window as any).__FBC_API__) {
    return (window as any).__FBC_API__;
  }
  
  // Default fallback
  return 'https://api.fabricbot.com';
};

const BASE_URL = getBaseUrl();

// Default configuration
const DEFAULT_CONFIG: RequestConfig = {
  timeout: 10000, // 10 seconds
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Error normalization function
const normalizeError = (error: any): ApiError => {
  // If it's already normalized
  if (error.code && error.message) {
    return error;
  }

  // Network or fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed. Please check your internet connection.',
    };
  }

  // Timeout errors
  if (error.name === 'AbortError') {
    return {
      code: 'TIMEOUT_ERROR',
      message: 'Request timed out. Please try again.',
    };
  }

  // HTTP errors with response
  if (error.status) {
    const statusCode = error.status;
    let message = 'An error occurred';

    switch (statusCode) {
      case 400:
        message = 'Bad request. Please check your input.';
        break;
      case 401:
        message = 'Authentication required. Please log in.';
        break;
      case 403:
        message = 'Access denied. You do not have permission.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = `HTTP ${statusCode}: ${error.statusText || 'Unknown error'}`;
    }

    return {
      code: `HTTP_${statusCode}`,
      message,
    };
  }

  // Generic error fallback
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
  };
};

// Sleep utility for retries
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Main fetch wrapper with retries and timeout
const fetchWithRetries = async (
  url: string,
  options: RequestInit = {},
  config: RequestConfig = {}
): Promise<Response> => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { timeout, retries } = mergedConfig;

  let lastError: any;

  for (let attempt = 0; attempt <= retries!; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Merge headers
      const headers = {
        ...DEFAULT_CONFIG.headers,
        ...config.headers,
        ...options.headers,
      };

      // Add auth header placeholder (will be populated when auth is implemented)
      // TODO: Add actual auth token when authentication is implemented
      // if (authToken) {
      //   headers.Authorization = `Bearer ${authToken}`;
      // }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If response is not ok, throw error with status
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        throw error;
      }

      return response;
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx) or if it's the last attempt
      if (
        (error as any).status >= 400 && (error as any).status < 500 ||
        attempt === retries
      ) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
      await sleep(delay);
    }
  }

  throw lastError;
};

// Generic request function
const request = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  config: RequestConfig = {}
): Promise<T> => {
  try {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetchWithRetries(url, options, config);
    
    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const normalizedError = normalizeError(error);
    throw normalizedError;
  }
};

// HTTP method implementations
export const get = <T = any>(
  endpoint: string,
  config?: RequestConfig
): Promise<T> => {
  return request<T>(endpoint, { method: 'GET' }, config);
};

export const post = <T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  const options: RequestInit = {
    method: 'POST',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return request<T>(endpoint, options, config);
};

export const put = <T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  const options: RequestInit = {
    method: 'PUT',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return request<T>(endpoint, options, config);
};

export const del = <T = any>(
  endpoint: string,
  config?: RequestConfig
): Promise<T> => {
  return request<T>(endpoint, { method: 'DELETE' }, config);
};

// Export types for external use
export type { ApiError, RequestConfig, ApiResponse };

// Export base URL for reference
export { BASE_URL };