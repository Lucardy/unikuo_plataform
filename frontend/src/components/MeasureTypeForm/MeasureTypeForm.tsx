import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { TipoMedida } from '../../services/api';
import './MeasureTypeForm.css';

interface MeasureTypeFormProps {
  measureType: TipoMedida | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const MeasureTypeForm: React.FC<MeasureTypeFormProps> = ({ measureType, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    unidad: '',
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (measureType) {
      setFormData({
        nombre: measureType.nombre || '',
        descripcion: measureType.descripcion || '',
        unidad: measureType.unidad || '',
        activo: measureType.activo !== undefined ? measureType.activo : true,
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        unidad: '',
        activo: true,
      });
    }
    setError(null);
  }, [measureType]);

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
      const measureTypeData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        unidad: formData.unidad.trim() || undefined,
        activo: formData.activo,
      };

      let response;
      if (measureType) {
        response = await apiService.updateTipoMedida(measureType.id, measureTypeData);
      } else {
        response = await apiService.createTipoMedida(measureTypeData);
      }

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || `Error al ${measureType ? 'actualizar' : 'crear'} tipo de medida`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${measureType ? 'actualizar' : 'crear'} tipo de medida`);
      console.error(`Error al ${measureType ? 'actualizar' : 'crear'} tipo de medida:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="measure-type-form">
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
            placeholder="Ej: Longitud, Peso, Volumen"
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
            placeholder="Descripción opcional del tipo de medida"
          />
        </div>

        <div className="form-group">
          <label htmlFor="unidad">Unidad</label>
          <input
            type="text"
            id="unidad"
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ej: cm, kg, litros"
          />
          <p className="form-help-text">
            Unidad de medida (opcional)
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
            Los tipos de medida inactivos no se mostrarán en los formularios de productos
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
            {loading ? (measureType ? 'Actualizando...' : 'Creando...') : (measureType ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeasureTypeForm;
