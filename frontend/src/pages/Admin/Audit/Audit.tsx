import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import AuditList from '../../../components/AuditList/AuditList';
import { FaHistory, FaSearch, FaCalendarAlt, FaTable } from 'react-icons/fa';
import './Audit.css';

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

const Audit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    action: '',
    table_name: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAuditLogs({
        fecha_desde: filters.date_from || undefined,
        fecha_hasta: filters.date_to || undefined,
        accion: filters.action || undefined,
        nombre_tabla: filters.table_name || undefined,
        limite: 100,
      });
      if (response.success && response.data?.registros) {
        setLogs(response.data.registros);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    loadData();
  };

  if (loading && logs.length === 0) {
    return <div className="audit-loading">Cargando...</div>;
  }

  return (
    <div className="admin-audit">
      <div className="admin-audit-header">
        <div className="admin-audit-title-section">
          <h1>Auditoría del Sistema</h1>
          <p>Registro de todas las acciones realizadas en el sistema</p>
        </div>
      </div>

      <div className="admin-audit-filters">
        <div className="filter-group">
          <label htmlFor="date_from">
            <FaCalendarAlt /> Fecha Desde
          </label>
          <input
            id="date_from"
            type="date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="date_to">
            <FaCalendarAlt /> Fecha Hasta
          </label>
          <input
            id="date_to"
            type="date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="action">
            <FaSearch /> Acción
          </label>
          <input
            id="action"
            type="text"
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            placeholder="crear, editar, eliminar..."
          />
        </div>
        <div className="filter-group">
          <label htmlFor="table_name">
            <FaTable /> Tabla
          </label>
          <input
            id="table_name"
            type="text"
            value={filters.table_name}
            onChange={(e) => handleFilterChange('table_name', e.target.value)}
            placeholder="products, users..."
          />
        </div>
        <div className="filter-actions">
          <Button variant="primary" onClick={handleSearch} icon={<FaSearch />}>
            Buscar
          </Button>
        </div>
      </div>

      <div className="admin-audit-stats">
        <div className="stat-badge">
          <FaHistory />
          <span>{logs.length} registros</span>
        </div>
      </div>

      <div className="admin-audit-content">
        <AuditList logs={logs} />
      </div>
    </div>
  );
};

export default Audit;
