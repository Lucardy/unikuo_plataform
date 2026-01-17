import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { Categoria } from '../../services/api';
import './CategoryForm.css';

interface CategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria_padre_id: '',
    activo: true,
  });
  const [parentCategories, setParentCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParentCategories();
  }, []);

  const loadParentCategories = async () => {
    try {
      const response = await apiService.getCategorias(true);
      if (response.success && response.data?.categorias) {
        setParentCategories(response.data.categorias);
      }
    } catch (err) {
      console.error('Error al cargar categorías padre:', err);
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
    setLoading(true);
    setError(null);

    try {
      const categoriaData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        categoria_padre_id: formData.categoria_padre_id || undefined,
        activo: formData.activo,
      };

      const response = await apiService.createCategoria(categoriaData);

      if (response.success) {
        // Reset form
        setFormData({
          nombre: '',
          descripcion: '',
          categoria_padre_id: '',
          activo: true,
        });

        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || 'Error al crear categoría');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear categoría');
      console.error('Error al crear categoría:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-form">
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">
            Nombre <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria_padre_id">Categoría Padre (opcional)</label>
          <select
            id="categoria_padre_id"
            name="categoria_padre_id"
            value={formData.categoria_padre_id}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Ninguna (categoría raíz)</option>
            {parentCategories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              disabled={loading}
            />
            <span>Activa</span>
          </label>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={loading}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;
