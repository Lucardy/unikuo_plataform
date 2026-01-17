import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import type { TipoMedida } from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import Modal from '../../../components/UI/Modal/Modal';
import MeasureTypeForm from '../../../components/MeasureTypeForm/MeasureTypeForm';
import MeasureTypesList from '../../../components/MeasureTypesList/MeasureTypesList';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './Measures.css';

const Measures: React.FC = () => {
  const [measureTypes, setMeasureTypes] = useState<TipoMedida[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showMeasureTypeForm, setShowMeasureTypeForm] = useState(false);
  const [editingMeasureType, setEditingMeasureType] = useState<TipoMedida | null>(null);
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
      const response = await apiService.getTiposMedida(includeInactive);
      if (response.success && response.data?.tiposMedida) {
        setMeasureTypes(response.data.tiposMedida);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeasureType = () => {
    setEditingMeasureType(null);
    setShowMeasureTypeForm(true);
  };

  const handleEditMeasureType = (measureType: TipoMedida) => {
    setEditingMeasureType(measureType);
    setShowMeasureTypeForm(true);
  };

  const handleCloseMeasureTypeForm = () => {
    setShowMeasureTypeForm(false);
    setEditingMeasureType(null);
  };

  const handleMeasureTypeSuccess = () => {
    loadData();
    handleCloseMeasureTypeForm();
  };

  const handleToggleMeasureTypeActive = async (measureType: TipoMedida) => {
    try {
      await apiService.updateTipoMedida(measureType.id, {
        ...measureType,
        activo: !measureType.activo,
      });
      alert('Estado actualizado');
      loadData();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const handleDeleteMeasureType = (id: string) => {
    const measureType = measureTypes.find(mt => mt.id === id);
    if (measureType) {
      setDeleteModal({
        isOpen: true,
        id,
        name: measureType.nombre,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await apiService.deleteTipoMedida(deleteModal.id);
      alert('Tipo de medida eliminado exitosamente');
      loadData();
      setDeleteModal({ isOpen: false, id: null, name: '' });
    } catch (error) {
      alert('Error al eliminar tipo de medida');
    }
  };

  if (loading) {
    return <div className="measures-loading">Cargando...</div>;
  }

  const activeMeasureTypes = measureTypes.filter(mt => mt.activo);
  const inactiveMeasureTypes = measureTypes.filter(mt => !mt.activo);

  return (
    <div className="admin-measures">
      <div className="admin-measures-header">
        <div className="admin-measures-title-section">
          <h1>Gestión de Medidas</h1>
          <p>Administra los tipos de medida disponibles para los productos</p>
        </div>
        <Button
          onClick={handleCreateMeasureType}
          variant="primary"
          icon={<FaPlus />}
        >
          Crear Tipo
        </Button>
      </div>

      <div className="admin-measures-stats">
        <div className="stat-item">
          <span className="stat-label">Total Tipos:</span>
          <span className="stat-value">{measureTypes.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Activos:</span>
          <span className="stat-value">{activeMeasureTypes.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactivos:</span>
          <span className="stat-value">{inactiveMeasureTypes.length}</span>
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

      <div className="admin-measures-content">
        {/* Sección de Tipos de Medida */}
        <div className="measures-section">
          <div className="measures-section-header">
            <h2>Tipos de Medida</h2>
          </div>
          <MeasureTypesList
            measureTypes={measureTypes}
            onEdit={handleEditMeasureType}
            onDelete={handleDeleteMeasureType}
            onToggleActive={handleToggleMeasureTypeActive}
          />
        </div>
      </div>

      {/* Modal de Tipo de Medida */}
      <FormModal
        isOpen={showMeasureTypeForm}
        onClose={handleCloseMeasureTypeForm}
        title={editingMeasureType ? 'Editar Tipo de Medida' : 'Crear Tipo de Medida'}
        formType="md"
      >
        <MeasureTypeForm
          measureType={editingMeasureType}
          onSuccess={handleMeasureTypeSuccess}
          onCancel={handleCloseMeasureTypeForm}
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
            ¿Estás seguro de que deseas eliminar el tipo de medida <strong>{deleteModal.name}</strong>?
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

export default Measures;
