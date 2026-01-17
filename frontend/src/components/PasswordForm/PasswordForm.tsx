import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import './PasswordForm.css';

interface User {
  id: string;
  nombre: string;
  apellido: string;
}

interface PasswordFormProps {
  user?: User | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      password: '',
      confirmPassword: '',
    });
    setError(null);
    setErrors({});
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'La confirmación de contraseña es requerida';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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

    if (!user) {
      setError('Usuario no especificado');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.changePasswordUsuario(user.id, { password_nueva: formData.password });

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || 'Error al cambiar contraseña');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
      console.error('Error al cambiar contraseña:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-form">
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {user && (
        <div className="password-form-user">
          <strong>Usuario:</strong> {user.nombre} {user.apellido}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">
            Nueva Contraseña <span className="required">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirmar Contraseña <span className="required">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Repite la contraseña"
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
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
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
