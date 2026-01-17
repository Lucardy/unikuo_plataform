import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import './UserForm.css';

interface Role {
  id: string;
  nombre: string;
  descripcion?: string;
}

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  activo: boolean;
  roles?: Role[];
}

interface UserFormProps {
  user?: User | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    rolesIds: [] as string[],
    activo: true,
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '', // No mostrar contraseña al editar
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        rolesIds: user.roles?.map(r => r.id) || [],
        activo: user.activo !== undefined ? user.activo : true,
      });
    } else {
      setFormData({
        email: '',
        password: '',
        nombre: '',
        apellido: '',
        rolesIds: [],
        activo: true,
      });
    }
    setError(null);
    setErrors({});
  }, [user]);

  const loadRoles = async () => {
    setLoadingRoles(true);
    try {
      const response = await apiService.getRoles();
      if (response.success && response.data?.roles) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.error('Error al cargar roles:', error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      rolesIds: selectedOptions,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!user && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
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
      const userData: any = {
        email: formData.email.trim(),
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        rolesIds: formData.rolesIds,
        activo: formData.activo,
      };

      if (!user || formData.password) {
        userData.password = formData.password;
      }

      let response;
      if (user) {
        response = await apiService.updateUsuario(user.id, userData);
      } else {
        response = await apiService.createUsuario(userData);
      }

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || `Error al ${user ? 'actualizar' : 'crear'} usuario`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${user ? 'actualizar' : 'crear'} usuario`);
      console.error(`Error al ${user ? 'actualizar' : 'crear'} usuario:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form">
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
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
              placeholder="Nombre"
            />
            {errors.nombre && (
              <span className="field-error">{errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="apellido">
              Apellido <span className="required">*</span>
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Apellido"
            />
            {errors.apellido && (
              <span className="field-error">{errors.apellido}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="email@ejemplo.com"
          />
          {errors.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            {user ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'} <span className="required">{!user ? '*' : ''}</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!user}
            disabled={loading}
            placeholder={user ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
          />
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rolesIds">
            Roles <span className="required">*</span>
          </label>
          {loadingRoles ? (
            <p>Cargando roles...</p>
          ) : (
            <select
              id="rolesIds"
              name="rolesIds"
              multiple
              value={formData.rolesIds}
              onChange={handleRoleChange}
              required
              disabled={loading}
              className="roles-select"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.nombre} {role.descripcion ? `- ${role.descripcion}` : ''}
                </option>
              ))}
            </select>
          )}
          <p className="form-help-text">
            Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples roles
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
            <span>Usuario activo</span>
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
            {loading ? (user ? 'Actualizando...' : 'Creando...') : (user ? 'Actualizar' : 'Crear')} Usuario
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
