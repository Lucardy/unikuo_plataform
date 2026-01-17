import { useState, useEffect } from 'react';
import apiService, { type Producto } from '../../services/api';
import './ProductsList.css';

function ProductsList() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProductos();
      if (response.success && response.data?.productos) {
        setProducts(response.data.productos);
      } else {
        setError(response.message || 'Error al cargar productos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      const response = await apiService.deleteProducto(id);
      if (response.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert(response.message || 'Error al eliminar producto');
      }
    } catch (err) {
      alert('Error al eliminar producto');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="products-loading">Cargando productos...</div>;
  }

  if (error) {
    return (
      <div className="products-error">
        <p>{error}</p>
        <button onClick={loadProducts}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="products-list">
      <div className="products-header">
        <button onClick={loadProducts} className="refresh-button">
          Actualizar
        </button>
      </div>

      {products.length === 0 ? (
        <div className="products-empty">
          <p>No hay productos registrados.</p>
          <p>Crea tu primer producto para comenzar.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.imagenes && product.imagenes.length > 0 ? (
                  <img
                    src={product.imagenes.find(img => img.es_principal)?.ruta || product.imagenes[0].ruta}
                    alt={product.nombre}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200';
                    }}
                  />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.nombre}</h3>
                {product.descripcion && (
                  <p className="product-description">{product.descripcion.substring(0, 100)}...</p>
                )}
                <div className="product-price">
                  {product.precio_oferta ? (
                    <>
                      <span className="price-old">${product.precio}</span>
                      <span className="price-new">${product.precio_oferta}</span>
                    </>
                  ) : (
                    <span>${product.precio}</span>
                  )}
                </div>
                {product.codigo && <p className="product-code">Código: {product.codigo}</p>}
                <div className="product-badges">
                  <span className={`badge status-${product.estado}`}>
                    {product.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                  {product.destacado && <span className="badge featured">Destacado</span>}
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsList;
