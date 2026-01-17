import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-ui-overlay" onClick={onClose}>
      <div
        className={`modal-ui-content modal-ui-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-ui-header">
            <h2 className="modal-ui-title">{title}</h2>
            <button
              className="modal-ui-close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        )}
        <div className="modal-ui-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
