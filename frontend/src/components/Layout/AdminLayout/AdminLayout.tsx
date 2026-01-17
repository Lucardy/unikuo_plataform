import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  FaChartLine,
  FaBox,
  FaTags,
  FaBars,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaImages,
  FaRuler,
  FaRulerCombined,
  FaVenusMars,
  FaPalette,
  FaTag,
  FaWarehouse,
  FaCashRegister,
  FaFileAlt,
  FaHistory,
  FaUser,
  FaUserShield,
  FaUsers,
  FaShoppingCart,
} from 'react-icons/fa';
import './AdminLayout.css';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: FaChartLine,
      exact: true,
    },
    {
      path: '/admin/banners',
      label: 'Banners',
      icon: FaImages,
    },
    {
      path: '/admin/products',
      label: 'Productos',
      icon: FaBox,
    },
    {
      path: '/admin/categories',
      label: 'Categorías',
      icon: FaTags,
    },
    {
      path: '/admin/sizes',
      label: 'Talles',
      icon: FaRuler,
    },
    {
      path: '/admin/measures',
      label: 'Medidas',
      icon: FaRulerCombined,
    },
    {
      path: '/admin/genders',
      label: 'Géneros',
      icon: FaVenusMars,
    },
    {
      path: '/admin/colors',
      label: 'Colores',
      icon: FaPalette,
    },
    {
      path: '/admin/brands',
      label: 'Marcas',
      icon: FaTag,
    },
    {
      path: '/admin/stock',
      label: 'Stock',
      icon: FaWarehouse,
    },
    {
      path: '/admin/clients',
      label: 'Clientes',
      icon: FaUser,
    },
    {
      path: '/admin/roles',
      label: 'Roles',
      icon: FaUserShield,
    },
    {
      path: '/admin/users',
      label: 'Usuarios',
      icon: FaUsers,
    },
    {
      path: '/admin/audit',
      label: 'Auditoría',
      icon: FaHistory,
    },
    {
      path: '/admin/reports',
      label: 'Reportes',
      icon: FaFileAlt,
    },
    {
      path: '/admin/pos',
      label: 'Punto de Venta',
      icon: FaShoppingCart,
    },
    {
      path: '/admin/cash-registers',
      label: 'Arqueo de Caja',
      icon: FaCashRegister,
    },
    // Items del menú pendientes de implementar - se descomentarán cuando se creen las rutas
    /*
    {
      path: '/admin/measures',
      label: 'Medidas',
      icon: FaRulerCombined,
    },
    {
      path: '/admin/genders',
      label: 'Géneros',
      icon: FaVenusMars,
    },
    {
      path: '/admin/colors',
      label: 'Colores',
      icon: FaPalette,
    },
    {
      path: '/admin/brands',
      label: 'Marcas',
      icon: FaTag,
    },
    {
      path: '/admin/stock',
      label: 'Stock',
      icon: FaWarehouse,
    },
    {
      path: '/admin/pos',
      label: 'Punto de Venta',
      icon: FaCashRegister,
    },
    {
      path: '/admin/cash-registers',
      label: 'Arqueos de Caja',
      icon: FaCashRegister,
    },
    {
      path: '/admin/reports',
      label: 'Reportes',
      icon: FaFileAlt,
    },
    {
      path: '/admin/audit',
      label: 'Auditoría',
      icon: FaHistory,
    },
    {
      path: '/admin/clients',
      label: 'Clientes',
      icon: FaUser,
    },
    {
      path: '/admin/roles',
      label: 'Roles',
      icon: FaUserShield,
    },
    {
      path: '/admin/users',
      label: 'Usuarios',
      icon: FaUsers,
    },
    */
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const currentPageTitle = menuItems.find(item => isActive(item.path, item.exact))?.label || 'Administración';

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo" onClick={closeMobileMenu}>
            <span className="admin-logo-text">Unikuo</span>
          </Link>
          <button
            className="sidebar-toggle desktop-only"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <button
            className="sidebar-toggle mobile-only"
            onClick={closeMobileMenu}
            aria-label="Cerrar menú"
          >
            <FaChevronLeft />
          </button>
        </div>

        <nav className="admin-nav">
          <ul className="admin-nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`admin-nav-item ${active ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <Icon className="admin-nav-icon" />
                    <span className="admin-nav-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-footer-item" onClick={closeMobileMenu}>
            <FaHome className="admin-footer-icon" />
            <span className="admin-footer-label">Ir al Sitio</span>
          </Link>
          <button
            className="admin-footer-item admin-footer-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="admin-footer-icon" />
            <span className="admin-footer-label">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Abrir menú"
          >
            <FaBars />
          </button>
          <div className="admin-header-content">
            <h1 className="admin-page-title">{currentPageTitle}</h1>
            <div className="admin-header-actions">
              <div className="admin-user-info">
                <span className="admin-user-name">
                  {user?.nombre} {user?.apellido}
                </span>
                {user?.roles && user.roles.length > 0 && (
                  <span className="admin-user-role">
                    {user.roles.map(r => r.nombre).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>

      {mobileMenuOpen && (
        <div
          className="admin-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AdminLayout;
