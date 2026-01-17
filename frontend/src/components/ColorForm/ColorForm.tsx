import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { Color } from '../../services/api';
import './ColorForm.css';

interface ColorFormProps {
  color: Color | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ColorForm: React.FC<ColorFormProps> = ({ color, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo_hex: '',
    mostrar_color: true,
    orden: 0,
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (color) {
      setFormData({
        nombre: color.nombre || '',
        codigo_hex: color.codigo_hex || '',
        mostrar_color: color.mostrar_color !== undefined ? color.mostrar_color : true,
        orden: color.orden || 0,
        activo: color.activo !== undefined ? color.activo : true,
      });
    } else {
      setFormData({
        nombre: '',
        codigo_hex: '',
        mostrar_color: true,
        orden: 0,
        activo: true,
      });
    }
    setError(null);
  }, [color]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseInt(value) || 0 : value),
    }));
  };

  const validateHexCode = (hex: string): boolean => {
    if (!hex) return true; // Opcional
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexPattern.test(hex);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar código hex si mostrar_color es true
      if (formData.mostrar_color && formData.codigo_hex && !validateHexCode(formData.codigo_hex)) {
        setError('El código hexadecimal debe tener el formato #RRGGBB o #RGB');
        setLoading(false);
        return;
      }

      const colorData = {
        nombre: formData.nombre.trim(),
        codigo_hex: formData.mostrar_color && formData.codigo_hex ? formData.codigo_hex.trim() : undefined,
        mostrar_color: formData.mostrar_color,
        orden: formData.orden || 0,
        activo: formData.activo,
      };

      let response;
      if (color) {
        response = await apiService.updateColor(color.id, colorData);
      } else {
        response = await apiService.createColor(colorData);
      }

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || `Error al ${color ? 'actualizar' : 'crear'} color`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${color ? 'actualizar' : 'crear'} color`);
      console.error(`Error al ${color ? 'actualizar' : 'crear'} color:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="color-form">
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">
            Nombre del Color <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ej: Rojo, Azul, Negro"
          />
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="mostrar_color"
              checked={formData.mostrar_color}
              onChange={handleChange}
              disabled={loading}
            />
            <span>Mostrar muestra de color</span>
          </label>
          <p className="form-help-text">
            Si está marcado, se mostrará una muestra visual del color usando el código hexadecimal
          </p>
        </div>

        {formData.mostrar_color && (
          <>
            <div className="form-group">
              <label htmlFor="codigo_hex">Código Hexadecimal</label>
              <input
                type="text"
                id="codigo_hex"
                name="codigo_hex"
                value={formData.codigo_hex}
                onChange={handleChange}
                disabled={loading}
                placeholder="#FF0000 o #F00"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
              />
              <p className="form-help-text">
                Formato: #RRGGBB (ej: #FF0000) o #RGB (ej: #F00)
              </p>
            </div>

            {formData.codigo_hex && validateHexCode(formData.codigo_hex) && (
              <div className="color-preview">
                <label className="preview-label">Vista previa:</label>
                <div className="color-preview-sample">
                  <span
                    className="preview-color-box"
                    style={{ backgroundColor: formData.codigo_hex }}
                  />
                  <span className="preview-color-text">{formData.codigo_hex}</span>
                </div>
              </div>
            )}
          </>
        )}

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
            Los colores inactivos no se mostrarán en los formularios ni filtros
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
            {loading ? (color ? 'Actualizando...' : 'Creando...') : (color ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColorForm;
