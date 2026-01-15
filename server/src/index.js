import express from 'express';
import corsMiddleware from './middleware/cors.js';
import config from './config/config.js';
import testRoutes from './routes/test.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Logging básico en desarrollo
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rutas
app.use('/api/test', testRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Unikuo Platform API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      test: '/api/test',
      health: '/api/test/health',
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
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
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
