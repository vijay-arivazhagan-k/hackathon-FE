/**
 * API Service
 * Centralized API client configuration and request handling
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;
  private fallbackURLs: string[] = [
    'http://127.0.0.1:8000/api',
    'http://127.0.0.1:8001/api',
    'http://localhost:8000/api',
    'http://localhost:8001/api'
  ];

  constructor(baseURL?: string) {
    this.baseURL = baseURL || this.fallbackURLs[0];
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initializeInterceptors();
  }

  /**
   * Initialize request and response interceptors
   */
  private initializeInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle API errors and try fallback URLs if connection fails
   */
  private handleError(error: AxiosError): void {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Internal server error');
          break;
        default:
          console.error('API request failed');
      }
    } else if (error.request) {
      // Request made but no response - try fallback URLs
      console.warn(`No response from server at ${this.baseURL}. Connection error:`, error.message);
    } else {
      // Error in request setup
      console.error('Error setting up request:', error.message);
    }
  }

  /**
   * Try different base URLs if the current one fails
   */
  private async tryFallbackURLs<T>(requestFn: () => Promise<T>): Promise<T> {
    let lastError: any;
    
    for (const url of this.fallbackURLs) {
      try {
        // Update base URL and client
        this.baseURL = url;
        this.client.defaults.baseURL = url;
        console.log(`Trying API at: ${url}`);
        
        return await requestFn();
      } catch (error: any) {
        lastError = error;
        console.warn(`Failed to connect to ${url}:`, error.message);
        
        // If it's not a connection error, don't try other URLs
        if (error.response && error.response.status !== 0) {
          throw error;
        }
      }
    }
    
    throw lastError || new Error('All API endpoints failed');
  }

  /**
   * GET request with fallback URL support
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.tryFallbackURLs(async () => {
      const response = await this.client.get<T>(url, config);
      return response.data;
    });
  }

  /**
   * POST request with fallback URL support
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.tryFallbackURLs(async () => {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    });
  }

  /**
   * PATCH request with fallback URL support
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.tryFallbackURLs(async () => {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    });
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Upload file with multipart/form-data
   */
  async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Set auth token
   */
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Clear auth token
   */
  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }
}

// Export singleton instance
export const apiService = new ApiService();
