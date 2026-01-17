import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import type { StockProducto } from '../../services/api';
import './StockForm.css';

interface StockFormProps {
  stock?: Partial<StockProducto> | null;
  productName?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StockForm: React.FC<StockFormProps> = ({ stock, productName, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    cantidad: '',
    stock_minimo: '',
    stock_maximo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stock) {
      setFormData({
        cantidad: stock.cantidad?.toString() || '0',
        stock_minimo: stock.stock_minimo?.toString() || '0',
        stock_maximo: stock.stock_maximo?.toString() || '0',
      });
    } else {
      setFormData({
        cantidad: '0',
        stock_minimo: '0',
        stock_maximo: '0',
      });
    }
    setError(null);
  }, [stock]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cantidad = parseInt(formData.cantidad) || 0;
      const stockMinimo = parseInt(formData.stock_minimo) || 0;
      const stockMaximo = parseInt(formData.stock_maximo) || 0;

      if (stockMaximo > 0 && stockMinimo > 0 && stockMaximo < stockMinimo) {
        setError('El stock máximo debe ser mayor o igual al stock mínimo');
        setLoading(false);
        return;
      }

      if (!stock?.producto_id) {
        setError('ID de producto requerido');
        setLoading(false);
        return;
      }

      await apiService.upsertProductStock(stock.producto_id, {
        cantidad,
        stock_minimo: stockMinimo,
        stock_maximo: stockMaximo,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar stock');
      console.error('Error al guardar stock:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-form">
      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {productName && (
        <div className="stock-form-product">
          <strong>Producto:</strong> {productName}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cantidad">
            Cantidad Actual <span className="required">*</span>
          </label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
            min="0"
            disabled={loading}
            placeholder="0"
          />
          <p className="form-help-text">Cantidad actual en stock</p>
        </div>

        <div className="form-group">
          <label htmlFor="stock_minimo">Stock Mínimo</label>
          <input
            type="number"
            id="stock_minimo"
            name="stock_minimo"
            value={formData.stock_minimo}
            onChange={handleChange}
            min="0"
            disabled={loading}
            placeholder="0"
          />
          <p className="form-help-text">Cantidad mínima antes de generar alerta</p>
        </div>

        <div className="form-group">
          <label htmlFor="stock_maximo">Stock Máximo</label>
          <input
            type="number"
            id="stock_maximo"
            name="stock_maximo"
            value={formData.stock_maximo}
            onChange={handleChange}
            min="0"
            disabled={loading}
            placeholder="0"
          />
          <p className="form-help-text">Cantidad máxima recomendada</p>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={loading}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (stock ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockForm;
