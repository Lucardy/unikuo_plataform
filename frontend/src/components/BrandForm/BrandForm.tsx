import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { Marca } from '../../services/api';
import './BrandForm.css';

interface BrandFormProps {
  brand: Marca | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({ brand, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    url_logo: '',
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (brand) {
      setFormData({
        nombre: brand.nombre || '',
        descripcion: brand.descripcion || '',
        url_logo: brand.url_logo || '',
        activo: brand.activo !== undefined ? brand.activo : true,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        url_logo: '',
        activo: true,
      });
    }
    setError(null);
  }, [brand]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const brandData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        url_logo: formData.url_logo.trim() || undefined,
        activo: formData.activo,
      };

      let response;
      if (brand) {
        response = await apiService.updateMarca(brand.id, brandData);
      } else {
        response = await apiService.createMarca(brandData);
      }

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || `Error al ${brand ? 'actualizar' : 'crear'} marca`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${brand ? 'actualizar' : 'crear'} marca`);
      console.error(`Error al ${brand ? 'actualizar' : 'crear'} marca:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-form">
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
            placeholder="Ej: Nike, Adidas, Puma"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            disabled={loading}
            placeholder="Descripción opcional de la marca"
          />
        </div>

        <div className="form-group">
          <label htmlFor="url_logo">Logo (Ruta)</label>
          <input
            type="text"
            id="url_logo"
            name="url_logo"
            value={formData.url_logo}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ej: /logos/nike.png"
          />
          <p className="form-help-text">
            Ruta relativa del logo de la marca (opcional)
          </p>
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
            <span>Activo</span>
          </label>
          <p className="form-help-text">
            Las marcas inactivas no se mostrarán en los formularios ni filtros
          </p>
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
            {loading ? (brand ? 'Actualizando...' : 'Creando...') : (brand ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandForm;
