import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

interface CartItem {
    producto_id: string;
    nombre_producto: string;
    codigo_producto?: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    descuento: number;
    stock_disponible?: number;
}

interface SaleData {
    cliente_final_id?: string;
    nombre_cliente?: string;
    documento_cliente?: string;
    metodo_pago?: string;
    codigo_descuento?: string;
    notas?: string;
}

interface Product {
    id: string;
    nombre: string;
    codigo?: string;
    precio: number;
    precio_oferta?: number;
    precio_transferencia?: number;
    stock?: {
        cantidad: number;
        stock_minimo?: number;
        stock_maximo?: number;
    };
}

/**
 * Hook para gestionar el punto de venta (POS)
 */
export const useSales = () => {
    // Estado del carrito de venta
    const [cart, setCart] = useState<CartItem[]>([]);

    // Estado de productos disponibles
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);

    // Estado de búsqueda
    const [search, setSearch] = useState('');

    // Estado de la venta en proceso
    const [saleInProgress, setSaleInProgress] = useState(false);

    // Estado de historial de ventas
    const [salesHistory, setSalesHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    /**
     * Cargar productos disponibles
     */
    const loadProducts = useCallback(async () => {
        setProductsLoading(true);
        try {
            const response = await apiService.getProductos({ estado: 'active' });
            if (response.success && response.data?.productos) {
                // Cargar stock para cada producto
                const productsWithStock = await Promise.all(
                    response.data.productos.map(async (product: Product) => {
                        try {
                            const stockResponse = await apiService.getProductStock(product.id);
                            return {
                                ...product,
                                stock: stockResponse.data?.stock || { cantidad: 0, stock_minimo: 0, stock_maximo: 0 }
                            };
                        } catch (error) {
                            return {
                                ...product,
                                stock: { cantidad: 0, stock_minimo: 0, stock_maximo: 0 }
                            };
                        }
                    })
                );
                setProducts(productsWithStock as Product[]);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
        } finally {
            setProductsLoading(false);
        }
    }, []);

    /**
     * Cargar productos al montar
     */
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    /**
     * Agregar producto al carrito
     */
    const addToCart = useCallback((product: Product, quantity: number = 1) => {
        const stockAvailable = product.stock?.cantidad || 0;
        if (stockAvailable < quantity) {
            throw new Error(`Stock insuficiente. Disponible: ${stockAvailable}`);
        }

        setCart(prev => {
            const existingItem = prev.find(item => item.producto_id === product.id);

            if (existingItem) {
                const newQuantity = existingItem.cantidad + quantity;
                if (newQuantity > stockAvailable) {
                    throw new Error(`Stock insuficiente. Disponible: ${stockAvailable}`);
                }
                return prev.map(item =>
                    item.producto_id === product.id
                        ? { ...item, cantidad: newQuantity, subtotal: newQuantity * item.precio_unitario }
                        : item
                );
            } else {
                const price = product.precio_oferta && product.precio_oferta > 0
                    ? product.precio_oferta
                    : product.precio;

                return [...prev, {
                    producto_id: product.id,
                    nombre_producto: product.nombre,
                    codigo_producto: product.codigo,
                    cantidad: quantity,
                    precio_unitario: price,
                    subtotal: price * quantity,
                    descuento: 0,
                    stock_disponible: stockAvailable
                }];
            }
        });
    }, []);

    /**
     * Eliminar producto del carrito
     */
    const removeFromCart = useCallback((productId: string) => {
        setCart(prev => prev.filter(item => item.producto_id !== productId));
    }, []);

    /**
     * Actualizar cantidad de un item en el carrito
     */
    const updateQuantity = useCallback((productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart(prev => {
            const item = prev.find(i => i.producto_id === productId);
            if (!item) return prev;

            if (newQuantity > (item.stock_disponible || 0)) {
                throw new Error(`Stock insuficiente. Disponible: ${item.stock_disponible}`);
            }

            return prev.map(item =>
                item.producto_id === productId
                    ? { ...item, cantidad: newQuantity, subtotal: newQuantity * item.precio_unitario }
                    : item
            );
        });
    }, [removeFromCart]);

    /**
     * Limpiar carrito
     */
    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    /**
     * Calcular subtotal del carrito
     */
    const calculateSubtotal = useCallback(() => {
        return cart.reduce((total, item) => total + item.subtotal, 0);
    }, [cart]);

    /**
     * Calcular total del carrito
     */
    const calculateTotal = useCallback((discountAmount: number = 0) => {
        const subtotal = calculateSubtotal();
        return Math.max(0, subtotal - discountAmount);
    }, [calculateSubtotal]);

    /**
     * Realizar venta
     */
    const createSale = useCallback(async (saleData: SaleData = {}) => {
        if (cart.length === 0) {
            throw new Error('El carrito está vacío');
        }

        setSaleInProgress(true);
        try {
            const response = await apiService.createSale({
                items: cart.map(item => ({
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    descuento: item.descuento || 0
                })),
                cliente_final_id: saleData.cliente_final_id,
                nombre_cliente: saleData.nombre_cliente,
                documento_cliente: saleData.documento_cliente,
                metodo_pago: saleData.metodo_pago || 'efectivo',
                codigo_descuento: saleData.codigo_descuento,
                notas: saleData.notas
            });

            if (response.success) {
                clearCart();
                // Recargar productos para actualizar stock
                loadProducts();
                return response.data?.venta;
            } else {
                throw new Error(response.message || 'Error al realizar la venta');
            }
        } catch (error: any) {
            console.error('Error al realizar venta:', error);
            throw error;
        } finally {
            setSaleInProgress(false);
        }
    }, [cart, calculateSubtotal, clearCart, loadProducts]);

    /**
     * Cargar historial de ventas
     */
    const loadSalesHistory = useCallback(async (filtros: any = {}) => {
        setHistoryLoading(true);
        try {
            const response = await apiService.getSales(filtros);
            if (response.success) {
                setSalesHistory(response.data?.ventas || []);
            }
        } catch (error) {
            console.error('Error al cargar historial:', error);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    /**
     * Filtrar productos por búsqueda
     */
    const filteredProducts = products.filter(product => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (
            product.nombre?.toLowerCase().includes(term) ||
            product.codigo?.toLowerCase().includes(term)
        );
    });

    return {
        // Carrito
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateSubtotal,
        calculateTotal,
        total: calculateTotal(),

        // Productos
        products: filteredProducts,
        productsLoading,
        search,
        setSearch,
        loadProducts,

        // Venta
        createSale,
        saleInProgress,

        // Historial
        salesHistory,
        historyLoading,
        loadSalesHistory
    };
};
