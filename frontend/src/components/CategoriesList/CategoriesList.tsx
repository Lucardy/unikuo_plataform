import { useState, useEffect } from 'react';
import apiService, { type Categoria } from '../../services/api';
import './CategoriesList.css';

function CategoriesList() {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCategorias();
      if (response.success && response.data?.categorias) {
        setCategories(response.data.categorias);
      } else {
        setError(response.message || 'Error al cargar categorías');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="categories-loading">Cargando categorías...</div>;
  }

  if (error) {
    return (
      <div className="categories-error">
        <p>{error}</p>
        <button onClick={loadCategories}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="categories-list">
      <div className="categories-header">
        <button onClick={loadCategories} className="refresh-button">
          Actualizar
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="categories-empty">
          <p>No hay categorías registradas.</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <h3>{category.nombre}</h3>
              {category.descripcion && (
                <p className="category-description">{category.descripcion}</p>
              )}
              {category.nombre_categoria_padre && (
                <p className="category-parent">
                  <span className="label">Categoría padre:</span> {category.nombre_categoria_padre}
                </p>
              )}
              <div className="category-badge">
                <span className={`badge ${category.activo ? 'active' : 'inactive'}`}>
                  {category.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoriesList;
