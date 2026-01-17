import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { TipoTalle } from '../../services/api';
import './SizeTypeForm.css';

interface SizeTypeFormProps {
  sizeType: TipoTalle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const SizeTypeForm: React.FC<SizeTypeFormProps> = ({ sizeType, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sizeType) {
      setFormData({
        nombre: sizeType.nombre || '',
        descripcion: sizeType.descripcion || '',
        activo: sizeType.activo !== undefined ? sizeType.activo : true,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        activo: true,
      });
    }
    setError(null);
  }, [sizeType]);

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
      const sizeTypeData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        activo: formData.activo,
      };

      let response;
      if (sizeType) {
        response = await apiService.updateTipoTalle(sizeType.id, sizeTypeData);
      } else {
        response = await apiService.createTipoTalle(sizeTypeData);
      }

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || `Error al ${sizeType ? 'actualizar' : 'crear'} tipo de talle`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${sizeType ? 'actualizar' : 'crear'} tipo de talle`);
      console.error(`Error al ${sizeType ? 'actualizar' : 'crear'} tipo de talle:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="size-type-form">
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
            placeholder="Ej: Ropa, Calzado, Gorras"
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
            placeholder="Descripción opcional del tipo de talle"
          />
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
            Los tipos de talle inactivos no se mostrarán en los formularios de productos
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
            {loading ? (sizeType ? 'Actualizando...' : 'Creando...') : (sizeType ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SizeTypeForm;
