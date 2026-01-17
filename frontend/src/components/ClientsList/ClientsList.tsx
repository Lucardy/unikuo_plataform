import React from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';
import './ClientsList.css';

import type { ClienteFinal } from '../../services/api';

interface ClientsListProps {
  clients: ClienteFinal[];
  onEdit: (client: ClienteFinal) => void;
  onDelete: (client: ClienteFinal) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ clients, onEdit, onDelete }) => {
  if (clients.length === 0) {
    return (
      <div className="clients-empty">
        <FaUser size={48} />
        <p>No hay clientes registrados</p>
      </div>
    );
  }

  return (
    <div className="clients-list">
      <table className="clients-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Documento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className={!client.activo ? 'inactive' : ''}>
              <td>
                <div className="client-name">
                  <FaUser className="client-icon" />
                  <div>
                    <strong>{client.nombre} {client.apellido}</strong>
                  </div>
                </div>
              </td>
              <td>
                <div className="client-contact">
                  {client.email && (
                    <div className="contact-item">
                      <FaEnvelope /> {client.email}
                    </div>
                  )}
                  {client.telefono && (
                    <div className="contact-item">
                      <FaPhone /> {client.telefono}
                    </div>
                  )}
                  {!client.email && !client.telefono && (
                    <span className="no-contact">-</span>
                  )}
                </div>
              </td>
              <td>
                {client.documento ? (
                  <div className="client-document">
                    <FaIdCard /> {client.documento}
                  </div>
                ) : (
                  <span className="no-document">-</span>
                )}
              </td>
              <td>
                <span className={`status-badge ${client.activo ? 'active' : 'inactive'}`}>
                  {client.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="client-actions">
                  <Button
                    variant="outline"
                    onClick={() => onEdit(client)}
                    icon={<FaEdit />}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(client)}
                    icon={<FaTrash />}
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

export default ClientsList;
