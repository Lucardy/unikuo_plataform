import React, { useMemo } from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './ColorsList.css';
import type { Color } from '../../services/api';

interface ColorsListProps {
  colors: Color[];
  onEdit: (color: Color) => void;
  onDelete: (id: string) => void;
  onToggleActive: (color: Color) => void;
}

const ColorsList: React.FC<ColorsListProps> = ({
  colors,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  // Ordenar colores por order_index y luego por nombre
  const sortedColors = useMemo(() => {
    return [...colors].sort((a, b) => {
      if (a.orden !== b.orden) {
        return a.orden - b.orden;
      }
      return a.nombre.localeCompare(b.nombre);
    });
  }, [colors]);

  if (sortedColors.length === 0) {
    return null; // El mensaje vacío se maneja en el componente padre
  }

  return (
    <div className="colors-list">
      {sortedColors.map((color) => {
        const isActive = color.activo;

        return (
          <div key={color.id} className={`color-card ${!isActive ? 'inactive' : ''}`}>
            <div className="color-card-header">
              <div className="color-info">
                <h3 className="color-name">{color.nombre}</h3>
                <div className="color-meta">
                  {color.mostrar_color && color.codigo_hex && (
                    <span
                      className="color-sample"
                      style={{ backgroundColor: color.codigo_hex }}
                      title={color.codigo_hex}
                    />
                  )}
                  {color.codigo_hex && (
                    <span className="color-hex">{color.codigo_hex}</span>
                  )}
                </div>
              </div>
              <div className="color-status">
                {isActive ? (
                  <span className="status-badge active">
                    <FaCheck /> Activo
                  </span>
                ) : (
                  <span className="status-badge inactive">
                    <FaTimes /> Inactivo
                  </span>
                )}
              </div>
            </div>
            <div className="color-card-actions">
              <Button
                onClick={() => onEdit(color)}
                variant="outline"
                icon={<FaEdit />}
              >
                Editar
              </Button>
              {isActive ? (
                <Button
                  onClick={() => onToggleActive(color)}
                  variant="outline"
                  icon={<FaTimes />}
                >
                  Desactivar
                </Button>
              ) : (
                <Button
                  onClick={() => onToggleActive(color)}
                  variant="outline"
                  icon={<FaCheck />}
                >
                  Activar
                </Button>
              )}
              <Button
                onClick={() => onDelete(color.id)}
                variant="danger"
                icon={<FaTrash />}
              >
                Eliminar
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ColorsList;
