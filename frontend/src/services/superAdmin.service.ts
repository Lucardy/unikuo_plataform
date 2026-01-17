import { HttpClient } from './http';
import type { ApiResponse } from '../types/models';

export interface Tenant {
    id: string;
    nombre: string;
    slug: string;
    email?: string;
    telefono?: string;
    dominio?: string;
    activo: boolean;
    theme_config?: any;
    layout_config?: any;
    componentes_config?: any;
    creado_en: string;
    actualizado_en: string;
    nombre_propietario?: string;
    apellido_propietario?: string;
    email_propietario?: string;
}

export class SuperAdminService extends HttpClient {
    /**
     * Obtener todos los tenants (Solo Super Admin)
     */
    public async getTenants(): Promise<ApiResponse<Tenant[]>> {
        const response = await this.getAuth<Tenant[]>('/api/admin/clientes');
        return response;
    }

    /**
     * Obtener detalle de un tenant
     */
    public async getTenantById(id: string): Promise<ApiResponse<Tenant>> {
        const response = await this.getAuth<Tenant>(`/api/admin/clientes/${id}`);
        return response;
    }

    /**
     * Actualizar configuración de un tenant
     */
    public async updateTenantConfig(id: string, config: {
        componentes_config?: any;
        activo?: boolean
    }): Promise<ApiResponse<Tenant>> {
        const response = await this.putAuth<Tenant>(`/api/admin/clientes/${id}/config`, config);
        return response;
    }
}
