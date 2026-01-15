import express from 'express';
import { testConnection, getTestData } from '../config/database.js';

const router = express.Router();

// GET /api/database/test - Probar conexión a la base de datos
router.get('/test', async (req, res) => {
  try {
    const result = await testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al probar conexión con la base de datos',
      error: error.message,
    });
  }
});

// GET /api/database/data - Obtener datos de prueba
router.get('/data', async (req, res) => {
  try {
    const result = await getTestData();
    if (result.success) {
      res.json({
        success: true,
        message: 'Datos obtenidos correctamente',
        data: result.data,
      });
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos',
      error: error.message,
    });
  }
});

export default router;
