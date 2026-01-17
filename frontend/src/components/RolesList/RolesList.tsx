import React from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaTrash, FaUserShield, FaUsers } from 'react-icons/fa';
import type { Rol } from '../../services/api';
import './RolesList.css';

interface RolesListProps {
  roles: Rol[];
  onEdit: (role: Rol) => void;
  onDelete: (role: Rol) => void;
}

const RolesList: React.FC<RolesListProps> = ({ roles, onEdit, onDelete }) => {
  if (roles.length === 0) {
    return (
      <div className="roles-empty">
        <FaUserShield size={48} />
        <p>No hay roles creados</p>
      </div>
    );
  }

  return (
    <div className="roles-list">
      <table className="roles-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Usuarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>
                <div className="role-name">
                  <FaUserShield className="role-icon" />
                  <strong>{role.nombre}</strong>
                </div>
              </td>
              <td>
                <span className="role-description">
                  {role.descripcion || '-'}
                </span>
              </td>
              <td>
                <div className="role-users">
                  <FaUsers className="users-icon" />
                  <span>{role.cantidad_usuarios || 0}</span>
                </div>
              </td>
              <td>
                <div className="role-actions">
                  <Button
                    variant="outline"
                    onClick={() => onEdit(role)}
                    icon={<FaEdit />}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(role)}
                    icon={<FaTrash />}
                    disabled={(role.cantidad_usuarios || 0) > 0}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolesList;
