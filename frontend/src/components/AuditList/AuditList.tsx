import React from 'react';
import { FaCalendarAlt, FaUser, FaTable } from 'react-icons/fa';
import './AuditList.css';

interface AuditLog {
  id: string;
  usuario_id?: string;
  nombre_usuario?: string;
  email_usuario?: string;
  accion: string;
  nombre_tabla?: string;
  registro_id?: string;
  direccion_ip?: string;
  creado_en: string;
}

interface AuditListProps {
  logs: AuditLog[];
}

const AuditList: React.FC<AuditListProps> = ({ logs }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      'crear': '#4caf50',
      'editar': '#2196f3',
      'eliminar': '#f44336',
      'login': '#9c27b0',
      'logout': '#ff9800',
      'ver': '#607d8b',
      'create': '#4caf50',
      'update': '#2196f3',
      'delete': '#f44336',
    };
    return colors[action.toLowerCase()] || '#666';
  };

  if (logs.length === 0) {
    return (
      <div className="audit-empty">
        <p>No se encontraron registros de auditoría</p>
      </div>
    );
  }

  return (
    <div className="audit-list">
      <table className="audit-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Usuario</th>
            <th>Acción</th>
            <th>Tabla</th>
            <th>Registro ID</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>
                <div className="audit-date">
                  <FaCalendarAlt />
                  {formatDate(log.creado_en)}
                </div>
              </td>
              <td>
                <div className="audit-user">
                  <FaUser />
                  {log.nombre_usuario || log.email_usuario || 'Sistema'}
                </div>
              </td>
              <td>
                <span
                  className="audit-action-badge"
                  style={{ backgroundColor: getActionColor(log.accion) }}
                >
                  {log.accion}
                </span>
              </td>
              <td>
                <div className="audit-table-name">
                  <FaTable />
                  {log.nombre_tabla || '-'}
                </div>
              </td>
              <td className="audit-record-id">
                {log.registro_id ? log.registro_id.substring(0, 8) + '...' : '-'}
              </td>
              <td className="audit-ip">{log.direccion_ip || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditList;
