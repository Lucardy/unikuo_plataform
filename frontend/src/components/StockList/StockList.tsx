import React from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaHistory, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import type { StockProducto } from '../../services/api';
import './StockList.css';

interface StockListProps {
  stock: StockProducto[];
  onEdit: (item: StockProducto) => void;
  onViewHistory: (productId: string) => void;
}

const StockList: React.FC<StockListProps> = ({ stock, onEdit, onViewHistory }) => {
  if (stock.length === 0) {
    return null; // El mensaje vacío se maneja en el componente padre
  }

  const getStockStatus = (item: StockProducto) => {
    if (item.cantidad <= 0) {
      return { text: 'Sin stock', className: 'no-stock', icon: FaExclamationTriangle };
    }
    if (item.cantidad < item.stock_minimo) {
      return { text: 'Bajo stock', className: 'low-stock', icon: FaExclamationTriangle };
    }
    return { text: 'Normal', className: 'normal', icon: FaCheckCircle };
  };

  return (
    <div className="stock-list">
      <table className="stock-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Código</th>
            <th>Stock Actual</th>
            <th>Stock Mínimo</th>
            <th>Stock Máximo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => {
            const status = getStockStatus(item);
            const StatusIcon = status.icon;

            return (
              <tr key={item.id || item.producto_id} className={`stock-row ${status.className}`}>
                <td className="stock-product">
                  <strong>{item.nombre_producto}</strong>
                </td>
                <td className="stock-code">
                  {item.codigo_producto || '-'}
                </td>
                <td className="stock-quantity">
                  <span className="quantity-value">{item.cantidad}</span>
                </td>
                <td className="stock-min">
                  {item.stock_minimo || 0}
                </td>
                <td className="stock-max">
                  {item.stock_maximo || 0}
                </td>
                <td className="stock-status">
                  <span className={`status-badge ${status.className}`}>
                    <StatusIcon /> {status.text}
                  </span>
                </td>
                <td className="stock-actions">
                  <Button
                    onClick={() => onEdit(item)}
                    variant="outline"
                    icon={<FaEdit />}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => onViewHistory(item.producto_id)}
                    variant="outline"
                    icon={<FaHistory />}
                  >
                    Historial
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
