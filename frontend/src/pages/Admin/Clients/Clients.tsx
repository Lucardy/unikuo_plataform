import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import type { ClienteFinal } from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import Modal from '../../../components/UI/Modal/Modal';
import ClientForm from '../../../components/ClientForm/ClientForm';
import ClientsList from '../../../components/ClientsList/ClientsList';
import { FaPlus, FaSearch, FaUser, FaTrash } from 'react-icons/fa';
import './Clients.css';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<ClienteFinal[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [search, setSearch] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingClient, setEditingClient] = useState<ClienteFinal | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    client: ClienteFinal | null;
  }>({
    isOpen: false,
    client: null,
  });

  useEffect(() => {
    loadData();
  }, [includeInactive, search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getClientesFinales({ incluir_inactivos: includeInactive, busqueda: search });
      if (response.success && response.data?.clientes) {
        setClients(response.data.clientes);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = () => {
    setEditingClient(null);
    setShowClientForm(true);
  };

  const handleEditClient = (client: ClienteFinal) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleCloseClientForm = () => {
    setShowClientForm(false);
    setEditingClient(null);
  };

  const handleClientSuccess = () => {
    loadData();
    handleCloseClientForm();
  };

  const handleDeleteClient = (client: ClienteFinal) => {
    setDeleteModal({
      isOpen: true,
      client,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.client) return;

    try {
      await apiService.deleteClienteFinal(deleteModal.client.id);
      alert('Cliente eliminado exitosamente');
      loadData();
      setDeleteModal({ isOpen: false, client: null });
    } catch (error) {
      alert('Error al eliminar cliente');
    }
  };

  if (loading && clients.length === 0) {
    return <div className="clients-loading">Cargando...</div>;
  }

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.activo).length,
    inactive: clients.filter(c => !c.activo).length,
  };

  return (
    <div className="admin-clients">
      <div className="admin-clients-header">
        <div className="admin-clients-title-section">
          <h1>Gestión de Clientes</h1>
          <p>Administra los clientes y contactos de tu tienda</p>
        </div>
        <Button
          onClick={handleCreateClient}
          variant="primary"
          icon={<FaPlus />}
        >
          Nuevo Cliente
        </Button>
      </div>

      <div className="admin-clients-stats">
        <div className="stat-card">
          <FaUser className="stat-icon" />
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Clientes</div>
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
      </div>

      <div className="admin-clients-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <label className="checkbox-filter">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
          />
          <span>Incluir inactivos</span>
        </label>
      </div>

      <div className="admin-clients-content">
        <ClientsList
          clients={clients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      </div>

      {/* Modal de Cliente */}
      <FormModal
        isOpen={showClientForm}
        onClose={handleCloseClientForm}
        title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        formType="lg"
      >
        <ClientForm
          client={editingClient || undefined}
          onSuccess={handleClientSuccess}
          onCancel={handleCloseClientForm}
        />
      </FormModal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, client: null })}
        title="Confirmar Eliminación"
      >
        <div style={{ padding: '20px' }}>
          <p style={{ marginBottom: '20px', color: 'var(--admin-text-primary)' }}>
            ¿Estás seguro de que deseas eliminar a{' '}
            <strong>
              {deleteModal.client?.nombre} {deleteModal.client?.apellido}
            </strong>?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, client: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              <FaTrash /> Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Clients;
