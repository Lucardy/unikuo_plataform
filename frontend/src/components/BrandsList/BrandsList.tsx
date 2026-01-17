import React, { useMemo } from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import './BrandsList.css';

import type { Marca } from '../../services/api';

interface BrandsListProps {
  brands: Marca[];
  onEdit: (brand: Marca) => void;
  onDelete: (id: string) => void;
  onToggleActive: (brand: Marca) => void;
}

const BrandsList: React.FC<BrandsListProps> = ({
  brands,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  // Ordenar marcas por nombre
  const sortedBrands = useMemo(() => {
    return [...brands].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [brands]);

  if (sortedBrands.length === 0) {
    return (
      <div className="brands-empty">
        <p>No hay marcas creadas aún</p>
      </div>
    );
  }

  return (
    <div className="brands-list">
      {sortedBrands.map((brand) => {
        const isActive = brand.activo;

        return (
          <div key={brand.id} className={`brand-card ${!isActive ? 'inactive' : ''}`}>
            <div className="brand-card-header">
              <div className="brand-info">
                <div className="brand-card-title">
                  {brand.url_logo && (
                    <img
                      src={brand.url_logo}
                      alt={brand.nombre}
                      className="brand-logo"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <h3>{brand.nombre}</h3>
                </div>
                {brand.descripcion && (
                  <p className="brand-description">{brand.descripcion}</p>
                )}
              </div>
              <div className="brand-status">
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
            <div className="brand-card-actions">
              <Button
                onClick={() => onEdit(brand)}
                variant="outline"
                icon={<FaEdit />}
              >
                Editar
              </Button>
              {isActive ? (
                <Button
                  onClick={() => onToggleActive(brand)}
                  variant="outline"
                  icon={<FaTimes />}
                >
                  Desactivar
                </Button>
              ) : (
                <Button
                  onClick={() => onToggleActive(brand)}
                  variant="outline"
                  icon={<FaCheck />}
                >
                  Activar
                </Button>
              )}
              <Button
                onClick={() => onDelete(brand.id)}
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

export default BrandsList;
