import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { ClienteFinal } from '../../services/api';
import './ClientForm.css';

interface ClientFormProps {
  client?: ClienteFinal;
  onSuccess: () => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    documento: '',
    fecha_nacimiento: '',
    notas: '',
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        nombre: client.nombre || '',
        apellido: client.apellido || '',
        email: client.email || '',
        telefono: client.telefono || '',
        direccion: client.direccion || '',
        documento: client.documento || '',
        fecha_nacimiento: client.fecha_nacimiento || '',
        notas: client.notas || '',
        activo: client.activo !== undefined ? client.activo : true,
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        documento: '',
        fecha_nacimiento: '',
        notas: '',
        activo: true,
      });
    }
    setError(null);
    setErrors({});
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
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
      const clientData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim() || undefined,
        telefono: formData.telefono.trim() || undefined,
        direccion: formData.direccion.trim() || undefined,
        documento: formData.documento.trim() || undefined,
        fecha_nacimiento: formData.fecha_nacimiento || undefined,
        notas: formData.notas.trim() || undefined,
        activo: formData.activo,
      };

      let response;
      if (client) {
        response = await apiService.updateClienteFinal(client.id, clientData);
      } else {
        response = await apiService.createClienteFinal(clientData);
      }

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || `Error al ${client ? 'actualizar' : 'crear'} cliente`);
      }
    } catch (err: any) {
      setError(err.message || `Error al ${client ? 'actualizar' : 'crear'} cliente`);
      console.error(`Error al ${client ? 'actualizar' : 'crear'} cliente:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="client-form">
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="email@ejemplo.com"
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={loading}
              placeholder="Teléfono"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="documento">Documento</label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              disabled={loading}
              placeholder="DNI/CUIT"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <textarea
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            rows={3}
            disabled={loading}
            placeholder="Dirección completa"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notas">Notas</label>
          <textarea
            id="notas"
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            rows={3}
            disabled={loading}
            placeholder="Notas adicionales sobre el cliente"
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
            <span>Cliente activo</span>
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
            {loading ? (client ? 'Actualizando...' : 'Creando...') : (client ? 'Actualizar' : 'Crear')} Cliente
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
