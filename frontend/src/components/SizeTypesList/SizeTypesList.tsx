import React from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import type { Talle, TipoTalle } from '../../services/api';
import './SizeTypesList.css';

interface SizeTypesListProps {
  sizeTypes: TipoTalle[];
  sizes: Talle[];
  onEdit: (sizeType: TipoTalle) => void;
  onDelete: (id: string) => void;
  onToggleActive: (sizeType: TipoTalle) => void;
}

const SizeTypesList: React.FC<SizeTypesListProps> = ({
  sizeTypes,
  sizes,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  if (sizeTypes.length === 0) {
    return (
      <div className="size-types-empty">
        <p>No hay tipos de talle creados</p>
      </div>
    );
  }

  return (
    <div className="size-types-list">
      {sizeTypes.map((sizeType) => {
        const sizesCount = sizes.filter(s => s.tipo_talle_id === sizeType.id).length;
        const isActive = sizeType.activo;

        return (
          <div key={sizeType.id} className={`size-type-card ${!isActive ? 'inactive' : ''}`}>
            <div className="size-type-card-header">
              <div className="size-type-info">
                <h3>{sizeType.nombre}</h3>
                {sizeType.descripcion && (
                  <p className="size-type-description">{sizeType.descripcion}</p>
                )}
                <span className="size-type-stats">
                  {sizesCount} {sizesCount === 1 ? 'talle' : 'talles'}
                </span>
              </div>
              <div className="size-type-status">
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
            <div className="size-type-card-actions">
              <Button
                onClick={() => onEdit(sizeType)}
                variant="outline"
                icon={<FaEdit />}
              >
                Editar
              </Button>
              {isActive ? (
                <Button
                  onClick={() => onToggleActive(sizeType)}
                  variant="outline"
                  icon={<FaTimes />}
                >
                  Desactivar
                </Button>
              ) : (
                <Button
                  onClick={() => onToggleActive(sizeType)}
                  variant="outline"
                  icon={<FaCheck />}
                >
                  Activar
                </Button>
              )}
              <Button
                onClick={() => onDelete(sizeType.id)}
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

export default SizeTypesList;
