import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import type { Talle, TipoTalle } from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import Modal from '../../../components/UI/Modal/Modal';
import SizeTypeForm from '../../../components/SizeTypeForm/SizeTypeForm';
import SizeForm from '../../../components/SizeForm/SizeForm';
import SizeTypesList from '../../../components/SizeTypesList/SizeTypesList';
import SizesList from '../../../components/SizesList/SizesList';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './Sizes.css';

const Sizes: React.FC = () => {
  const [sizeTypes, setSizeTypes] = useState<TipoTalle[]>([]);
  const [sizes, setSizes] = useState<Talle[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showSizeTypeForm, setShowSizeTypeForm] = useState(false);
  const [showSizeForm, setShowSizeForm] = useState(false);
  const [editingSizeType, setEditingSizeType] = useState<TipoTalle | null>(null);
  const [editingSize, setEditingSize] = useState<Talle | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'sizeType' | 'size' | null;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: '',
  });

  useEffect(() => {
    loadData();
  }, [includeInactive]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sizeTypesRes, sizesRes] = await Promise.all([
        apiService.getTiposTalle(includeInactive),
        apiService.getTalles(),
      ]);

      if (sizeTypesRes.success && sizeTypesRes.data?.tiposTalle) {
        setSizeTypes(sizeTypesRes.data.tiposTalle);
      }

      if (sizesRes.success && sizesRes.data?.talles) {
        setSizes(sizesRes.data.talles);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSizeType = () => {
    setEditingSizeType(null);
    setShowSizeTypeForm(true);
  };

  const handleEditSizeType = (sizeType: TipoTalle) => {
    setEditingSizeType(sizeType);
    setShowSizeTypeForm(true);
  };

  const handleCloseSizeTypeForm = () => {
    setShowSizeTypeForm(false);
    setEditingSizeType(null);
  };

  const handleSizeTypeSuccess = () => {
    loadData();
    handleCloseSizeTypeForm();
  };

  const handleCreateSize = () => {
    setEditingSize(null);
    setShowSizeForm(true);
  };

  const handleEditSize = (size: Talle) => {
    setEditingSize(size);
    setShowSizeForm(true);
  };

  const handleCloseSizeForm = () => {
    setShowSizeForm(false);
    setEditingSize(null);
  };

  const handleSizeSuccess = () => {
    loadData();
    handleCloseSizeForm();
  };

  const handleToggleSizeTypeActive = async (sizeType: TipoTalle) => {
    try {
      await apiService.updateTipoTalle(sizeType.id, {
        ...sizeType,
        activo: !sizeType.activo,
      });
      alert('Estado actualizado');
      loadData();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const handleDeleteSizeType = (id: string) => {
    const sizeType = sizeTypes.find(st => st.id === id);
    if (sizeType) {
      setDeleteModal({
        isOpen: true,
        type: 'sizeType',
        id,
        name: sizeType.nombre,
      });
    }
  };

  const handleDeleteSize = (id: string) => {
    const size = sizes.find(s => s.id === id);
    if (size) {
      setDeleteModal({
        isOpen: true,
        type: 'size',
        id,
        name: size.nombre,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id || !deleteModal.type) return;

    try {
      if (deleteModal.type === 'sizeType') {
        await apiService.deleteTipoTalle(deleteModal.id);
      } else {
        await apiService.deleteTalle(deleteModal.id);
      }
      alert(`${deleteModal.type === 'sizeType' ? 'Tipo de talle' : 'Talle'} eliminado exitosamente`);
      loadData();
      setDeleteModal({ isOpen: false, type: null, id: null, name: '' });
    } catch (error) {
      alert(`Error al eliminar ${deleteModal.type === 'sizeType' ? 'tipo de talle' : 'talle'}`);
    }
  };

  if (loading) {
    return <div className="sizes-loading">Cargando...</div>;
  }

  const activeSizeTypes = sizeTypes.filter(st => st.activo);
  const inactiveSizeTypes = sizeTypes.filter(st => !st.activo);

  return (
    <div className="admin-sizes">
      <div className="admin-sizes-header">
        <div className="admin-sizes-title-section">
          <h1>Gestión de Talles</h1>
          <p>Administra los tipos de talle y los talles disponibles para los productos</p>
        </div>
        <Button
          onClick={handleCreateSizeType}
          variant="primary"
          icon={<FaPlus />}
        >
          Crear Tipo
        </Button>
      </div>

      <div className="admin-sizes-stats">
        <div className="stat-item">
          <span className="stat-label">Total Tipos:</span>
          <span className="stat-value">{sizeTypes.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Activos:</span>
          <span className="stat-value">{activeSizeTypes.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactivos:</span>
          <span className="stat-value">{inactiveSizeTypes.length}</span>
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

      <div className="admin-sizes-content">
        {/* Sección de Tipos de Talle */}
        <div className="sizes-section">
          <div className="sizes-section-header">
            <h2>Tipos de Talle</h2>
          </div>
          <SizeTypesList
            sizeTypes={sizeTypes}
            sizes={sizes}
            onEdit={handleEditSizeType}
            onDelete={handleDeleteSizeType}
            onToggleActive={handleToggleSizeTypeActive}
          />
        </div>

        {/* Sección de Talles */}
        <div className="sizes-section">
          <div className="sizes-section-header">
            <h2>Talles</h2>
            <Button
              onClick={handleCreateSize}
              variant="primary"
              icon={<FaPlus />}
            >
              Crear Talle
            </Button>
          </div>
          <SizesList
            sizeTypes={activeSizeTypes}
            sizes={sizes}
            onEdit={handleEditSize}
            onDelete={handleDeleteSize}
          />
        </div>
      </div>

      {/* Modal de Tipo de Talle */}
      <FormModal
        isOpen={showSizeTypeForm}
        onClose={handleCloseSizeTypeForm}
        title={editingSizeType ? 'Editar Tipo de Talle' : 'Crear Tipo de Talle'}
        formType="md"
      >
        <SizeTypeForm
          sizeType={editingSizeType}
          onSuccess={handleSizeTypeSuccess}
          onCancel={handleCloseSizeTypeForm}
        />
      </FormModal>

      {/* Modal de Talle */}
      <FormModal
        isOpen={showSizeForm}
        onClose={handleCloseSizeForm}
        title={editingSize ? 'Editar Talle' : 'Crear Talle'}
        formType="md"
      >
        <SizeForm
          size={editingSize}
          sizeTypes={sizeTypes}
          sizes={sizes}
          onSuccess={handleSizeSuccess}
          onCancel={handleCloseSizeForm}
        />
      </FormModal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null, id: null, name: '' })}
        title="Confirmar Eliminación"
      >
        <div style={{ padding: '20px' }}>
          <p style={{ marginBottom: '20px', color: 'var(--admin-text-primary)' }}>
            ¿Estás seguro de que deseas eliminar {deleteModal.type === 'sizeType' ? 'el tipo de talle' : 'el talle'} <strong>{deleteModal.name}</strong>?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, type: null, id: null, name: '' })}
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

export default Sizes;
