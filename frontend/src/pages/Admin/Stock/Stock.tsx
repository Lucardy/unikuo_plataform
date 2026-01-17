import React, { useState, useEffect, useMemo } from 'react';
import apiService from '../../../services/api';
import type { StockProducto, EstadisticasStock } from '../../../services/api';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import Modal from '../../../components/UI/Modal/Modal';
import StockForm from '../../../components/StockForm/StockForm';
import StockList from '../../../components/StockList/StockList';
import { FaPlus, FaSearch, FaWarehouse, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import './Stock.css';

const Stock: React.FC = () => {
  const [stock, setStock] = useState<StockProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [statistics, setStatistics] = useState<EstadisticasStock>({
    total_productos: 0,
    sin_stock: 0,
    stock_bajo: 0,
    unidades_totales: 0,
  });
  const [showStockForm, setShowStockForm] = useState(false);
  const [editingStock, setEditingStock] = useState<StockProducto | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyProductId, setHistoryProductId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    loadStatistics();
  }, [lowStockOnly]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getStockProductos({ stock_bajo: lowStockOnly });
      if (response.success && response.data?.stock) {
        setStock(response.data.stock);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await apiService.getStockStatistics();
      if (response.success && response.data?.estadisticas) {
        setStatistics(response.data.estadisticas);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const filteredStock = useMemo(() => {
    return stock.filter(item => {
      if (search) {
        const term = search.toLowerCase();
        return (
          item.nombre_producto?.toLowerCase().includes(term) ||
          item.codigo_producto?.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [stock, search]);

  const handleCreateStock = () => {
    setEditingStock(null);
    setShowStockForm(true);
  };

  const handleEditStock = (item: StockProducto) => {
    setEditingStock(item);
    setShowStockForm(true);
  };

  const handleCloseStockForm = () => {
    setShowStockForm(false);
    setEditingStock(null);
  };

  const handleStockSuccess = () => {
    loadData();
    loadStatistics();
    handleCloseStockForm();
  };

  const handleViewHistory = (productId: string) => {
    setHistoryProductId(productId);
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
    setHistoryProductId(null);
  };

  if (loading && stock.length === 0) {
    return <div className="stock-loading">Cargando...</div>;
  }

  return (
    <div className="admin-stock">
      <div className="admin-stock-header">
        <div className="admin-stock-title-section">
          <h1>Gestión de Stock</h1>
          <p>Administra el inventario de tus productos</p>
        </div>
        <div className="admin-stock-actions">
          <Button
            onClick={handleCreateStock}
            variant="primary"
            icon={<FaPlus />}
          >
            Crear Stock
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      {statistics && (
        <div className="stock-stats">
          <div className="stat-card">
            <FaWarehouse className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{statistics.total_productos || 0}</div>
              <div className="stat-label">Productos con Stock</div>
            </div>
          </div>
          <div className="stat-card warning">
            <FaExclamationTriangle className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{statistics.stock_bajo || 0}</div>
              <div className="stat-label">Bajo Stock</div>
            </div>
          </div>
          <div className="stat-card danger">
            <FaExclamationTriangle className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{statistics.sin_stock || 0}</div>
              <div className="stat-label">Sin Stock</div>
            </div>
          </div>
          <div className="stat-card info">
            <FaChartLine className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{statistics.unidades_totales || 0}</div>
              <div className="stat-label">Total Unidades</div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-stock-search">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="search-results">
          {search && (
            <span>
              {filteredStock.length} producto{filteredStock.length !== 1 ? 's' : ''} encontrado{filteredStock.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="admin-stock-filters">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          <span>Mostrar solo productos con stock bajo</span>
        </label>
      </div>

      <div className="admin-stock-content">
        {filteredStock.length === 0 ? (
          <div className="admin-stock-empty">
            {search ? (
              <>
                <p>No se encontraron productos que coincidan con "{search}"</p>
                <Button onClick={() => setSearch('')} variant="outline">
                  Limpiar búsqueda
                </Button>
              </>
            ) : (
              <>
                <p>No hay productos con stock registrado aún</p>
                <Button onClick={handleCreateStock} variant="primary">
                  Crear Primer Stock
                </Button>
              </>
            )}
          </div>
        ) : (
          <StockList
            stock={filteredStock}
            onEdit={handleEditStock}
            onViewHistory={handleViewHistory}
          />
        )}
      </div>

      {/* Modal de Stock */}
      <FormModal
        isOpen={showStockForm}
        onClose={handleCloseStockForm}
        title={editingStock ? 'Editar Stock' : 'Crear Stock'}
        formType="md"
      >
        <StockForm
          stock={editingStock || undefined}
          productName={editingStock?.nombre_producto}
          onSuccess={handleStockSuccess}
          onCancel={handleCloseStockForm}
        />
      </FormModal>

      {/* Modal de Historial (simplificado por ahora) */}
      {showHistory && historyProductId && (
        <Modal
          isOpen={showHistory}
          onClose={handleCloseHistory}
          title="Historial de Movimientos"
        >
          <div style={{ padding: '20px' }}>
            <p style={{ color: 'var(--admin-text-secondary)' }}>
              El historial de movimientos se implementará próximamente.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={handleCloseHistory}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Stock;
