import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    products: 0,
    categories: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          apiService.getProductos({ limite: 1 }),
          apiService.getCategorias(),
        ]);

        if (productsRes.success && productsRes.data) {
          setStats(prev => ({ ...prev, products: productsRes.data!.total }));
        }

        if (categoriesRes.success && categoriesRes.data) {
          setStats(prev => ({ ...prev, categories: categoriesRes.data!.categorias.length }));
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="admin-dashboard-loading">Cargando...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Gestiona todos los aspectos de tu tienda desde aquí</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Productos</h3>
          <p className="stat-number">{stats.products}</p>
        </div>
        <div className="stat-card">
          <h3>Categorías</h3>
          <p className="stat-number">{stats.categories}</p>
        </div>
      </div>

      <div className="dashboard-user-info">
        <h3>Información del Usuario</h3>
        <p><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        {user?.roles && user.roles.length > 0 && (
          <p><strong>Roles:</strong> {user.roles.map(r => r.nombre || r).join(', ')}</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
