import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import type { Rol } from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import Modal from '../../../components/UI/Modal/Modal';
import RoleForm from '../../../components/RoleForm/RoleForm';
import RolesList from '../../../components/RolesList/RolesList';
import { FaPlus, FaUserShield, FaTrash } from 'react-icons/fa';
import './Roles.css';

// Role interface imported from api

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Rol | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    role: Rol | null;
  }>({
    isOpen: false,
    role: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getRoles();
      if (response.success && response.data?.roles) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setShowRoleForm(true);
  };

  const handleEditRole = (role: Rol) => {
    setEditingRole(role);
    setShowRoleForm(true);
  };

  const handleCloseRoleForm = () => {
    setShowRoleForm(false);
    setEditingRole(null);
  };

  const handleRoleSuccess = () => {
    loadData();
    handleCloseRoleForm();
  };

  const handleDeleteRole = (role: Rol) => {
    setDeleteModal({
      isOpen: true,
      role,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.role) return;

    try {
      await apiService.deleteRol(deleteModal.role.id);
      alert('Rol eliminado exitosamente');
      loadData();
      setDeleteModal({ isOpen: false, role: null });
    } catch (error: any) {
      alert(error.message || 'Error al eliminar rol');
    }
  };

  if (loading && roles.length === 0) {
    return <div className="roles-loading">Cargando...</div>;
  }

  return (
    <div className="admin-roles">
      <div className="admin-roles-header">
        <div className="admin-roles-title-section">
          <h1>Gestión de Roles</h1>
          <p>Administra los roles y permisos del sistema</p>
        </div>
        <Button
          onClick={handleCreateRole}
          variant="primary"
          icon={<FaPlus />}
        >
          Nuevo Rol
        </Button>
      </div>

      <div className="admin-roles-stats">
        <div className="stat-card">
          <FaUserShield className="stat-icon" />
          <div className="stat-content">
            <div className="stat-value">{roles.length}</div>
            <div className="stat-label">Total Roles</div>
          </div>
        </div>
      </div>

      <div className="admin-roles-content">
        <RolesList
          roles={roles}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />
      </div>

      {/* Modal de Rol */}
      <FormModal
        isOpen={showRoleForm}
        onClose={handleCloseRoleForm}
        title={editingRole ? 'Editar Rol' : 'Nuevo Rol'}
        formType="md"
      >
        <RoleForm
          role={editingRole || undefined}
          onSuccess={handleRoleSuccess}
          onCancel={handleCloseRoleForm}
        />
      </FormModal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, role: null })}
        title="Confirmar Eliminación"
      >
        <div style={{ padding: '20px' }}>
          <p style={{ marginBottom: '20px', color: 'var(--admin-text-primary)' }}>
            ¿Estás seguro de que deseas eliminar el rol <strong>{deleteModal.role?.nombre}</strong>?
          </p>
          {deleteModal.role && (deleteModal.role.cantidad_usuarios || 0) > 0 && (
            <p style={{ marginBottom: '20px', color: '#dc3545', fontSize: '0.9rem' }}>
              ⚠️ Este rol tiene {deleteModal.role.cantidad_usuarios} usuario(s) asignado(s).
              No se puede eliminar hasta que se desasignen todos los usuarios.
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, role: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={(deleteModal.role?.cantidad_usuarios || 0) > 0}
            >
              <FaTrash /> Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Roles;
