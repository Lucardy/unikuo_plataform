import React from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import type { TipoMedida } from '../../services/api';
import './MeasureTypesList.css';

interface MeasureTypesListProps {
  measureTypes: TipoMedida[];
  onEdit: (measureType: TipoMedida) => void;
  onDelete: (id: string) => void;
  onToggleActive: (measureType: TipoMedida) => void;
}

const MeasureTypesList: React.FC<MeasureTypesListProps> = ({
  measureTypes,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  if (measureTypes.length === 0) {
    return (
      <div className="measure-types-empty">
        <p>No hay tipos de medida creados</p>
      </div>
    );
  }

  return (
    <div className="measure-types-list">
      {measureTypes.map((measureType) => {
        const isActive = measureType.activo;

        return (
          <div key={measureType.id} className={`measure-type-card ${!isActive ? 'inactive' : ''}`}>
            <div className="measure-type-card-header">
              <div className="measure-type-info">
                <h3>{measureType.nombre}</h3>
                {measureType.descripcion && (
                  <p className="measure-type-description">{measureType.descripcion}</p>
                )}
                {measureType.unidad && (
                  <p className="measure-type-unit">Unidad: {measureType.unidad}</p>
                )}
              </div>
              <div className="measure-type-status">
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
            <div className="measure-type-card-actions">
              <Button
                onClick={() => onEdit(measureType)}
                variant="outline"
                icon={<FaEdit />}
              >
                Editar
              </Button>
              {isActive ? (
                <Button
                  onClick={() => onToggleActive(measureType)}
                  variant="outline"
                  icon={<FaTimes />}
                >
                  Desactivar
                </Button>
              ) : (
                <Button
                  onClick={() => onToggleActive(measureType)}
                  variant="outline"
                  icon={<FaCheck />}
                >
                  Activar
                </Button>
              )}
              <Button
                onClick={() => onDelete(measureType.id)}
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

export default MeasureTypesList;
