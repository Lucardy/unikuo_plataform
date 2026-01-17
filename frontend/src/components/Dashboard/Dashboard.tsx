import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import './Dashboard.css';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  domain?: string;
}

function Dashboard() {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar tenant (solo si el usuario tiene tenant_id)
        if (user?.tenant_id) {
          try {
            const tenantResponse = await apiService.getMyTenant();
            if (tenantResponse.success && tenantResponse.data?.tenant) {
              setTenant(tenantResponse.data.tenant);
            }
          } catch (error) {
            // Si es 404, el usuario no tiene tenant (puede ser admin)
            console.log('Usuario sin tenant asignado (puede ser admin)');
          }
        }

        // Cargar estadísticas
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
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return <div className="dashboard-loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {tenant ? (
        <div className="tenant-info">
          <h3>Mi Tienda</h3>
          <p><strong>Nombre:</strong> {tenant.name}</p>
          <p><strong>Slug:</strong> {tenant.slug}</p>
          {tenant.email && <p><strong>Email:</strong> {tenant.email}</p>}
          {tenant.domain && <p><strong>Dominio:</strong> {tenant.domain}</p>}
        </div>
      ) : (
        <div className="tenant-warning">
          {user?.roles?.some(r => r.nombre === 'admin') ? (
            <p>ℹ️ Eres administrador. Puedes ver y gestionar todos los tenants y datos del sistema.</p>
          ) : (
            <p>⚠️ No tienes un tenant asignado. Contacta al administrador.</p>
          )}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Productos</h3>
          <p className="stat-number">{stats.products}</p>
        </div>
        <div className="stat-card">
          <h3>Categorías</h3>
          <p className="stat-number">{stats.categories}</p>
        </div>
      </div>

      <div className="user-info-card">
        <h3>Información del Usuario</h3>
        <p><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        {user?.roles && user.roles.length > 0 && (
          <p><strong>Roles:</strong> {user.roles.map(r => r.nombre).join(', ')}</p>
        )}
        {user?.tenant_id && (
          <p><strong>Tenant ID:</strong> {user.tenant_id}</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
