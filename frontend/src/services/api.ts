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

  /**
   * Test de conexión con la base de datos
   */
  async testDatabase(): Promise<ApiResponse> {
    return this.get('/api/database/test');
  }

  /**
   * Obtener datos de prueba de la base de datos
   */
  async getDatabaseData(): Promise<ApiResponse> {
    return this.get('/api/database/data');
  }

  /**
   * Obtener token del localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Realiza una petición GET con autenticación
   */
  async getAuth<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers,
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
   * Realiza una petición POST con autenticación
   */
  async postAuth<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en POST request:', error);
      throw error;
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    roleIds?: string[];
  }): Promise<ApiResponse> {
    const response = await this.post('/api/auth/register', userData);
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response;
  }

  /**
   * Iniciar sesión
   */
  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.post('/api/auth/login', { email, password });
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response;
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Obtener información del usuario autenticado
   */
  async getMe(): Promise<ApiResponse> {
    return this.getAuth('/api/auth/me');
  }

  /**
   * Obtener todos los roles disponibles
   */
  async getRoles(): Promise<ApiResponse> {
    return this.get('/api/auth/roles');
  }

  /**
   * Verificar si hay un token guardado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtener usuario del localStorage
   */
  getStoredUser(): any | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// Exportar una instancia única del servicio
export const apiService = new ApiService();
export default apiService;
