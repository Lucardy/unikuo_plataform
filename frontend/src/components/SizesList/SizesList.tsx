import React, { useMemo } from 'react';
import Button from '../UI/Button/Button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Talle, TipoTalle } from '../../services/api';
import './SizesList.css';

interface SizesListProps {
  sizeTypes: TipoTalle[];
  sizes: Talle[];
  onEdit: (size: Talle) => void;
  onDelete: (id: string) => void;
}

const SizesList: React.FC<SizesListProps> = ({
  sizeTypes,
  sizes,
  onEdit,
  onDelete,
}) => {
  // Agrupar talles por tipo
  const sizesByType = useMemo(() => {
    const grouped: Record<string, Talle[]> = {};

    sizeTypes.forEach(sizeType => {
      grouped[sizeType.id] = sizes
        .filter(s => s.tipo_talle_id === sizeType.id)
        .sort((a, b) => (a.orden || 0) - (b.orden || 0));
    });

    return grouped;
  }, [sizeTypes, sizes]);

  if (sizeTypes.length === 0) {
    return (
      <div className="sizes-empty">
        Primero debes crear al menos un tipo de talle
      </div>
    );
  }

  return (
    <div className="sizes-list">
      {Object.entries(sizesByType).map(([typeId, sizesOfType]) => {
        const sizeType = sizeTypes.find(st => st.id === typeId);
        if (!sizeType) return null;

        return (
          <div key={typeId} className="size-type-group">
            <h3>{sizeType.nombre}</h3>
            {sizesOfType.length === 0 ? (
              <div className="sizes-empty-type">
                No hay talles para este tipo
              </div>
            ) : (
              <div className="sizes-grid">
                {sizesOfType.map((size) => (
                  <div key={size.id} className="size-card">
                    <div className="size-card-header">
                      <span className="size-name">{size.nombre}</span>
                      <div className="size-card-actions">
                        <Button
                          onClick={() => onEdit(size)}
                          variant="outline"
                          icon={<FaEdit />}
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => onDelete(size.id)}
                          variant="danger"
                          icon={<FaTrash />}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                    {size.orden > 0 && (
                      <div className="size-card-meta">Orden: {size.orden}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SizesList;
