import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import type { Marca } from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import Modal from '../../../components/UI/Modal/Modal';
import BrandForm from '../../../components/BrandForm/BrandForm';
import BrandsList from '../../../components/BrandsList/BrandsList';
import { FaPlus, FaTrash } from 'react-icons/fa';
import './Brands.css';

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Marca | null>(null);
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
      const response = await apiService.getMarcas(includeInactive);
      if (response.success && response.data?.marcas) {
        setBrands(response.data.marcas);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = () => {
    setEditingBrand(null);
    setShowBrandForm(true);
  };

  const handleEditBrand = (brand: Marca) => {
    setEditingBrand(brand);
    setShowBrandForm(true);
  };

  const handleCloseBrandForm = () => {
    setShowBrandForm(false);
    setEditingBrand(null);
  };

  const handleBrandSuccess = () => {
    loadData();
    handleCloseBrandForm();
  };

  const handleToggleBrandActive = async (brand: Marca) => {
    try {
      await apiService.updateMarca(brand.id, {
        ...brand,
        activo: !brand.activo,
      });
      alert('Estado actualizado');
      loadData();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const handleDeleteBrand = (id: string) => {
    const brand = brands.find(b => b.id === id);
    if (brand) {
      setDeleteModal({
        isOpen: true,
        id,
        name: brand.nombre,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await apiService.deleteMarca(deleteModal.id);
      alert('Marca eliminada exitosamente');
      loadData();
      setDeleteModal({ isOpen: false, id: null, name: '' });
    } catch (error) {
      alert('Error al eliminar marca');
    }
  };

  if (loading) {
    return <div className="brands-loading">Cargando...</div>;
  }

  const activeBrands = brands.filter(b => b.activo);
  const inactiveBrands = brands.filter(b => !b.activo);

  return (
    <div className="admin-brands">
      <div className="admin-brands-header">
        <div className="admin-brands-title-section">
          <h1>Gestión de Marcas</h1>
          <p>Administra las marcas disponibles para los productos</p>
        </div>
        <Button
          onClick={handleCreateBrand}
          variant="primary"
          icon={<FaPlus />}
        >
          Crear Marca
        </Button>
      </div>

      <div className="admin-brands-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{brands.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Activas:</span>
          <span className="stat-value">{activeBrands.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactivas:</span>
          <span className="stat-value">{inactiveBrands.length}</span>
        </div>
        <div className="stat-item">
          <label className="stat-checkbox">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
            />
            <span>Mostrar inactivas</span>
          </label>
        </div>
      </div>

      <div className="admin-brands-content">
        <BrandsList
          brands={brands}
          onEdit={handleEditBrand}
          onDelete={handleDeleteBrand}
          onToggleActive={handleToggleBrandActive}
        />
      </div>

      {/* Modal de Marca */}
      <FormModal
        isOpen={showBrandForm}
        onClose={handleCloseBrandForm}
        title={editingBrand ? 'Editar Marca' : 'Crear Marca'}
        formType="md"
      >
        <BrandForm
          brand={editingBrand}
          onSuccess={handleBrandSuccess}
          onCancel={handleCloseBrandForm}
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
            ¿Estás seguro de que deseas eliminar la marca <strong>{deleteModal.name}</strong>?
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

export default Brands;
