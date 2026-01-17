import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import { FaChartLine, FaBox, FaTags, FaUser, FaUsers, FaWarehouse } from 'react-icons/fa';
import './Reports.css';

interface SummaryData {
  productos: {
    total: string;
    activos: string;
    inactivos: string;
  };
  categorias: {
    total: string;
    activas: string;
    inactivas: string;
  };
  clientes: {
    total: string;
    activos: string;
    inactivos: string;
  };
  usuarios: {
    total: string;
    activos: string;
    inactivos: string;
  };
  stock: {
    total_productos: string;
    stock_bajo: string;
    sin_stock: string;
    unidades_totales: string;
  };
}

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [stockReport, setStockReport] = useState<any[]>([]);
  const [stockStats, setStockStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, stockRes] = await Promise.all([
        apiService.getReportsSummary(),
        apiService.getStockReport(),
      ]);

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data as any);
      }

      if (stockRes.success && stockRes.data) {
        setStockReport(stockRes.data.stock || []);
        setStockStats(stockRes.data.estadisticas || null);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="reports-loading">Cargando reportes...</div>;
  }

  return (
    <div className="admin-reports">
      <div className="admin-reports-header">
        <div className="admin-reports-title-section">
          <h1>Reportes y Analytics</h1>
          <p>Análisis detallado de productos, stock y rendimiento</p>
        </div>
      </div>

      {summary && (
        <div className="reports-summary">
          <div className="summary-card">
            <div className="summary-icon products">
              <FaBox />
            </div>
            <div className="summary-content">
              <div className="summary-value">{summary.productos.total}</div>
              <div className="summary-label">Total Productos</div>
              <div className="summary-details">
                <span className="active">{summary.productos.activos} activos</span>
                <span className="inactive">{summary.productos.inactivos} inactivos</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon categories">
              <FaTags />
            </div>
            <div className="summary-content">
              <div className="summary-value">{summary.categorias.total}</div>
              <div className="summary-label">Total Categorías</div>
              <div className="summary-details">
                <span className="active">{summary.categorias.activas} activas</span>
                <span className="inactive">{summary.categorias.inactivas} inactivas</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon customers">
              <FaUser />
            </div>
            <div className="summary-content">
              <div className="summary-value">{summary.clientes.total}</div>
              <div className="summary-label">Total Clientes</div>
              <div className="summary-details">
                <span className="active">{summary.clientes.activos} activos</span>
                <span className="inactive">{summary.clientes.inactivos} inactivos</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon users">
              <FaUsers />
            </div>
            <div className="summary-content">
              <div className="summary-value">{summary.usuarios.total}</div>
              <div className="summary-label">Total Usuarios</div>
              <div className="summary-details">
                <span className="active">{summary.usuarios.activos} activos</span>
                <span className="inactive">{summary.usuarios.inactivos} inactivos</span>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon stock">
              <FaWarehouse />
            </div>
            <div className="summary-content">
              <div className="summary-value">{summary.stock.total_productos}</div>
              <div className="summary-label">Productos con Stock</div>
              <div className="summary-details">
                <span className="warning">{summary.stock.stock_bajo} bajo stock</span>
                <span className="danger">{summary.stock.sin_stock} sin stock</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {stockStats && (
        <div className="reports-section">
          <div className="section-header">
            <h2>
              <FaWarehouse /> Análisis de Stock
            </h2>
          </div>
          <div className="stock-statistics">
            <div className="stat-item">
              <span>Total Productos:</span>
              <strong>{stockStats.total_productos}</strong>
            </div>
            <div className="stat-item warning">
              <span>Bajo Stock:</span>
              <strong>{stockStats.stock_bajo}</strong>
            </div>
            <div className="stat-item danger">
              <span>Sin Stock:</span>
              <strong>{stockStats.sin_stock}</strong>
            </div>
            <div className="stat-item success">
              <span>Stock Normal:</span>
              <strong>{stockStats.normal}</strong>
            </div>
            <div className="stat-item">
              <span>Total Unidades:</span>
              <strong>{stockStats.unidades_totales}</strong>
            </div>
          </div>
        </div>
      )}

      {stockReport.length > 0 && (
        <div className="reports-section">
          <div className="section-header">
            <h2>
              <FaChartLine /> Productos con Bajo Stock
            </h2>
          </div>
          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {stockReport
                  .filter(p => p.estado_stock === 'bajo_stock' || p.estado_stock === 'sin_stock')
                  .slice(0, 20)
                  .map((product) => (
                    <tr key={product.id}>
                      <td>{product.nombre}</td>
                      <td className="sku-cell">{product.sku || '-'}</td>
                      <td>{product.cantidad_stock}</td>
                      <td>{product.stock_minimo}</td>
                      <td>
                        <span
                          className={`status-badge ${product.estado_stock === 'sin_stock'
                              ? 'danger'
                              : product.estado_stock === 'bajo_stock'
                                ? 'warning'
                                : 'success'
                            }`}
                        >
                          {product.estado_stock === 'sin_stock'
                            ? 'Sin Stock'
                            : product.estado_stock === 'bajo_stock'
                              ? 'Bajo Stock'
                              : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
