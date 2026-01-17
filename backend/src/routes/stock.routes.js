import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as stockController from '../controllers/stock.controller.js';

const router = express.Router();

// ============================================
// RUTAS DE STOCK DE PRODUCTOS
// ============================================

/**
 * GET /api/stock
 * Obtener todos los productos con stock (requiere autenticación)
 */
router.get('/', authenticate, stockController.getAllStock);

/**
 * GET /api/stock/statistics
 * Obtener estadísticas de stock (requiere autenticación)
 */
router.get('/statistics', authenticate, stockController.getStockStatistics);

/**
 * GET /api/stock/products/:id
 * Obtener stock de un producto
 */
router.get('/products/:id', authenticate, stockController.getStockByProductId);

/**
 * POST /api/stock/products/:id
 * Crear o actualizar stock de un producto (requiere autenticación)
 */
router.post('/products/:id', authenticate, stockController.upsertStock);

/**
 * PUT /api/stock/products/:id/add
 * Agregar stock (entrada) (requiere autenticación)
 */
router.put('/products/:id/add', authenticate, stockController.addStock);

/**
 * PUT /api/stock/products/:id/reduce
 * Reducir stock (salida) (requiere autenticación)
 */
router.put('/products/:id/reduce', authenticate, stockController.reduceStock);

/**
 * GET /api/stock/low
 * Obtener productos con stock bajo (requiere autenticación)
 */
router.get('/low', authenticate, stockController.getLowStock);

// ============================================
// RUTAS DE MOVIMIENTOS DE STOCK
// ============================================

/**
 * GET /api/stock/movements
 * Obtener todos los movimientos (requiere autenticación)
 */
router.get('/movements', authenticate, stockController.getAllMovements);

/**
 * GET /api/stock/movements/product/:id
 * Obtener movimientos de un producto (requiere autenticación)
 */
router.get('/movements/product/:id', authenticate, stockController.getProductMovements);

export default router;
