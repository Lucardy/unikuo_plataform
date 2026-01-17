import { HttpClient } from './http';
import type { ApiResponse, Categoria, Producto, Talle, TipoTalle, TipoMedida, Genero, Color, Marca } from '../types/models';

export class CatalogService extends HttpClient {
    // ============================================
    // PRODUCTOS
    // ============================================

    async getProductos(filtros: any = {}): Promise<ApiResponse<{ productos: Producto[], total: number }>> {
        const params = new URLSearchParams();
        Object.keys(filtros).forEach(key => {
            if (filtros[key] !== undefined && filtros[key] !== null) {
                params.append(key, filtros[key]);
            }
        });
        return this.getAuth(`/api/products?${params.toString()}`);
    }

    async getProducto(id: string): Promise<ApiResponse<{ producto: Producto }>> {
        return this.getAuth(`/api/products/${id}`);
    }

    async createProducto(productoData: any): Promise<ApiResponse<{ producto: Producto }>> {
        return this.postAuth('/api/products', productoData);
    }

    async updateProducto(id: string, productoData: any): Promise<ApiResponse<{ producto: Producto }>> {
        return this.putAuth(`/api/products/${id}`, productoData);
    }

    async deleteProducto(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/products/${id}`);
    }

    // ============================================
    // CATEGORÍAS
    // ============================================

    async getCategorias(incluirInactivos?: boolean): Promise<ApiResponse<{ categorias: Categoria[] }>> {
        const query = incluirInactivos ? '?incluir_inactivos=true' : '';
        return this.getAuth(`/api/categories${query}`);
    }

    async getCategoria(id: string): Promise<ApiResponse<{ categoria: Categoria }>> {
        return this.getAuth(`/api/categories/${id}`);
    }

    async createCategoria(categoriaData: {
        nombre: string;
        descripcion?: string;
        categoria_padre_id?: string;
        activo?: boolean;
    }): Promise<ApiResponse<{ categoria: Categoria }>> {
        return this.postAuth('/api/categories', categoriaData);
    }

    async updateCategoria(id: string, categoriaData: any): Promise<ApiResponse<{ categoria: Categoria }>> {
        return this.putAuth(`/api/categories/${id}`, categoriaData);
    }

    async deleteCategoria(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/categories/${id}`);
    }

    // ============================================
    // MARCAS
    // ============================================

    async getMarcas(incluirInactivos?: boolean): Promise<ApiResponse<{ marcas: Marca[] }>> {
        const query = incluirInactivos ? '?incluir_inactivos=true' : '';
        return this.getAuth(`/api/brands${query}`);
    }

    async getMarca(id: string): Promise<ApiResponse<{ marca: Marca }>> {
        return this.getAuth(`/api/brands/${id}`);
    }

    async createMarca(marcaData: {
        nombre: string;
        descripcion?: string;
        url_logo?: string;
        activo?: boolean;
    }): Promise<ApiResponse<{ marca: Marca }>> {
        return this.postAuth('/api/brands', marcaData);
    }

    async updateMarca(id: string, marcaData: any): Promise<ApiResponse<{ marca: Marca }>> {
        return this.putAuth(`/api/brands/${id}`, marcaData);
    }

    async deleteMarca(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/brands/${id}`);
    }

    async uploadMarcaLogo(archivo: File): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('logo', archivo);
        // Nota: HttpClient básico usa JSON, necesitamos uno para FormData o usar fetch directo
        // Por simplicidad usaremos la implementación directa aquí
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token de autenticación');

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        reject(new Error('Error al parsear respuesta'));
                    }
                } else {
                    reject(new Error(`HTTP error! status: ${xhr.status}`));
                }
            };
            xhr.onerror = () => reject(new Error('Error en la petición'));
            xhr.open('POST', `${this.baseURL}/api/brands/upload-logo`);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(formData);
        });
    }

    // ============================================
    // TALLES
    // ============================================

    async getTiposTalle(incluirInactivos?: boolean): Promise<ApiResponse<{ tiposTalle: TipoTalle[] }>> {
        const query = incluirInactivos ? '?incluir_inactivos=true' : '';
        return this.getAuth(`/api/sizes/types${query}`);
    }

    async getTipoTalle(id: string): Promise<ApiResponse<{ tipoTalle: TipoTalle }>> {
        return this.getAuth(`/api/sizes/types/${id}`);
    }

    async createTipoTalle(tipoTalleData: {
        nombre: string;
        descripcion?: string;
        activo?: boolean;
    }): Promise<ApiResponse<{ tipoTalle: TipoTalle }>> {
        return this.postAuth('/api/sizes/types', tipoTalleData);
    }

    async updateTipoTalle(id: string, tipoTalleData: any): Promise<ApiResponse<{ tipoTalle: TipoTalle }>> {
        return this.putAuth(`/api/sizes/types/${id}`, tipoTalleData);
    }

    async deleteTipoTalle(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/sizes/types/${id}`);
    }

    async getTalles(tipoTalleId?: string): Promise<ApiResponse<{ talles: Talle[] }>> {
        const query = tipoTalleId ? `?tipo_talle_id=${tipoTalleId}` : '';
        return this.getAuth(`/api/sizes${query}`);
    }

    async getTalle(id: string): Promise<ApiResponse<{ talle: Talle }>> {
        return this.getAuth(`/api/sizes/${id}`);
    }

    async createTalle(talleData: {
        tipo_talle_id: string;
        nombre: string;
        orden?: number;
    }): Promise<ApiResponse<{ talle: Talle }>> {
        return this.postAuth('/api/sizes', talleData);
    }

    async updateTalle(id: string, talleData: any): Promise<ApiResponse<{ talle: Talle }>> {
        return this.putAuth(`/api/sizes/${id}`, talleData);
    }

    async deleteTalle(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/sizes/${id}`);
    }

    // ============================================
    // MEDIDAS
    // ============================================

    async getTiposMedida(incluirInactivos?: boolean): Promise<ApiResponse<{ tiposMedida: TipoMedida[] }>> {
        const query = incluirInactivos ? '?incluir_inactivos=true' : '';
        return this.getAuth(`/api/measures/types${query}`);
    }

    async getTipoMedida(id: string): Promise<ApiResponse<{ tipoMedida: TipoMedida }>> {
        return this.getAuth(`/api/measures/types/${id}`);
    }

    async createTipoMedida(tipoMedidaData: {
        nombre: string;
        descripcion?: string;
        unidad?: string;
        activo?: boolean;
    }): Promise<ApiResponse<{ tipoMedida: TipoMedida }>> {
        return this.postAuth('/api/measures/types', tipoMedidaData);
    }

    async updateTipoMedida(id: string, tipoMedidaData: any): Promise<ApiResponse<{ tipoMedida: TipoMedida }>> {
        return this.putAuth(`/api/measures/types/${id}`, tipoMedidaData);
    }

    async deleteTipoMedida(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/measures/types/${id}`);
    }

    // ============================================
    // GÉNEROS
    // ============================================

    async getGeneros(incluirInactivos?: boolean): Promise<ApiResponse<{ generos: Genero[] }>> {
        const query = incluirInactivos ? '?incluir_inactivos=true' : '';
        return this.getAuth(`/api/genders${query}`);
    }

    async getGenero(id: string): Promise<ApiResponse<{ genero: Genero }>> {
        return this.getAuth(`/api/genders/${id}`);
    }

    async createGenero(generoData: {
        nombre: string;
        descripcion?: string;
        orden?: number;
        activo?: boolean;
    }): Promise<ApiResponse<{ genero: Genero }>> {
        return this.postAuth('/api/genders', generoData);
    }

    async updateGenero(id: string, generoData: any): Promise<ApiResponse<{ genero: Genero }>> {
        return this.putAuth(`/api/genders/${id}`, generoData);
    }

    async deleteGenero(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/genders/${id}`);
    }

    // ============================================
    // COLORES
    // ============================================

    async getColores(incluirInactivos?: boolean): Promise<ApiResponse<{ colores: Color[] }>> {
        const query = incluirInactivos ? '?incluir_inactivos=true' : '';
        return this.getAuth(`/api/colors${query}`);
    }

    async getColor(id: string): Promise<ApiResponse<{ color: Color }>> {
        return this.getAuth(`/api/colors/${id}`);
    }

    async createColor(colorData: {
        nombre: string;
        codigo_hex?: string;
        mostrar_color?: boolean;
        orden?: number;
        activo?: boolean;
    }): Promise<ApiResponse<{ color: Color }>> {
        return this.postAuth('/api/colors', colorData);
    }

    async updateColor(id: string, colorData: any): Promise<ApiResponse<{ color: Color }>> {
        return this.putAuth(`/api/colors/${id}`, colorData);
    }

    async deleteColor(id: string): Promise<ApiResponse> {
        return this.deleteAuth(`/api/colors/${id}`);
    }
}
