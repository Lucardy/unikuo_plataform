import React from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaLock, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import './UsersList.css';

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

interface UsersListProps {
  users: User[];
  onEdit: (user: User) => void;
  onChangePassword: (user: User) => void;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  onEdit,
  onChangePassword,
  onActivate,
  onDeactivate,
}) => {
  if (users.length === 0) {
    return (
      <div className="users-empty">
        <FaUser size={48} />
        <p>No hay usuarios creados aún</p>
      </div>
    );
  }

  return (
    <div className="users-list">
      <table className="users-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={!user.activo ? 'inactive' : ''}>
              <td>
                <div className="user-name">
                  <FaUser className="user-icon" />
                  <div>
                    <strong>{user.nombre} {user.apellido}</strong>
                  </div>
                </div>
              </td>
              <td>
                <span className="user-email">{user.email}</span>
              </td>
              <td>
                <div className="user-roles">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map(role => (
                      <span key={role.id} className="role-badge">
                        {role.nombre}
                      </span>
                    ))
                  ) : (
                    <span className="no-roles">Sin roles</span>
                  )}
                </div>
              </td>
              <td>
                <span className={`status-badge ${user.activo ? 'active' : 'inactive'}`}>
                  {user.activo ? (
                    <>
                      <FaCheck /> Activo
                    </>
                  ) : (
                    <>
                      <FaTimes /> Inactivo
                    </>
                  )}
                </span>
              </td>
              <td>
                <div className="user-actions">
                  <Button
                    variant="outline"
                    onClick={() => onEdit(user)}
                    icon={<FaEdit />}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onChangePassword(user)}
                    icon={<FaLock />}
                  >
                    Contraseña
                  </Button>
                  {user.activo ? (
                    <Button
                      variant="outline"
                      onClick={() => onDeactivate(user.id)}
                      icon={<FaTimes />}
                    >
                      Desactivar
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => onActivate(user.id)}
                      icon={<FaCheck />}
                    >
                      Activar
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
