import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as measuresController from '../controllers/measures.controller.js';

const router = express.Router();

// ============================================
// RUTAS DE TIPOS DE MEDIDA
// ============================================

/**
 * GET /api/measures/types
 * Obtener todos los tipos de medida
 */
router.get('/types', authenticate, measuresController.getAllMeasureTypes);

/**
 * GET /api/measures/types/:id
 * Obtener tipo de medida por ID
 */
router.get('/types/:id', authenticate, measuresController.getMeasureTypeById);

/**
 * POST /api/measures/types
 * Crear nuevo tipo de medida (requiere autenticación)
 */
router.post('/types', authenticate, measuresController.createMeasureType);

/**
 * PUT /api/measures/types/:id
 * Actualizar tipo de medida (requiere autenticación)
 */
router.put('/types/:id', authenticate, measuresController.updateMeasureType);

/**
 * DELETE /api/measures/types/:id
 * Eliminar tipo de medida (requiere autenticación - soft delete)
 */
router.delete('/types/:id', authenticate, measuresController.deleteMeasureType);

export default router;
