import { HttpClient } from './http';
import type { ApiResponse } from '../types/models';

export class SalesService extends HttpClient {
    /**
     * Obtener todas las ventas
     */
    async getSales(filtros?: {
        estado?: string;
        usuario_id?: string;
        fecha_inicio?: string;
        fecha_fin?: string;
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
        return this.getAuth(`/api/sales${query ? `?${query}` : ''}`);
    }

    /**
     * Obtener venta por ID
     */
    async getSale(id: string): Promise<ApiResponse> {
        return this.getAuth(`/api/sales/${id}`);
    }

    /**
     * Crear nueva venta
     */
    async createSale(datosVenta: {
        cliente_final_id?: string;
        nombre_cliente?: string;
        documento_cliente?: string;
        metodo_pago?: string;
        codigo_descuento?: string;
        estado?: string;
        notas?: string;
        items: Array<{
            producto_id: string;
            cantidad: number;
            precio_unitario: number;
            descuento?: number;
        }>;
    }): Promise<ApiResponse> {
        return this.postAuth('/api/sales', datosVenta);
    }

    /**
     * Cancelar venta
     */
    async cancelSale(id: string): Promise<ApiResponse> {
        return this.putAuth(`/api/sales/${id}/cancel`);
    }

    // ============================================
    // CAJAS (CASH REGISTERS)
    // ============================================

    async openCashRegister(montoInicial: number): Promise<ApiResponse> {
        return this.postAuth('/api/cash-registers/open', { monto_inicial: montoInicial });
    }

    async closeCashRegister(turnoId: string, datosCierre: {
        efectivo_real: number;
        notas?: string;
    }): Promise<ApiResponse> {
        return this.putAuth(`/api/cash-registers/${turnoId}/close`, datosCierre);
    }

    async getCurrentCashRegister(): Promise<ApiResponse> {
        return this.getAuth('/api/cash-registers/current');
    }

    async getCashRegister(id: string): Promise<ApiResponse> {
        return this.getAuth(`/api/cash-registers/${id}`);
    }

    async getCashRegisterSummary(id: string): Promise<ApiResponse> {
        return this.getAuth(`/api/cash-registers/${id}/summary`);
    }

    async getCashRegisters(filtros?: {
        usuario_id?: string;
        estado?: string;
        fecha_inicio?: string;
        fecha_fin?: string;
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
        return this.getAuth(`/api/cash-registers${query ? `?${query}` : ''}`);
    }
}
