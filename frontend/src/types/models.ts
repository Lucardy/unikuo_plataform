export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    [key: string]: any;
}

export interface Marca {
    id: string;
    nombre: string;
    descripcion?: string;
    url_logo?: string;
    activo: boolean;
}

export interface ClienteFinal {
    id: string;
    nombre: string;
    apellido: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    documento?: string;
    fecha_nacimiento?: string;
    notas?: string;
    activo: boolean;
}

export interface Genero {
    id: string;
    nombre: string;
    descripcion?: string;
    orden: number;
    activo: boolean;
}

export interface Color {
    id: string;
    nombre: string;
    codigo_hex?: string;
    mostrar_color: boolean;
    orden: number;
    activo: boolean;
}

export interface Categoria {
    id: string;
    nombre: string;
    descripcion?: string;
    categoria_padre_id?: string;
    nombre_categoria_padre?: string;
    activo: boolean;
    creado_en?: string;
    actualizado_en?: string;
    subcategorias?: Categoria[];
}

export interface Producto {
    id: string;
    categoria_id?: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    precio_oferta?: number;
    precio_transferencia?: number;
    codigo?: string;
    estado: string;
    destacado: boolean;
    creado_en?: string;
    actualizado_en?: string;
    nombre_categoria?: string;
    imagenes?: any[];
    marcas?: any[];
    talles?: any[];
    colores?: any[];
    stock?: any;
}

export interface Talle {
    id: string;
    nombre: string;
    tipo_talle_id: string;
    orden: number;
    creado_en?: string;
    actualizado_en?: string;
    nombre_tipo_talle?: string;
}

export interface TipoTalle {
    id: string;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    creado_en?: string;
    actualizado_en?: string;
    cantidad_talles?: number;
    talles?: Talle[];
}

export interface TipoMedida {
    id: string;
    nombre: string;
    descripcion?: string;
    unidad?: string;
    activo: boolean;
    creado_en?: string;
    actualizado_en?: string;
}

export interface Banner {
    id: string;
    titulo?: string;
    subtitulo?: string;
    url_imagen: string;
    url_enlace?: string;
    activo: boolean;
    orden: number;
    creado_en?: string;
    actualizado_en?: string;
}

export interface StockProducto {
    id: string;
    producto_id: string;
    nombre_producto: string;
    codigo_producto?: string;
    cantidad: number;
    stock_minimo: number;
    stock_maximo: number;
    estado_stock: string;
    creado_en?: string;
    actualizado_en?: string;
}

export interface MovimientoStock {
    id: string;
    producto_id: string;
    cantidad: number;
    tipo: 'entrada' | 'salida' | 'ajuste';
    motivo: string;
    usuario_id: string;
    nombre_usuario?: string;
    creado_en: string;
}

export interface EstadisticasStock {
    total_productos: number;
    sin_stock: number;
    stock_bajo: number;
    unidades_totales: number;
}

export interface Rol {
    id: string;
    nombre: string;
    descripcion?: string;
    cantidad_usuarios?: number;
    creado_en?: string;
    actualizado_en?: string;
}

export interface Usuario {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    activo: boolean;
    email_verificado: boolean;
    cliente_id?: string | null;
    tenant_id?: string | null;
    roles?: Rol[];
}
