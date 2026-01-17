import React from 'react';
import Modal from './Modal';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  formType?: 'sm' | 'md' | 'lg' | 'xl';
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  formType = 'md',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={formType}
    >
      {children}
    </Modal>
  );
};

export default FormModal;
