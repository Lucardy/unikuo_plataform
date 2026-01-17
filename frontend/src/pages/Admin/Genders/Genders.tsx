import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import type { Genero } from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import Modal from '../../../components/UI/Modal/Modal';
import GenderForm from '../../../components/GenderForm/GenderForm';
import GendersList from '../../../components/GendersList/GendersList';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './Genders.css';

const Genders: React.FC = () => {
  const [genders, setGenders] = useState<Genero[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showGenderForm, setShowGenderForm] = useState(false);
  const [editingGender, setEditingGender] = useState<Genero | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    id: null,
    name: '',
  });

  useEffect(() => {
    loadData();
  }, [includeInactive]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getGeneros(includeInactive);
      if (response.success && response.data?.generos) {
        setGenders(response.data.generos);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGender = () => {
    setEditingGender(null);
    setShowGenderForm(true);
  };

  const handleEditGender = (gender: Genero) => {
    setEditingGender(gender);
    setShowGenderForm(true);
  };

  const handleCloseGenderForm = () => {
    setShowGenderForm(false);
    setEditingGender(null);
  };

  const handleGenderSuccess = () => {
    loadData();
    handleCloseGenderForm();
  };

  const handleToggleGenderActive = async (gender: Genero) => {
    try {
      await apiService.updateGenero(gender.id, {
        ...gender,
        activo: !gender.activo,
      });
      alert('Estado actualizado');
      loadData();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const handleDeleteGender = (id: string) => {
    const gender = genders.find(g => g.id === id);
    if (gender) {
      setDeleteModal({
        isOpen: true,
        id,
        name: gender.nombre,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await apiService.deleteGenero(deleteModal.id);
      alert('Género eliminado exitosamente');
      loadData();
      setDeleteModal({ isOpen: false, id: null, name: '' });
    } catch (error) {
      alert('Error al eliminar género');
    }
  };

  if (loading) {
    return <div className="genders-loading">Cargando...</div>;
  }

  const activeGenders = genders.filter(g => g.activo);
  const inactiveGenders = genders.filter(g => !g.activo);

  return (
    <div className="admin-genders">
      <div className="admin-genders-header">
        <div className="admin-genders-title-section">
          <h1>Gestión de Géneros</h1>
          <p>Administra los géneros disponibles para los productos</p>
        </div>
        <Button
          onClick={handleCreateGender}
          variant="primary"
          icon={<FaPlus />}
        >
          Crear Género
        </Button>
      </div>

      <div className="admin-genders-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{genders.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Activos:</span>
          <span className="stat-value">{activeGenders.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactivos:</span>
          <span className="stat-value">{inactiveGenders.length}</span>
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

      <div className="admin-genders-content">
        <GendersList
          genders={genders}
          onEdit={handleEditGender}
          onDelete={handleDeleteGender}
          onToggleActive={handleToggleGenderActive}
        />
      </div>

      {/* Modal de Género */}
      <FormModal
        isOpen={showGenderForm}
        onClose={handleCloseGenderForm}
        title={editingGender ? 'Editar Género' : 'Crear Género'}
        formType="md"
      >
        <GenderForm
          gender={editingGender}
          onSuccess={handleGenderSuccess}
          onCancel={handleCloseGenderForm}
        />
      </FormModal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
        title="Confirmar Eliminación"
      >
        <div style={{ padding: '20px' }}>
          <p style={{ marginBottom: '20px', color: 'var(--admin-text-primary)' }}>
            ¿Estás seguro de que deseas eliminar el género <strong>{deleteModal.name}</strong>?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
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

export default Genders;
