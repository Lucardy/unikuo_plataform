import API_CONFIG from '../config/api';
import type { ApiResponse } from '../types/models';

export class HttpClient {
    protected baseURL: string;

    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    /**
     * Obtener token del localStorage
     */
    protected getToken(): string | null {
        return localStorage.getItem('token');
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
     * Realiza una petición PUT con autenticación
     */
    async putAuth<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        const token = this.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
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
            console.error('Error en PUT request:', error);
            throw error;
        }
    }

    /**
     * Realiza una petición DELETE con autenticación
     */
    async deleteAuth<T = any>(endpoint: string): Promise<ApiResponse<T>> {
        const token = this.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en DELETE request:', error);
            throw error;
        }
    }
}
