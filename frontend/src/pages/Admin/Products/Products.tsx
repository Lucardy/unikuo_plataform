import React, { useState } from 'react';
import Button from '../../../components/UI/Button/Button';
import FormModal from '../../../components/UI/Modal/FormModal';
import ProductForm from '../../../components/ProductForm/ProductForm';
import ProductsList from '../../../components/ProductsList/ProductsList';
import { FaPlus } from 'react-icons/fa';
import './Products.css';

const Products: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    window.location.reload();
  };

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div className="admin-products-title-section">
          <h1>Gestión de Productos</h1>
          <p>Administra todos los productos de tu tienda</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
          icon={<FaPlus />}
        >
          Crear Producto
        </Button>
      </div>

      <ProductsList />

      <FormModal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Crear Nuevo Producto"
        formType="lg"
      >
        <ProductForm onSuccess={handleCreateSuccess} />
      </FormModal>
    </div>
  );
};

export default Products;
