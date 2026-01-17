import React, { useMemo } from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './GendersList.css';

import type { Genero } from '../../services/api';

interface GendersListProps {
  genders: Genero[];
  onEdit: (gender: Genero) => void;
  onDelete: (id: string) => void;
  onToggleActive: (gender: Genero) => void;
}

const GendersList: React.FC<GendersListProps> = ({
  genders,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  // Ordenar géneros por order_index y luego por nombre
  const sortedGenders = useMemo(() => {
    return [...genders].sort((a, b) => {
      if (a.orden !== b.orden) {
        return a.orden - b.orden;
      }
      return a.nombre.localeCompare(b.nombre);
    });
  }, [genders]);

  if (sortedGenders.length === 0) {
    return (
      <div className="genders-empty">
        <p>No hay géneros creados aún</p>
      </div>
    );
  }

  return (
    <div className="genders-list">
      {sortedGenders.map((gender) => {
        const isActive = gender.activo;

        return (
          <div key={gender.id} className={`gender-card ${!isActive ? 'inactive' : ''}`}>
            <div className="gender-card-header">
              <div className="gender-info">
                <div className="gender-card-title">
                  <h3>{gender.nombre}</h3>
                </div>
                {gender.descripcion && (
                  <p className="gender-description">{gender.descripcion}</p>
                )}
                {gender.orden > 0 && (
                  <span className="gender-order-badge">Orden: {gender.orden}</span>
                )}
              </div>
              <div className="gender-status">
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
            <div className="gender-card-actions">
              <Button
                onClick={() => onEdit(gender)}
                variant="outline"
                icon={<FaEdit />}
              >
                Editar
              </Button>
              {isActive ? (
                <Button
                  onClick={() => onToggleActive(gender)}
                  variant="outline"
                  icon={<FaTimes />}
                >
                  Desactivar
                </Button>
              ) : (
                <Button
                  onClick={() => onToggleActive(gender)}
                  variant="outline"
                  icon={<FaCheck />}
                >
                  Activar
                </Button>
              )}
              <Button
                onClick={() => onDelete(gender.id)}
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

export default GendersList;
