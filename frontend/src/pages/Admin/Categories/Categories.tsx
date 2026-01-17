import React, { useState } from 'react';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import CategoryForm from '../../../components/CategoryForm/CategoryForm';
import CategoriesList from '../../../components/CategoriesList/CategoriesList';
import { FaPlus } from 'react-icons/fa';
import './Categories.css';

const Categories: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    window.location.reload();
  };

  return (
    <div className="admin-categories">
      <div className="admin-categories-header">
        <div className="admin-categories-title-section">
          <h1>Gestión de Categorías</h1>
          <p>Organiza tus productos por categorías y subcategorías</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
          icon={<FaPlus />}
        >
          Crear Categoría
        </Button>
      </div>

      <CategoriesList />

      <FormModal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Crear Nueva Categoría"
        formType="md"
      >
        <CategoryForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      </FormModal>
    </div>
  );
};

export default Categories;
