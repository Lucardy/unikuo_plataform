import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
// I will not import type here yet because I am not sure if User is exported. 
// I will just leave it as is for now to avoid breaking things if User is not exported.
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import UserForm from '../../../components/UserForm/UserForm';
import PasswordForm from '../../../components/PasswordForm/PasswordForm';
import UsersList from '../../../components/UsersList/UsersList';
import { FaPlus, FaUser } from 'react-icons/fa';
import './Users.css';

interface Role {
  id: string;
  nombre: string;
}

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  activo: boolean;
  roles?: Role[];
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, [includeInactive]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsuarios({ incluir_inactivos: includeInactive });
      if (response.success && response.data?.usuarios) {
        setUsers(response.data.usuarios);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleCloseUserForm = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleUserSuccess = () => {
    loadData();
    handleCloseUserForm();
  };

  const handleChangePassword = (user: User) => {
    setPasswordUser(user);
    setShowPasswordForm(true);
  };

  const handleClosePasswordForm = () => {
    setShowPasswordForm(false);
    setPasswordUser(null);
  };

  const handlePasswordSuccess = () => {
    alert('Contraseña actualizada exitosamente');
    loadData();
    handleClosePasswordForm();
  };

  const handleActivateUser = async (id: string) => {
    try {
      await apiService.activateUsuario(id);
      alert('Usuario activado exitosamente');
      loadData();
    } catch (error) {
      alert('Error al activar usuario');
    }
  };

  const handleDeactivateUser = async (id: string) => {
    try {
      await apiService.deactivateUsuario(id);
      alert('Usuario desactivado exitosamente');
      loadData();
    } catch (error) {
      alert('Error al desactivar usuario');
    }
  };

  if (loading && users.length === 0) {
    return <div className="users-loading">Cargando...</div>;
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.activo).length,
    inactive: users.filter(u => !u.activo).length,
  };

  return (
    <div className="admin-users">
      <div className="admin-users-header">
        <div className="admin-users-title-section">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema</p>
        </div>
        <Button
          onClick={handleCreateUser}
          variant="primary"
          icon={<FaPlus />}
        >
          Crear Usuario
        </Button>
      </div>

      <div className="admin-users-stats">
        <div className="stat-card">
          <FaUser className="stat-icon" />
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Usuarios</div>
          </div>
        </div>
        <div className="stat-card">
          <FaUser className="stat-icon" />
          <div className="stat-content">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Activos</div>
          </div>
        </div>
        <div className="stat-card">
          <FaUser className="stat-icon" />
          <div className="stat-content">
            <div className="stat-value">{stats.inactive}</div>
            <div className="stat-label">Inactivos</div>
          </div>
        </div>
        <div className="stat-item">
          <label className="stat-checkbox">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
            />
            <span>Mostrar inactivos</span>
          </label>
        </div>
      </div>

      <div className="admin-users-content">
        <UsersList
          users={users}
          onEdit={handleEditUser}
          onChangePassword={handleChangePassword}
          onActivate={handleActivateUser}
          onDeactivate={handleDeactivateUser}
        />
      </div>

      {/* Modal de Usuario */}
      <FormModal
        isOpen={showUserForm}
        onClose={handleCloseUserForm}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        formType="lg"
      >
        <UserForm
          user={editingUser || undefined}
          onSuccess={handleUserSuccess}
          onCancel={handleCloseUserForm}
        />
      </FormModal>

      {/* Modal de Cambiar Contraseña */}
      <FormModal
        isOpen={showPasswordForm}
        onClose={handleClosePasswordForm}
        title="Cambiar Contraseña"
        formType="md"
      >
        <PasswordForm
          user={passwordUser || undefined}
          onSuccess={handlePasswordSuccess}
          onCancel={handleClosePasswordForm}
        />
      </FormModal>
    </div>
  );
};

export default Users;
