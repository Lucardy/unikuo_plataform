import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as reportsController from '../controllers/reports.controller.js';

const router = express.Router();

/**
 * GET /api/reports/summary
 * Obtener resumen general de estadísticas (requiere autenticación y rol admin)
 */
router.get('/summary', authenticate, requireRole(['admin', 'store_owner', 'super_admin']), reportsController.getSummaryReport);

/**
 * GET /api/reports/products
 * Obtener reporte de productos (requiere autenticación y rol admin)
 */
router.get('/products', authenticate, requireRole(['admin', 'store_owner', 'super_admin']), reportsController.getProductsReport);

/**
 * GET /api/reports/stock
 * Obtener reporte de stock (requiere autenticación y rol admin)
 */
router.get('/stock', authenticate, requireRole(['admin', 'store_owner', 'super_admin']), reportsController.getStockReport);

export default router;
