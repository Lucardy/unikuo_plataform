import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import './Register.css';

// Use Rol from api instead of local definition if possible, but for now I will just use local interface matching api
// Actually, let's use the local one but with Spanish keys as per backend
interface Role {
  id: string;
  nombre: string;
  descripcion?: string;
}

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await apiService.getPublicRoles();
        if (response.success && response.data?.roles) {
          setRoles(response.data.roles);
        }
      } catch (err) {
        console.error('Error al cargar roles:', err);
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        rolesIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
      });
      // El contexto maneja la actualización del estado
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Registrarse</h2>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Juan"
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          {!loadingRoles && roles.length > 0 && (
            <div className="form-group">
              <label>Roles (opcional)</label>
              <div className="roles-checkboxes">
                {roles.map((role) => (
                  <label key={role.id} className="role-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={() => handleRoleChange(role.id)}
                      disabled={loading}
                    />
                    <span>
                      {role.nombre}
                      {role.descripcion && (
                        <small> - {role.descripcion}</small>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
