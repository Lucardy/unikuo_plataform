import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import corsMiddleware from './middleware/cors.js';
import { tenantResolver } from './middleware/tenantResolver.js';
import config from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import testRoutes from './routes/test.routes.js';
import databaseRoutes from './routes/database.routes.js';
import authRoutes from './routes/auth.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import productsRoutes from './routes/products.routes.js';
import brandsRoutes from './routes/brands.routes.js';
import sizesRoutes from './routes/sizes.routes.js';
import colorsRoutes from './routes/colors.routes.js';
import stockRoutes from './routes/stock.routes.js';
import salesRoutes from './routes/sales.routes.js';
import tenantsRoutes from './routes/tenants.routes.js';
import bannersRoutes from './routes/banners.routes.js';
import measuresRoutes from './routes/measures.routes.js';
import gendersRoutes from './routes/genders.routes.js';
import customersRoutes from './routes/customers.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import usersRoutes from './routes/users.routes.js';
import auditRoutes from './routes/audit.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import cashRegistersRoutes from './routes/cashRegisters.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging básico en desarrollo
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Resolver Tenant (Multi-tenant)
app.use(tenantResolver);

// Rutas
app.use('/api/test', testRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/sizes', sizesRoutes);
app.use('/api/colors', colorsRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/measures', measuresRoutes);
app.use('/api/genders', gendersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/clients', customersRoutes); // Alias para clientes finales
app.use('/api/roles', rolesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/cash-registers', cashRegistersRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Unikuo Platform API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      test: '/api/test',
      health: '/api/test/health',
      database: '/api/database/test',
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        me: '/api/auth/me',
        roles: '/api/auth/roles',
      },
      categories: '/api/categories',
      products: '/api/products',
      brands: '/api/brands',
      sizes: '/api/sizes',
      colors: '/api/colors',
      stock: '/api/stock',
      sales: '/api/sales',
      tenants: '/api/tenants',
      banners: '/api/banners',
      measures: '/api/measures',
      genders: '/api/genders',
      customers: '/api/customers',
      roles: '/api/roles',
      users: '/api/users',
      audit: '/api/audit',
      reports: '/api/reports',
      cashRegisters: '/api/cash-registers',
    },
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path,
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  console.error(`[Error] ${status} - ${message}`);
  if (config.nodeEnv === 'development' && err.stack) {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    message: message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Entorno: ${config.nodeEnv}`);
  console.log(`🔗 API disponible en: ${config.apiUrl}`);
  console.log(`✅ Endpoint de prueba: ${config.apiUrl}/api/test`);
});
