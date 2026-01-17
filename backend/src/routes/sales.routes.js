import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as salesController from '../controllers/sales.controller.js';

const router = express.Router();

/**
 * GET /api/sales
 * Obtener todas las ventas (requiere autenticación)
 */
router.get('/', authenticate, salesController.getAllSales);

/**
 * GET /api/sales/:id
 * Obtener venta por ID (requiere autenticación)
 */
router.get('/:id', authenticate, salesController.getSaleById);

/**
 * POST /api/sales
 * Crear nueva venta (requiere autenticación)
 */
router.post('/', authenticate, salesController.createSale);

/**
 * PUT /api/sales/:id/cancel
 * Cancelar venta (requiere autenticación)
 */
router.put('/:id/cancel', authenticate, salesController.cancelSale);

export default router;
