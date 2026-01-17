import { HttpClient } from './http';
import type { ApiResponse, StockProducto, MovimientoStock, EstadisticasStock } from '../types/models';

export class StockService extends HttpClient {
    /**
     * Obtener stock de productos con filtros
     */
    async getStockProductos(filtros: any = {}): Promise<ApiResponse<{ stock: StockProducto[], total: number }>> {
        const params = new URLSearchParams();
        Object.keys(filtros).forEach(key => {
            if (filtros[key] !== undefined && filtros[key] !== null) {
                params.append(key, filtros[key]);
            }
        });
        return this.getAuth(`/api/stock?${params.toString()}`);
    }

    /**
     * Obtener estadísticas de stock
     */
    async getStockStatistics(): Promise<ApiResponse<{ estadisticas: EstadisticasStock }>> {
        return this.getAuth('/api/stock/statistics');
    }

    /**
     * Obtener stock de un producto específico
     */
    async getProductStock(productoId: string): Promise<ApiResponse<{ stock: StockProducto }>> {
        return this.getAuth(`/api/stock/products/${productoId}`);
    }

    /**
     * Crear o actualizar stock de un producto
     */
    async upsertProductStock(productoId: string, stockData: {
        cantidad?: number;
        stock_minimo?: number;
        stock_maximo?: number;
    }): Promise<ApiResponse<{ stock: StockProducto }>> {
        return this.postAuth(`/api/stock/products/${productoId}`, stockData);
    }

    /**
     * Agregar stock (entrada)
     */
    async addStock(productoId: string, cantidad: number, motivo: string): Promise<ApiResponse<{ stock: StockProducto, movimiento: MovimientoStock }>> {
        return this.postAuth(`/api/stock/products/${productoId}/add`, { cantidad, motivo });
    }

    /**
     * Reducir stock (salida manual)
     */
    async reduceStock(productoId: string, cantidad: number, motivo: string): Promise<ApiResponse<{ stock: StockProducto, movimiento: MovimientoStock }>> {
        return this.postAuth(`/api/stock/products/${productoId}/reduce`, { cantidad, motivo });
    }

    /**
     * Ajustar stock (corrección)
     */
    async adjustStock(productoId: string, cantidad: number, motivo: string): Promise<ApiResponse<{ stock: StockProducto, movimiento: MovimientoStock }>> {
        return this.postAuth(`/api/stock/products/${productoId}/adjust`, { cantidad, motivo });
    }

    /**
     * Obtener historial de movimientos de stock
     */
    async getStockMovements(productoId: string, filtros: any = {}): Promise<ApiResponse<{ movimientos: MovimientoStock[], total: number }>> {
        const params = new URLSearchParams();
        Object.keys(filtros).forEach(key => {
            if (filtros[key] !== undefined && filtros[key] !== null) {
                params.append(key, filtros[key]);
            }
        });
        return this.getAuth(`/api/stock/products/${productoId}/movements?${params.toString()}`);
    }

    /**
     * Obtener alertas de stock bajo
     */
    async getLowStock(limite: number = 10): Promise<ApiResponse<{ productos: StockProducto[] }>> {
        return this.getAuth(`/api/stock/alerts/low-stock?limit=${limite}`);
    }
}
