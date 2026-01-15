import express from 'express';

const router = express.Router();

// GET /api/test - Endpoint de prueba básico
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '¡Conexión exitosa con el backend!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    data: {
      server: 'Unikuo Platform API',
      version: '1.0.0',
      status: 'running',
    },
  });
});

// GET /api/test/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
