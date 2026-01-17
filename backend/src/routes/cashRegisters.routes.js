import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as cashRegistersController from '../controllers/cash-registers.controller.js';

const router = express.Router();

/**
 * POST /api/cash-registers/open
 * Abrir nuevo turno de caja (requiere autenticación)
 */
router.post('/open', authenticate, cashRegistersController.openCashRegister);

/**
 * PUT /api/cash-registers/:id/close
 * Cerrar turno de caja (requiere autenticación)
 */
router.put('/:id/close', authenticate, cashRegistersController.closeCashRegister);

/**
 * GET /api/cash-registers/current
 * Obtener turno abierto del usuario actual (requiere autenticación)
 */
router.get('/current', authenticate, cashRegistersController.getCurrentCashRegister);

/**
 * GET /api/cash-registers/:id
 * Obtener turno por ID (requiere autenticación)
 */
router.get('/:id', authenticate, cashRegistersController.getCashRegisterById);

/**
 * GET /api/cash-registers/:id/summary
 * Obtener resumen completo de un turno (requiere autenticación)
 */
router.get('/:id/summary', authenticate, cashRegistersController.getCashRegisterSummary);

/**
 * GET /api/cash-registers
 * Listar turnos (requiere autenticación)
 */
router.get('/', authenticate, cashRegistersController.getAllCashRegisters);

export default router;
