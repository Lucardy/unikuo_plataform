import { HttpClient } from './http';
import type { ApiResponse, ClienteFinal, Rol, Usuario } from '../types/models';

export class UserService extends HttpClient {
    // ============================================
    // CLIENTES (CLIENTS / TENANTS)
    // ============================================

    /**
     * Obtener mi tienda (cliente)
     */
    async getMyTenant(): Promise<ApiResponse> {
        return this.getAuth('/api/tenants/my');
    }

    // ============================================
    // CLIENTES FINALES (CUSTOMERS)
    // ============================================

    async getClientesFinales(filtros: any = {}): Promise<ApiResponse<{ clientes: ClienteFinal[], total: number }>> {
        const params = new URLSearchParams();
        Object.keys(filtros).forEach(key => {
            if (filtros[key] !== undefined && filtros[key] !== null) {
                params.append(key, filtros[key]);
            }
        });
        return this.getAuth(`/api/clients?${params.toString()}`);
    }

    async getClienteFinal(id: string): Promise<ApiResponse<{ cliente: ClienteFinal }>> {
        return this.getAuth(`/api/clients/${id}`);
    }

    async createClienteFinal(clienteData: {
        nombre: string;
        apellido: string;
        email?: string;
        telefono?: string;
        direccion?: string;
        documento?: string;
        fecha_nacimiento?: string;
        notas?: string;
        activo?: boolean;
    }): Promise<ApiResponse<{ cliente: ClienteFinal }>> {
        return this.postAuth('/api/clients', clienteData);
    }

    async updateClienteFinal(id: string, clienteData: any): Promise<ApiResponse<{ cliente: ClienteFinal }>> {
        return this.putAuth(`/api/clients/${id}`, clienteData);
    }

    async deleteClienteFinal(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/clients/${id}`);
    }

    // ============================================
    // ROLES
    // ============================================

    async getRoles(): Promise<ApiResponse<{ roles: Rol[] }>> {
        return this.getAuth('/api/roles');
    }

    async getRol(id: string): Promise<ApiResponse<{ rol: Rol }>> {
        return this.getAuth(`/api/roles/${id}`);
    }

    async createRol(rolData: {
        nombre: string;
        descripcion?: string;
    }): Promise<ApiResponse<{ rol: Rol }>> {
        return this.postAuth('/api/roles', rolData);
    }

    async updateRol(id: string, rolData: any): Promise<ApiResponse<{ rol: Rol }>> {
        return this.putAuth(`/api/roles/${id}`, rolData);
    }

    async deleteRol(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/roles/${id}`);
    }

    // ============================================
    // USUARIOS (USERS)
    // ============================================

    async getUsuarios(filtros: any = {}): Promise<ApiResponse<{ usuarios: Usuario[], total: number }>> {
        const params = new URLSearchParams();
        Object.keys(filtros).forEach(key => {
            if (filtros[key] !== undefined && filtros[key] !== null) {
                params.append(key, filtros[key]);
            }
        });
        return this.getAuth(`/api/users?${params.toString()}`);
    }

    async getUsuario(id: string): Promise<ApiResponse<{ usuario: Usuario }>> {
        return this.getAuth(`/api/users/${id}`);
    }

    async createUsuario(usuarioData: {
        email: string;
        password?: string;
        nombre: string;
        apellido: string;
        rolesIds?: string[];
        activo?: boolean;
        email_verificado?: boolean;
    }): Promise<ApiResponse<{ usuario: Usuario }>> {
        return this.postAuth('/api/users', usuarioData);
    }

    async updateUsuario(id: string, usuarioData: any): Promise<ApiResponse<{ usuario: Usuario }>> {
        return this.putAuth(`/api/users/${id}`, usuarioData);
    }

    async activateUsuario(id: string): Promise<ApiResponse> {
        return this.putAuth(`/api/users/${id}/activate`);
    }

    async deactivateUsuario(id: string): Promise<ApiResponse> {
        return this.putAuth(`/api/users/${id}/deactivate`);
    }

    async deleteUsuario(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/users/${id}`);
    }

    async changePasswordUsuario(id: string, passwordData: { password_actual?: string, password_nueva: string }): Promise<ApiResponse> {
        return this.putAuth(`/api/users/${id}/password`, passwordData);
    }

    async getRolesUsuario(userId: string): Promise<ApiResponse<{ roles: Rol[] }>> {
        return this.getAuth(`/api/users/${userId}/roles`);
    }
}
