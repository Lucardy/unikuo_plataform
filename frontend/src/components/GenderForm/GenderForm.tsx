import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { Genero } from '../../services/api';
import './GenderForm.css';

interface GenderFormProps {
  gender: Genero | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const GenderForm: React.FC<GenderFormProps> = ({ gender, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    orden: 0,
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gender) {
      setFormData({
        nombre: gender.nombre || '',
        descripcion: gender.descripcion || '',
        orden: gender.orden || 0,
        activo: gender.activo !== undefined ? gender.activo : true,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        orden: 0,
        activo: true,
      });
    }
    setError(null);
  }, [gender]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseInt(value) || 0 : value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const generoData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        orden: formData.orden || 0,
        activo: formData.activo,
      };

      let response;
      if (gender) {
        response = await apiService.updateGenero(gender.id, generoData);
      } else {
        response = await apiService.createGenero(generoData);
      }

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || `Error al ${gender ? 'actualizar' : 'crear'} género`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${gender ? 'actualizar' : 'crear'} género`);
      console.error(`Error al ${gender ? 'actualizar' : 'crear'} género:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gender-form">
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
            placeholder="Ej: Hombre, Mujer, Niño, Niña, Unisex"
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
            placeholder="Descripción opcional del género"
          />
        </div>

        <div className="form-group">
          <label htmlFor="orden">Orden</label>
          <input
            type="number"
            id="orden"
            name="orden"
            value={formData.orden}
            onChange={handleChange}
            min="0"
            disabled={loading}
            placeholder="Orden de visualización"
          />
          <p className="form-help-text">
            Los géneros se mostrarán ordenados por este número
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
            Los géneros inactivos no se mostrarán en los formularios ni filtros
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
            {loading ? (gender ? 'Actualizando...' : 'Creando...') : (gender ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenderForm;
