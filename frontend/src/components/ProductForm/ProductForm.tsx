import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { Categoria } from '../../services/api';
import './ProductForm.css';

interface ProductFormProps {
  onSuccess: () => void;
}

function ProductForm({ onSuccess }: ProductFormProps) {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precio_oferta: '',
    precio_transferencia: '',
    codigo: '',
    categoria_id: '',
    estado: 'activo',
    destacado: false,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategorias();
      if (response.success && response.data?.categorias) {
        setCategories(response.data.categorias);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio) {
      alert('Nombre y precio son requeridos');
      return;
    }

    try {
      setLoading(true);
      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        precio: parseFloat(formData.precio),
        precio_oferta: formData.precio_oferta ? parseFloat(formData.precio_oferta) : undefined,
        precio_transferencia: formData.precio_transferencia ? parseFloat(formData.precio_transferencia) : undefined,
        codigo: formData.codigo || undefined,
        categoria_id: formData.categoria_id || undefined,
        estado: formData.estado,
        destacado: formData.destacado,
      };

      const response = await apiService.createProducto(productData);

      if (response.success) {
        alert('Producto creado exitosamente');
        // Reset form
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          precio_oferta: '',
          precio_transferencia: '',
          codigo: '',
          categoria_id: '',
          estado: 'activo',
          destacado: false,
        });
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(response.message || 'Error al crear producto');
      }
    } catch (error) {
      alert('Error al crear producto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="precio">Precio *</label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio_oferta">Precio Oferta</label>
            <input
              type="number"
              id="precio_oferta"
              name="precio_oferta"
              value={formData.precio_oferta}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio_transferencia">Precio Transferencia</label>
            <input
              type="number"
              id="precio_transferencia"
              name="precio_transferencia"
              value={formData.precio_transferencia}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="codigo">Código</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria_id">Categoría</label>
            <select
              id="categoria_id"
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleChange}
            >
              <option value="">Sin categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="destacado"
                checked={formData.destacado}
                onChange={handleChange}
              />
              Producto destacado
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
