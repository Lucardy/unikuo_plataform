import API_CONFIG from '../config/api';

/**
 * Servicio para hacer llamadas al API
 */

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  /**
   * Realiza una petición GET
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en GET request:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición POST
   */
  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en POST request:', error);
      throw error;
    }
  }

  /**
   * Test de conexión con el backend
   */
  async testConnection(): Promise<ApiResponse> {
    return this.get('/api/test');
  }

  /**
   * Health check del backend
   */
  async healthCheck(): Promise<ApiResponse> {
    return this.get('/api/test/health');
  }
}

// Exportar una instancia única del servicio
export const apiService = new ApiService();
export default apiService;
