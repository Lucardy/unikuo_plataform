import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const userRoles = user.roles?.map(r => r.nombre || r) || [];
  const hasAdminAccess = userRoles.includes('admin') || userRoles.includes('store_owner');

  if (!hasAdminAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
