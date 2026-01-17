import { useState } from 'react';
import { useSales } from '../../../hooks/useSales';
import { useCashRegister } from '../../../hooks/useCashRegister';
import './POSPage.css';

/**
 * Página principal del Punto de Venta (POS)
 */
const POSPage = () => {
    const {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateSubtotal,
        calculateTotal,
        products,
        productsLoading,
        search,
        setSearch,
        createSale,
        saleInProgress,
    } = useSales();

    const { currentShift, hasOpenShift } = useCashRegister();

    const [paymentMethod, setPaymentMethod] = useState('efectivo');
    const [clientName, setClientName] = useState('');
    const [showCheckout, setShowCheckout] = useState(false);

    /**
     * Manejar finalización de venta
     */
    const handleCheckout = async () => {
        if (!hasOpenShift) {
            alert('Debes abrir un turno de caja antes de realizar ventas');
            return;
        }

        try {
            await createSale({
                nombre_cliente: clientName || undefined,
                metodo_pago: paymentMethod,
            });
            alert('¡Venta realizada exitosamente!');
            setShowCheckout(false);
            setClientName('');
            setPaymentMethod('efectivo');
        } catch (error: any) {
            alert(error.message || 'Error al realizar la venta');
        }
    };

    return (
        <div className="pos-page">
            <div className="pos-header">
                <h1>Punto de Venta</h1>
                {hasOpenShift ? (
                    <div className="shift-info">
                        <span className="shift-badge">Turno Abierto</span>
                        <span>Monto Inicial: ${currentShift?.monto_inicial || 0}</span>
                    </div>
                ) : (
                    <div className="shift-warning">
                        ⚠️ No hay turno abierto. Ve a Arqueo de Caja para abrir un turno.
                    </div>
                )}
            </div>

            <div className="pos-container">
                {/* Panel de Productos */}
                <div className="products-panel">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="products-grid">
                        {productsLoading ? (
                            <div className="loading">Cargando productos...</div>
                        ) : products.length === 0 ? (
                            <div className="no-products">No hay productos disponibles</div>
                        ) : (
                            products.map((product) => (
                                <div key={product.id} className="product-card">
                                    <h3>{product.nombre}</h3>
                                    <p className="product-code">{product.codigo}</p>
                                    <p className="product-price">${product.precio}</p>
                                    <p className="product-stock">
                                        Stock: {product.stock?.cantidad || 0}
                                    </p>
                                    <button
                                        onClick={() => {
                                            try {
                                                addToCart(product, 1);
                                            } catch (error: any) {
                                                alert(error.message);
                                            }
                                        }}
                                        disabled={!product.stock || product.stock.cantidad === 0}
                                        className="add-button"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Panel del Carrito */}
                <div className="cart-panel">
                    <h2>Carrito</h2>

                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>El carrito está vacío</p>
                            <p>Agrega productos para comenzar</p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.map((item) => (
                                    <div key={item.producto_id} className="cart-item">
                                        <div className="item-info">
                                            <h4>{item.nombre_producto}</h4>
                                            <p className="item-price">${item.precio_unitario}</p>
                                        </div>
                                        <div className="item-controls">
                                            <button
                                                onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}
                                                className="qty-button"
                                            >
                                                -
                                            </button>
                                            <span className="quantity">{item.cantidad}</span>
                                            <button
                                                onClick={() => {
                                                    try {
                                                        updateQuantity(item.producto_id, item.cantidad + 1);
                                                    } catch (error: any) {
                                                        alert(error.message);
                                                    }
                                                }}
                                                className="qty-button"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.producto_id)}
                                                className="remove-button"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="item-subtotal">${item.subtotal.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary">
                                <div className="summary-line">
                                    <span>Subtotal:</span>
                                    <span>${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="summary-line total">
                                    <span>Total:</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="cart-actions">
                                <button onClick={clearCart} className="clear-button">
                                    Limpiar Carrito
                                </button>
                                <button
                                    onClick={() => setShowCheckout(true)}
                                    className="checkout-button"
                                    disabled={!hasOpenShift}
                                >
                                    Finalizar Venta
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal de Checkout */}
            {showCheckout && (
                <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Finalizar Venta</h2>

                        <div className="form-group">
                            <label>Cliente (opcional):</label>
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Nombre del cliente"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Método de Pago:</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="form-select"
                            >
                                <option value="efectivo">Efectivo</option>
                                <option value="transferencia">Transferencia</option>
                                <option value="tarjeta_debito">Tarjeta de Débito</option>
                                <option value="tarjeta_credito">Tarjeta de Crédito</option>
                            </select>
                        </div>

                        <div className="checkout-summary">
                            <h3>Resumen</h3>
                            <p>Total: ${calculateTotal().toFixed(2)}</p>
                            <p>Método: {paymentMethod === 'efectivo' ? 'Efectivo' : paymentMethod === 'transferencia' ? 'Transferencia' : 'Tarjeta'}</p>
                        </div>

                        <div className="modal-actions">
                            <button
                                onClick={() => setShowCheckout(false)}
                                className="cancel-button"
                                disabled={saleInProgress}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCheckout}
                                className="confirm-button"
                                disabled={saleInProgress}
                            >
                                {saleInProgress ? 'Procesando...' : 'Confirmar Venta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default POSPage;
