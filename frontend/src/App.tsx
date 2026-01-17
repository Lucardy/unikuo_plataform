import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import AdminLayout from './components/Layout/AdminLayout/AdminLayout';
import AdminRoute from './routing/AdminRoute';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Banners from './pages/Admin/Banners/Banners';
import Products from './pages/Admin/Products/Products';
import Categories from './pages/Admin/Categories/Categories';
import Sizes from './pages/Admin/Sizes/Sizes';
import Measures from './pages/Admin/Measures/Measures';
import Genders from './pages/Admin/Genders/Genders';
import Colors from './pages/Admin/Colors/Colors';
import Brands from './pages/Admin/Brands/Brands';
import Stock from './pages/Admin/Stock/Stock';
import Clients from './pages/Admin/Clients/Clients';
import Roles from './pages/Admin/Roles/Roles';
import Users from './pages/Admin/Users/Users';
import Audit from './pages/Admin/Audit/Audit';
import Reports from './pages/Admin/Reports/Reports';
import POSPage from './pages/Admin/POS/POSPage';
import CashRegisterPage from './pages/Admin/CashRegisters/CashRegisterPage';
import Tenants from './pages/SuperAdmin/Tenants/Tenants';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/admin" replace />
            ) : (
              <div className="auth-page">
                <header className="app-header">
                  <h1>Unikuo Platform</h1>
                  <p>Plataforma para crear tiendas online</p>
                </header>
                <main className="app-main">
                  <Login />
                </main>
              </div>
            )
          }
        />
        <Route
          path="/register"
          element={
            <div className="auth-page">
              <header className="app-header">
                <h1>Unikuo Platform</h1>
                <p>Plataforma para crear tiendas online</p>
              </header>
              <main className="app-main">
                <Register />
              </main>
            </div>
          }
        />

        {/* Rutas de administración */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <AdminRoute>
              <AdminLayout>
                <Banners />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sizes"
          element={
            <AdminRoute>
              <AdminLayout>
                <Sizes />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/measures"
          element={
            <AdminRoute>
              <AdminLayout>
                <Measures />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/genders"
          element={
            <AdminRoute>
              <AdminLayout>
                <Genders />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/colors"
          element={
            <AdminRoute>
              <AdminLayout>
                <Colors />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/brands"
          element={
            <AdminRoute>
              <AdminLayout>
                <Brands />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stock"
          element={
            <AdminRoute>
              <AdminLayout>
                <Stock />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <AdminRoute>
              <AdminLayout>
                <Clients />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <AdminRoute>
              <AdminLayout>
                <Roles />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/audit"
          element={
            <AdminRoute>
              <AdminLayout>
                <Audit />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/pos"
          element={
            <AdminRoute>
              <AdminLayout>
                <POSPage />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cash-registers"
          element={
            <AdminRoute>
              <AdminLayout>
                <CashRegisterPage />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/super/tenants"
          element={
            <AdminRoute>
              <AdminLayout>
                <Tenants />
              </AdminLayout>
            </AdminRoute>
          }
        />
        {/* Rutas pendientes de implementar */}
        {/* 
        <Route
          path="/admin/measures"
          element={
            <AdminRoute>
              <AdminLayout>
                <Measures />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/genders"
          element={
            <AdminRoute>
              <AdminLayout>
                <Genders />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/colors"
          element={
            <AdminRoute>
              <AdminLayout>
                <Colors />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/brands"
          element={
            <AdminRoute>
              <AdminLayout>
                <Brands />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stock"
          element={
            <AdminRoute>
              <AdminLayout>
                <Stock />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/pos"
          element={
            <AdminRoute>
              <AdminLayout>
                <POS />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cash-registers"
          element={
            <AdminRoute>
              <AdminLayout>
                <CashRegisters />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/audit"
          element={
            <AdminRoute>
              <AdminLayout>
                <Audit />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <AdminRoute>
              <AdminLayout>
                <Clients />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <AdminRoute>
              <AdminLayout>
                <Roles />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </AdminRoute>
          }
        />
        */}

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
