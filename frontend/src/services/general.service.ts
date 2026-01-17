import { HttpClient } from './http';
import type { ApiResponse, Banner } from '../types/models';

export class GeneralService extends HttpClient {
    // ============================================
    // SYSTEM & DATABASE
    // ============================================

    async testConnection(): Promise<ApiResponse> {
        return this.get('/api/test');
    }

    async healthCheck(): Promise<ApiResponse> {
        return this.get('/api/test/health');
    }

    async testDatabase(): Promise<ApiResponse> {
        return this.get('/api/database/test');
    }

    async getDatabaseData(): Promise<ApiResponse> {
        return this.get('/api/database/data');
    }

    // ============================================
    // BANNERS
    // ============================================

    async getBanners(incluirInactivos?: boolean): Promise<ApiResponse> {
        const query = incluirInactivos ? '?incluir_inactivos=true' : '';
        return this.getAuth(`/api/banners${query}`);
    }

    async getBanner(id: string): Promise<ApiResponse> {
        return this.getAuth(`/api/banners/${id}`);
    }

    async uploadBannerImage(archivo: File, onProgress?: (progress: number) => void): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('imagen', archivo);

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const progress = Math.round((e.loaded * 100) / e.total);
                    onProgress(progress);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Error al parsear respuesta'));
                    }
                } else {
                    reject(new Error(`HTTP error! status: ${xhr.status}`));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Error en la petición'));
            });

            xhr.open('POST', `${this.baseURL}/api/banners/upload`);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);
        });
    }

    async createBanner(bannerData: {
        titulo?: string;
        subtitulo?: string;
        url_imagen: string;
        url_enlace?: string;
        orden?: number;
        activo?: boolean;
    }): Promise<ApiResponse<{ banner: Banner }>> {
        return this.postAuth('/api/banners', bannerData);
    }

    async updateBanner(id: string, bannerData: any): Promise<ApiResponse<{ banner: Banner }>> {
        return this.putAuth(`/api/banners/${id}`, bannerData);
    }

    async deleteBanner(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/banners/${id}`);
    }

    // ============================================
    // REPORTS
    // ============================================

    async getReportsSummary(): Promise<ApiResponse> {
        return this.getAuth('/api/reports/summary');
    }

    async getProductsReport(): Promise<ApiResponse> {
        return this.getAuth('/api/reports/products');
    }

    async getStockReport(): Promise<ApiResponse> {
        return this.getAuth('/api/reports/stock');
    }

    // ============================================
    // AUDITORÍA (AUDIT)
    // ============================================

    async getAuditLogs(filtros?: {
        usuario_id?: string;
        accion?: string;
        nombre_tabla?: string;
        fecha_desde?: string;
        fecha_hasta?: string;
        limite?: number;
        offset?: number;
    }): Promise<ApiResponse> {
        const params = new URLSearchParams();
        if (filtros) {
            Object.entries(filtros).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, String(value));
                }
            });
        }
        const query = params.toString();
        return this.getAuth(`/api/audit${query ? '?' + query : ''}`);
    }

    async getAuditStatistics(fechaDesde?: string, fechaHasta?: string): Promise<ApiResponse> {
        const params = new URLSearchParams();
        if (fechaDesde) params.append('fecha_desde', fechaDesde);
        if (fechaHasta) params.append('fecha_hasta', fechaHasta);
        const query = params.toString();
        return this.getAuth(`/api/audit/statistics${query ? '?' + query : ''}`);
    }

    async getAuditLog(id: string): Promise<ApiResponse> {
        return this.getAuth(`/api/audit/${id}`);
    }
}
