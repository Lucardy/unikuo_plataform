import React, { useState, useEffect, useMemo } from 'react';
import apiService from '../../../services/api';
import type { Color } from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import Modal from '../../../components/UI/Modal/Modal';
import ColorForm from '../../../components/ColorForm/ColorForm';
import ColorsList from '../../../components/ColorsList/ColorsList';
import { FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import './Colors.css';

const Colors: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showColorForm, setShowColorForm] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
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
      const response = await apiService.getColores(includeInactive);
      if (response.success && response.data?.colores) {
        setColors(response.data.colores);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar colores por búsqueda
  const filteredColors = useMemo(() => {
    return colors.filter(color => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          color.nombre?.toLowerCase().includes(term) ||
          color.codigo_hex?.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [colors, searchTerm]);

  const handleCreateColor = () => {
    setEditingColor(null);
    setShowColorForm(true);
  };

  const handleEditColor = (color: Color) => {
    setEditingColor(color);
    setShowColorForm(true);
  };

  const handleCloseColorForm = () => {
    setShowColorForm(false);
    setEditingColor(null);
  };

  const handleColorSuccess = () => {
    loadData();
    handleCloseColorForm();
  };

  const handleToggleColorActive = async (color: Color) => {
    try {
      await apiService.updateColor(color.id, {
        ...color,
        activo: !color.activo,
      });
      alert('Estado actualizado');
      loadData();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const handleDeleteColor = (id: string) => {
    const color = colors.find(c => c.id === id);
    if (color) {
      setDeleteModal({
        isOpen: true,
        id,
        name: color.nombre,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await apiService.deleteColor(deleteModal.id);
      alert('Color eliminado exitosamente');
      loadData();
      setDeleteModal({ isOpen: false, id: null, name: '' });
    } catch (error) {
      alert('Error al eliminar color');
    }
  };

  if (loading && colors.length === 0) {
    return <div className="colors-loading">Cargando...</div>;
  }

  const activeColors = colors.filter(c => c.activo);
  const inactiveColors = colors.filter(c => !c.activo);

  return (
    <div className="admin-colors">
      <div className="admin-colors-header">
        <div className="admin-colors-title-section">
          <h1>Gestión de Colores</h1>
          <p>Administra los colores disponibles para tus productos</p>
        </div>
        <Button
          onClick={handleCreateColor}
          variant="primary"
          icon={<FaPlus />}
        >
          Crear Color
        </Button>
      </div>

      <div className="admin-colors-search">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar colores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {searchTerm && (
          <div className="search-results">
            {filteredColors.length} color{filteredColors.length !== 1 ? 'es' : ''} encontrado{filteredColors.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="admin-colors-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{colors.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Activos:</span>
          <span className="stat-value">{activeColors.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactivos:</span>
          <span className="stat-value">{inactiveColors.length}</span>
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

      <div className="admin-colors-content">
        {filteredColors.length === 0 ? (
          <div className="admin-colors-empty">
            {searchTerm ? (
              <>
                <p>No se encontraron colores que coincidan con "{searchTerm}"</p>
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Limpiar búsqueda
                </Button>
              </>
            ) : (
              <>
                <p>No hay colores creados aún</p>
                <Button onClick={handleCreateColor} variant="primary">
                  Crear Primer Color
                </Button>
              </>
            )}
          </div>
        ) : (
          <ColorsList
            colors={filteredColors}
            onEdit={handleEditColor}
            onDelete={handleDeleteColor}
            onToggleActive={handleToggleColorActive}
          />
        )}
      </div>

      {/* Modal de Color */}
      <FormModal
        isOpen={showColorForm}
        onClose={handleCloseColorForm}
        title={editingColor ? 'Editar Color' : 'Crear Color'}
        formType="md"
      >
        <ColorForm
          color={editingColor}
          onSuccess={handleColorSuccess}
          onCancel={handleCloseColorForm}
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
            ¿Estás seguro de que deseas eliminar el color <strong>{deleteModal.name}</strong>?
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

export default Colors;
