import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { Rol } from '../../services/api';
import './RoleForm.css';

interface RoleFormProps {
  role?: Rol | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (role) {
      setFormData({
        nombre: role.nombre || '',
        descripcion: role.descripcion || '',
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
      });
    }
    setError(null);
    setErrors({});
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const roleData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
      };

      let response;
      if (role) {
        response = await apiService.updateRol(role.id, roleData);
      } else {
        response = await apiService.createRol(roleData);
      }

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || `Error al ${role ? 'actualizar' : 'crear'} rol`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${role ? 'actualizar' : 'crear'} rol`);
      console.error(`Error al ${role ? 'actualizar' : 'crear'} rol:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-form">
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
            placeholder="Ej: admin, editor, vendedor"
          />
          {errors.nombre && (
            <span className="field-error">{errors.nombre}</span>
          )}
          <p className="form-help-text">
            Nombre único del rol (sin espacios, en minúsculas)
          </p>
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
            placeholder="Descripción del rol y sus permisos"
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
            {loading ? (role ? 'Actualizando...' : 'Creando...') : (role ? 'Actualizar' : 'Crear')} Rol
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;
