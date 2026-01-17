import { HttpClient } from './http';
import type { ApiResponse } from '../types/models';

export class AuthService extends HttpClient {
    /**
     * Registrar nuevo usuario
     */
    async register(userData: {
        email: string;
        password: string;
        nombre: string;
        apellido: string;
        rolesIds?: string[];
    }): Promise<ApiResponse> {
        const response = await this.post('/api/auth/register', userData);
        if (response.success && response.data?.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.usuario) {
                localStorage.setItem('user', JSON.stringify(response.data.usuario));
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
            if (response.data.usuario) {
                localStorage.setItem('user', JSON.stringify(response.data.usuario));
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
     * Obtener todos los roles disponibles (público)
     */
    async getPublicRoles(): Promise<ApiResponse> {
        return this.get('/api/auth/roles');
    }

    /**
     * Verificar si hay un token guardado
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
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
