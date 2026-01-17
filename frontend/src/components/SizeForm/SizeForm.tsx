import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { Talle, TipoTalle } from '../../services/api';
import './SizeForm.css';

interface SizeFormProps {
  size: Talle | null;
  sizeTypes: TipoTalle[];
  sizes: Talle[];
  onSuccess: () => void;
  onCancel: () => void;
}

const SizeForm: React.FC<SizeFormProps> = ({ size, sizeTypes, sizes, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_talle_id: '',
    orden: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (size) {
      setFormData({
        nombre: size.nombre || '',
        tipo_talle_id: size.tipo_talle_id || '',
        orden: size.orden || 0,
      });
    } else {
      setFormData({
        nombre: '',
        tipo_talle_id: '',
        orden: 0,
      });
    }
    setError(null);
  }, [size]);

  // Calcular el siguiente orden automáticamente cuando cambia el tipo de talle
  useEffect(() => {
    if (formData.tipo_talle_id && !size) {
      const sizesOfType = sizes.filter(s => s.tipo_talle_id === formData.tipo_talle_id);
      const maxOrder = sizesOfType.length > 0
        ? Math.max(...sizesOfType.map(s => s.orden || 0))
        : 0;
      setFormData(prev => ({ ...prev, orden: maxOrder + 1 }));
    }
  }, [formData.tipo_talle_id, sizes, size]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.nombre.trim()) {
        setError('El nombre es requerido');
        setLoading(false);
        return;
      }

      if (!formData.tipo_talle_id) {
        setError('El tipo de talle es requerido');
        setLoading(false);
        return;
      }

      const sizeData = {
        nombre: formData.nombre.trim(),
        tipo_talle_id: formData.tipo_talle_id,
        orden: formData.orden || 0,
      };

      let response;
      if (size) {
        response = await apiService.updateTalle(size.id, sizeData);
      } else {
        response = await apiService.createTalle(sizeData);
      }

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || `Error al ${size ? 'actualizar' : 'crear'} talle`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${size ? 'actualizar' : 'crear'} talle`);
      console.error(`Error al ${size ? 'actualizar' : 'crear'} talle:`, err);
    } finally {
      setLoading(false);
    }
  };

  const activeSizeTypes = sizeTypes.filter(st => st.activo);

  return (
    <div className="size-form">
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tipo_talle_id">
            Tipo de Talle <span className="required">*</span>
          </label>
          <select
            id="tipo_talle_id"
            name="tipo_talle_id"
            value={formData.tipo_talle_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Selecciona un tipo</option>
            {activeSizeTypes.map(st => (
              <option key={st.id} value={st.id}>
                {st.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="nombre">
            Nombre del Talle <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ej: XS, S, M, L, XL, 35, 36, 37..."
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
            {loading ? (size ? 'Actualizando...' : 'Creando...') : (size ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SizeForm;
